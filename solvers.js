/* MathSolvers — step-by-step solvers for the Math AI tutor.
 *
 * Each solver takes the raw question string and returns either null (not its
 * kind of problem) or a result object:
 *   { type, method, input, steps: [{title, lines:[...], note}], answer, level, topicIds }
 * solve() tries the solvers in order and returns the first hit.
 */
(function (global) {
  "use strict";

  var E = global.MathEngine;

  var SUP = { "0": "\u2070", "1": "\u00b9", "2": "\u00b2", "3": "\u00b3", "4": "\u2074",
    "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207b" };

  /* ── Small helpers ── */

  function stripLead(q) {
    return String(q)
      .replace(/^\s*(please\s+)?(can you\s+)?/i, "")
      .replace(/^\s*(solve|calculate|compute|evaluate|work out|simplify|expand(\s+and\s+simplify)?|factorise|factorize|find|determine|what is|what's)\b/i, "")
      .replace(/^\s*(the\s+)?/i, "")
      .replace(/\?+\s*$/, "")
      .replace(/\.\s*$/, "")
      .trim();
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  }

  function fracText(n, d) {
    if (d === 0) return String(n);
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(Math.abs(n), Math.abs(d)) || 1;
    n /= g; d /= g;
    return d === 1 ? String(n) : n + "/" + d;
  }

  function decToFrac(v) {
    if (Number.isInteger(v)) return { n: v, d: 1 };
    for (var k = 1; k <= 8; k++) {
      var scaled = v * Math.pow(10, k);
      if (Math.abs(scaled - Math.round(scaled)) < 1e-9) return { n: Math.round(scaled), d: Math.pow(10, k) };
    }
    return null;
  }

  function ratNorm(r) {
    if (!r || r.d === 0) return null;
    var n = r.n, d = r.d;
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(Math.abs(n), Math.abs(d)) || 1;
    return { n: n / g, d: d / g };
  }

  function fracPow(base, e) {
    var n = 1, d = 1;
    for (var i = 0; i < e; i++) { n *= base.n; d *= base.d; }
    return ratNorm({ n: n, d: d });
  }

  function fracEval(node) {
    switch (node.type) {
      case "num": return decToFrac(node.value);
      case "neg": {
        var a = fracEval(node.arg);
        return a ? { n: -a.n, d: a.d } : null;
      }
      case "bin": {
        var l = fracEval(node.left), r = fracEval(node.right);
        if (!l || !r) return null;
        if (node.op === "+") return ratNorm({ n: l.n * r.d + r.n * l.d, d: l.d * r.d });
        if (node.op === "-") return ratNorm({ n: l.n * r.d - r.n * l.d, d: l.d * r.d });
        if (node.op === "*") return ratNorm({ n: l.n * r.n, d: l.d * r.d });
        if (node.op === "/") return r.n === 0 ? null : ratNorm({ n: l.n * r.d, d: l.d * r.n });
        if (node.op === "^") {
          if (r.d !== 1 || !Number.isInteger(r.n)) return null;
          if (r.n < 0) { var inv = ratNorm({ n: l.d, d: l.n }); return inv ? fracPow(inv, -r.n) : null; }
          return fracPow(l, r.n);
        }
        return null;
      }
    }
    return null;
  }

  function num(v) { return E.fmtNum(v); }

  function out(value) { return String(value == null ? "—" : value); }

  /* Render a coefficient/constant as a tidy number, using a fraction when exact. */
  function exactText(v) {
    if (Number.isInteger(v)) return String(v);
    var f = decToFrac(v);
    if (f && Math.abs(f.d) <= 1000) return fracText(f.n, f.d);
    return E.fmtNum(v);
  }

  /* Like MathEngine.polyToString but with exact fractions instead of decimals. */
  function polyStringExact(p, v) {
    var c = E.trim(p);
    var terms = [];
    for (var k = c.length - 1; k >= 0; k--) {
      var a = c[k];
      if (Math.abs(a) < 1e-12) continue;
      var abs = Math.abs(a);
      var term;
      if (k === 0) term = exactText(abs);
      else {
        var pow = k === 1 ? v : v + "^" + k;
        term = (Math.abs(abs - 1) < 1e-12 ? "" : exactText(abs)) + pow;
      }
      terms.push({ sign: a < 0 ? "−" : "+", term: term });
    }
    if (!terms.length) return "0";
    var out = (terms[0].sign === "−" ? "−" : "") + terms[0].term;
    for (var i = 1; i < terms.length; i++) out += " " + terms[i].sign + " " + terms[i].term;
    return out;
  }

  /* ── Expression expansion (multivariate) ── */

  function splitSum(node) {
    if (node.type === "bin" && node.op === "+") return splitSum(node.left).concat(splitSum(node.right));
    if (node.type === "bin" && node.op === "-") return splitSum(node.left).concat(splitSum(node.right).map(E.neg));
    if (node.type === "neg") return splitSum(node.arg).map(E.neg);
    return [node];
  }

  function splitProduct(node) {
    if (node.type === "bin" && node.op === "*") return splitProduct(node.left).concat(splitProduct(node.right));
    return [node];
  }

  function addFactor(f, coefRef, powers) {
    if (f.type === "num") { coefRef.v *= f.value; return; }
    if (f.type === "neg") { coefRef.v *= -1; addFactor(f.arg, coefRef, powers); return; }
    if (f.type === "bin" && f.op === "^" && E.isNum(f.right) && Number.isInteger(f.right.value)) {
      var k = E.toString(f.left);
      if (!powers[k]) powers[k] = { base: f.left, exp: 0 };
      powers[k].exp += f.right.value;
      return;
    }
    var key = E.toString(f);
    if (!powers[key]) powers[key] = { base: f, exp: 0 };
    powers[key].exp += 1;
  }

  function termsOf(node) {
    var terms = [];
    splitSum(node).forEach(function (t) {
      var coefRef = { v: 1 }, powers = {};
      splitProduct(t).forEach(function (f) { addFactor(f, coefRef, powers); });
      terms.push({ coef: coefRef.v, powers: powers });
    });
    return terms;
  }

  function degreeOf(term) {
    var d = 0;
    Object.keys(term.powers).forEach(function (k) { d += term.powers[k].exp; });
    return d;
  }

  function buildTerm(coef, powers) {
    var abs = Math.abs(coef);
    var factors = [];
    var keys = Object.keys(powers).sort();
    if (Math.abs(abs - 1) > 1e-12 || keys.length === 0) factors.push(E.num(abs));
    keys.forEach(function (k) {
      var p = powers[k];
      factors.push(p.exp === 1 ? p.base : E.bin("^", p.base, E.num(p.exp)));
    });
    var term = factors.reduce(function (a, b) { return a ? E.bin("*", a, b) : b; }, null) || E.num(abs);
    return coef < 0 ? E.neg(term) : term;
  }

  function termsToAst(terms) {
    var map = {};
    terms.forEach(function (t) {
      var sig = Object.keys(t.powers).sort().map(function (k) { return k + "^" + t.powers[k].exp; }).join("*") || "_";
      if (!map[sig]) map[sig] = { coef: 0, powers: t.powers, degree: degreeOf(t) };
      map[sig].coef += t.coef;
    });
    var items = Object.keys(map).map(function (k) { return map[k]; })
      .filter(function (t) { return Math.abs(t.coef) > 1e-12; });

    items.sort(function (a, b) {
      if (b.degree !== a.degree) return b.degree - a.degree;
      return E.toString(buildTerm(Math.abs(b.coef), b.powers)).localeCompare(E.toString(buildTerm(Math.abs(a.coef), a.powers)));
    });

    if (!items.length) return E.num(0);
    var node = null;
    items.forEach(function (it, idx) {
      var term = buildTerm(Math.abs(it.coef), it.powers);
      if (idx === 0) node = it.coef < 0 ? E.neg(term) : term;
      else node = E.bin(it.coef < 0 ? "-" : "+", node, term);
    });
    return node;
  }

  function expandExpression(node) {
    switch (node.type) {
      case "num":
      case "var":
        return node;
      case "neg":
        return E.neg(expandExpression(node.arg));
      case "call":
        return E.call(node.name, node.args.map(expandExpression));
      case "bin": {
        if (node.op === "+") return termsToAst(termsOf(expandExpression(node.left)).concat(termsOf(expandExpression(node.right))));
        if (node.op === "-") {
          return termsToAst(termsOf(expandExpression(node.left)).concat(termsOf(E.neg(expandExpression(node.right)))));
        }
        if (node.op === "*") {
          var A = termsOf(expandExpression(node.left));
          var B = termsOf(expandExpression(node.right));
          var prod = [];
          A.forEach(function (a) { B.forEach(function (b) { prod.push(mulTerms(a, b)); }); });
          return termsToAst(prod);
        }
        if (node.op === "^") {
          var b = expandExpression(node.left);
          if (E.isNum(node.right) && Number.isInteger(node.right.value) && node.right.value >= 0 && node.right.value <= 12) {
            var acc = [{ coef: 1, powers: {} }];
            for (var i = 0; i < node.right.value; i++) {
              var next = [];
              acc.forEach(function (t) { termsOf(b).forEach(function (u) { next.push(mulTerms(t, u)); }); });
              acc = next;
            }
            return termsToAst(acc);
          }
          return E.bin("^", b, expandExpression(node.right));
        }
        return E.bin(node.op, expandExpression(node.left), expandExpression(node.right));
      }
    }
    return node;
  }

  function mulTerms(a, b) {
    var powers = {};
    [a, b].forEach(function (t) {
      Object.keys(t.powers).forEach(function (k) {
        if (!powers[k]) powers[k] = { base: t.powers[k].base, exp: 0 };
        powers[k].exp += t.powers[k].exp;
      });
    });
    return { coef: a.coef * b.coef, powers: powers };
  }

  /* ── Reduction step for arithmetic ── */

  function applyOp(op, a, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? null : a / b;
    if (op === "^") return Math.pow(a, b);
    return null;
  }

  function reduceOnce(node) {
    if (node.type === "neg") {
      var a = reduceOnce(node.arg);
      if (a.hit) return { node: E.neg(a.node), hit: a.hit };
      if (E.isNum(node.arg)) return { node: E.num(-node.arg.value), hit: { from: node, to: E.num(-node.arg.value) } };
      return { node: node, hit: null };
    }
    if (node.type === "bin") {
      var l = reduceOnce(node.left);
      if (l.hit) return { node: E.bin(node.op, l.node, node.right), hit: l.hit };
      var r = reduceOnce(node.right);
      if (r.hit) return { node: E.bin(node.op, node.left, r.node), hit: r.hit };
      if (E.isNum(node.left) && E.isNum(node.right)) {
        var v = applyOp(node.op, node.left.value, node.right.value);
        if (v !== null && isFinite(v)) return { node: E.num(v), hit: { from: node, to: E.num(v) } };
      }
      return { node: node, hit: null };
    }
    if (node.type === "call") {
      for (var i = 0; i < node.args.length; i++) {
        var a2 = reduceOnce(node.args[i]);
        if (a2.hit) {
          var args = node.args.slice();
          args[i] = a2.node;
          return { node: E.call(node.name, args), hit: a2.hit };
        }
      }
      if (node.args.length === 1 && E.isNum(node.args[0]) && E.FUNCTIONS[node.name]) {
        var val = E.FUNCTIONS[node.name](node.args[0].value);
        if (isFinite(val)) return { node: E.num(val), hit: { from: node, to: E.num(val) } };
      }
      return { node: node, hit: null };
    }
    return { node: node, hit: null };
  }

  function arithmeticSteps(ast) {
    var lines = [E.toString(ast)];
    var cur = ast, guard = 0;
    while (guard++ < 60) {
      var rr = reduceOnce(cur);
      if (!rr.hit) break;
      cur = rr.node;
      lines.push("= " + E.toString(cur));
    }
    return lines;
  }

  /* =========================================================
   *  Solver: percentages
   * ========================================================= */
  function percentage(q) {
    var m = q.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:of|off)\s*(-?\d+(?:\.\d+)?)/i);
    if (!m) return null;
    var pct = parseFloat(m[1]), base = parseFloat(m[2]);
    var value = pct / 100 * base;
    return {
      type: "Percentage",
      method: "Percentage of a quantity",
      input: num(pct) + "% of " + num(base),
      steps: [
        { title: "Write the percentage as a fraction", lines: [num(pct) + "% = " + num(pct) + "/100 = " + fracText(pct, 100)] },
        { title: "Multiply by the quantity", lines: [fracText(pct, 100) + " × " + num(base) + " = " + num(value)] }
      ],
      answer: num(value),
      level: "Foundation",
      topicIds: ["EM-01", "FM-01"]
    };
  }

  /* =========================================================
   *  Solver: logarithms
   * ========================================================= */
  function logarithms(q) {
    var lower = q.toLowerCase();
    var m;
    var base = null, arg = null;

    if ((m = lower.match(/log\s*base\s*(\d+(?:\.\d+)?)\s*(?:of)?\s*\(?\s*([^)\s]+)\s*\)?/))) {
      base = parseFloat(m[1]); arg = m[2];
    } else if ((m = lower.match(/log\s*_?\s*(\d+)\s*\(\s*([^)\s]+)\s*\)/))) {
      base = parseFloat(m[1]); arg = m[2];
    } else if ((m = lower.match(/log\s*\(\s*([^)\s]+)\s*\)/))) {
      base = 10; arg = m[1];
    } else if ((m = lower.match(/ln\s*\(\s*([^)\s]+)\s*\)/))) {
      base = Math.E; arg = m[1];
    } else {
      return null;
    }

    var argNode;
    try { argNode = E.parse(arg); } catch (e) { return null; }
    if (Object.keys(E.namesIn(argNode)).length) return null;
    var argValue = E.evaluate(argNode);
    if (!(argValue > 0)) return null;

    var value = Math.log(argValue) / Math.log(base);
    var rounded = Math.round(value);
    var exact = Math.abs(value - rounded) < 1e-9;

    var baseText = Math.abs(base - Math.E) < 1e-9 ? "e" : num(base);
    var callText = (Math.abs(base - Math.E) < 1e-9 ? "ln" : "log") + (Math.abs(base - 10) < 1e-9 && base !== Math.E ? "" : "\u2081") + "(" + num(argValue) + ")";
    if (Math.abs(base - 10) < 1e-9) callText = "log(" + num(argValue) + ")";

    return {
      type: "Logarithm",
      method: "Definition of a logarithm",
      input: callText,
      steps: [
        { title: "Use the definition", lines: ["log" + baseText + "(N) = x  means  " + baseText + "^x = N"] },
        { title: "Find the power", lines: [baseText + "^x = " + num(argValue), baseText + "^" + (exact ? rounded : "x") + " = " + num(argValue)] }
      ],
      answer: exact ? String(rounded) : num(value),
      level: "Intermediate",
      topicIds: ["EM-02", "FM-02"]
    };
  }

  /* =========================================================
   *  Solver: sequences and series
   * ========================================================= */
  function sequences(q) {
    var lower = q.toLowerCase();
    if (!/(nth term|arithmetic|geometric|progression|sequence|series|sum of)/.test(lower)) return null;

    // Explicit parameters: a = 3, d = 4, n = 10  (or r for geometric)
    var am = lower.match(/\ba\s*=\s*(-?\d+(?:\.\d+)?)/);
    var dm = lower.match(/\bd\s*=\s*(-?\d+(?:\.\d+)?)/);
    var rm = lower.match(/\br\s*=\s*(-?\d+(?:\.\d+)?)/);
    var nm = lower.match(/\bn\s*=\s*(\d+)/);

    if (am && nm && (dm || rm)) {
      var a = parseFloat(am[1]), n = parseInt(nm[1], 10), isGeo = !!rm;
      var d = isGeo ? parseFloat(rm[1]) : parseFloat(dm[1]);
      var nth = isGeo ? a * Math.pow(d, n - 1) : a + (n - 1) * d;
      var sum = isGeo
        ? (Math.abs(d - 1) < 1e-12 ? a * n : a * (Math.pow(d, n) - 1) / (d - 1))
        : n / 2 * (2 * a + (n - 1) * d);
      var kNth = isGeo ? "a\u2099 = a·r\u207f\u207b\u00b9" : "a\u2099 = a + (n − 1)d";
      var kSum = isGeo ? "S\u2099 = a(r\u207f − 1)/(r − 1)" : "S\u2099 = n/2 · [2a + (n − 1)d]";
      return {
        type: isGeo ? "Geometric sequence" : "Arithmetic sequence",
        method: "nth term and sum formulas",
        input: "a = " + num(a) + ", " + (isGeo ? "r" : "d") + " = " + num(d) + ", n = " + n,
        steps: [
          { title: "Choose the formulas", lines: [kNth, kSum] },
          { title: "Substitute the values", lines: [
            (isGeo ? "r" : "d") + " = " + num(d) + ", a = " + num(a) + ", n = " + n
          ] },
          { title: "Find the nth term", lines: ["a" + n + " = " + num(nth)] },
          { title: "Find the sum of n terms", lines: ["S" + n + " = " + num(sum)] }
        ],
        answer: "a" + n + " = " + num(nth) + ",  S" + n + " = " + num(sum),
        level: "Intermediate",
        topicIds: ["EM-23", "EM-24", "FM-12"]
      };
    }

    // A list of terms: 2, 5, 8, 11
    var listMatch = q.match(/[-\d.,\s]{5,}/);
    if (listMatch) {
      var terms = listMatch[0].split(/[,\s]+/).filter(Boolean).map(Number).filter(function (v) { return !isNaN(v); });
      if (terms.length >= 3) {
        var diffs = [];
        for (var i = 1; i < terms.length; i++) diffs.push(terms[i] - terms[i - 1]);
        var allSame = diffs.every(function (x) { return Math.abs(x - diffs[0]) < 1e-9; });
        if (allSame) {
          var d2 = diffs[0];
          var next = terms[terms.length - 1] + d2;
          var wantN = /\b(\d+)(?:st|nd|rd|th)\b/.exec(q);
          var lines = ["Common difference d = " + num(d2), "a\u2099 = a + (n − 1)d"];
          var ans;
          if (wantN) {
            var nn = parseInt(wantN[1], 10);
            ans = "a" + nn + " = " + num(terms[0] + (nn - 1) * d2);
            lines.push("a" + nn + " = " + num(terms[0]) + " + (" + nn + " − 1)(" + num(d2) + ") = " + num(terms[0] + (nn - 1) * d2));
          } else {
            ans = "next term = " + num(next);
            lines.push("Next term = " + num(terms[terms.length - 1]) + " + " + num(d2) + " = " + num(next));
          }
          return {
            type: "Arithmetic sequence",
            method: "Common difference",
            input: terms.join(", "),
            steps: [
              { title: "Check the differences", lines: lines.slice(0, 1) },
              { title: "Use the nth-term formula", lines: lines.slice(1) }
            ],
            answer: ans,
            level: "Intermediate",
            topicIds: ["EM-23", "EM-24"]
          };
        }
        var ratios = [];
        for (var j = 1; j < terms.length; j++) ratios.push(terms[j] / terms[j - 1]);
        var sameRatio = ratios.every(function (x) { return Math.abs(x - ratios[0]) < 1e-9; });
        if (sameRatio) {
          var r2 = ratios[0];
          return {
            type: "Geometric sequence",
            method: "Common ratio",
            input: terms.join(", "),
            steps: [
              { title: "Check the ratios", lines: ["Common ratio r = " + num(r2)] },
              { title: "Use the nth-term formula", lines: ["a\u2099 = a·r\u207f\u207b\u00b9", "Next term = " + num(terms[terms.length - 1] * r2)] }
            ],
            answer: "next term = " + num(terms[terms.length - 1] * r2),
            level: "Intermediate",
            topicIds: ["EM-23", "EM-24"]
          };
        }
      }
    }
    return null;
  }

  /* =========================================================
   *  Solver: matrices
   * ========================================================= */
  function findMatrixLiterals(text) {
    var re = /\[\[(.+?)\]\]/g, m, found = [];
    while ((m = re.exec(text))) {
      var inner = m[1];
      var rows = inner.split(/\],\s*\[/).map(function (r) { return r.replace(/[\[\]]/g, ""); });
      var matrix = rows.map(function (r) {
        return r.split(/[,\s]+/).filter(Boolean).map(Number);
      });
      if (matrix.length && matrix.every(function (row) { return row.length && row.every(function (v) { return !isNaN(v); }); })) {
        found.push({ start: m.index, end: m.index + m[0].length, matrix: matrix, raw: m[0] });
      }
    }
    return found;
  }

  function matToString(m) {
    return "[" + m.map(function (row) { return "[" + row.map(num).join(", ") + "]"; }).join(", ") + "]";
  }

  function matSize(m) { return m.length + "×" + (m[0] ? m[0].length : 0); }

  function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }

  function minor3(m, r, c) {
    var rows = [];
    for (var i = 0; i < 3; i++) {
      if (i === r) continue;
      var row = [];
      for (var j = 0; j < 3; j++) if (j !== c) row.push(m[i][j]);
      rows.push(row);
    }
    return rows;
  }

  function det3(m) {
    var total = 0;
    for (var c = 0; c < 3; c++) {
      total += (c % 2 === 0 ? 1 : -1) * m[0][c] * (minor3(m, 0, c)[0][0] * minor3(m, 0, c)[1][1] - minor3(m, 0, c)[0][1] * minor3(m, 0, c)[1][0]);
    }
    return total;
  }

  function matrices(q) {
    var lower = q.toLowerCase();
    var literals = findMatrixLiterals(q);
    if (!literals.length) return null;
    if (literals.length === 1) {
      var m = literals[0].matrix;
      var isDet = /\bdet(erminant)?\b|\|/.test(lower);
      var isInv = /\binverse\b|\badjoint\b/.test(lower);

      if (isDet) {
        if (m.length === 2 && m[0].length === 2) {
          var d2 = det2(m);
          return {
            type: "Determinant", method: "2×2 determinant", input: "det " + matToString(m),
            steps: [
              { title: "Use the 2×2 rule", lines: ["det = ad − bc"] },
              { title: "Substitute", lines: ["det = (" + num(m[0][0]) + ")(" + num(m[1][1]) + ") − (" + num(m[0][1]) + ")(" + num(m[1][0]) + ")", "det = " + num(m[0][0] * m[1][1]) + " − " + num(m[0][1] * m[1][0])] }
            ],
            answer: num(d2), level: "Intermediate", topicIds: ["EM-17", "FM-10"]
          };
        }
        if (m.length === 3 && m[0].length === 3) {
          return {
            type: "Determinant", method: "Cofactor expansion", input: "det " + matToString(m),
            steps: [
              { title: "Expand along the first row", lines: ["det = a\u2081\u2081M\u2081\u2081 − a\u2081\u2082M\u2081\u2082 + a\u2081\u2083M\u2081\u2083"] },
              { title: "Evaluate the cofactors and substitute", lines: ["det = " + num(det3(m))] }
            ],
            answer: num(det3(m)), level: "Advanced", topicIds: ["EM-17", "AEM-16"]
          };
        }
        return null;
      }

      if (isInv) {
        if (m.length === 2 && m[0].length === 2) {
          var d = det2(m);
          if (Math.abs(d) < 1e-12) return { type: "Matrix inverse", method: "2×2 inverse", input: matToString(m), steps: [{ title: "Check the determinant", lines: ["det = 0, so the matrix is singular and has no inverse."] }], answer: "No inverse (singular)", level: "Intermediate", topicIds: ["EM-18", "FM-10"] };
          var inv = [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]];
          return {
            type: "Matrix inverse", method: "2×2 inverse formula", input: matToString(m),
            steps: [
              { title: "Find the determinant", lines: ["det = ad − bc = " + num(d)] },
              { title: "Swap a and d, negate b and c", lines: ["adj = " + matToString([[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]])] },
              { title: "Divide by the determinant", lines: ["A\u207b\u00b9 = (1/" + num(d) + ")·adj = " + matToString(inv.map(function (row) { return row.map(function (v) { return Math.round(v * 1e10) / 1e10; }); }))] }
            ],
            answer: matToString(inv.map(function (row) { return row.map(function (v) { return Math.round(v * 1e10) / 1e10; }); })),
            level: "Intermediate", topicIds: ["EM-18", "FM-10"]
          };
        }
        return null;
      }

      return {
        type: "Matrix",
        method: "Reading a matrix",
        input: matToString(m),
        steps: [{ title: "Read the matrix", lines: ["Size: " + matSize(m)] }],
        answer: matSize(m),
        level: "Intermediate",
        topicIds: ["EM-18", "FM-10"]
      };
    }

    if (literals.length === 2) {
      var a = literals[0].matrix, b = literals[1].matrix;
      var between = q.slice(literals[0].end, literals[1].start);
      var op = /\*|×|times|multipl/.test(between) ? "mul" : /\+|\bplus\b/.test(between) ? "add" : /-|−|\bminus\b/.test(between) ? "sub" : null;
      if (!op) return null;

      if (op === "add" || op === "sub") {
        if (a.length !== b.length || a[0].length !== b[0].length) return null;
        var res = a.map(function (row, i) { return row.map(function (v, j) { return op === "add" ? v + b[i][j] : v - b[i][j]; }); });
        return {
          type: "Matrix " + (op === "add" ? "addition" : "subtraction"),
          method: "Element-by-element", input: matToString(a) + (op === "add" ? " + " : " − ") + matToString(b),
          steps: [{ title: "Add/subtract matching elements", lines: ["Result = " + matToString(res)] }],
          answer: matToString(res), level: "Intermediate", topicIds: ["EM-18", "FM-10"]
        };
      }

      if (a[0].length !== b.length) return null;
      var rows = a.length, cols = b[0].length, inner = b.length;
      var product = [];
      var stepLines = [];
      for (var i = 0; i < rows; i++) {
        var prow = [];
        for (var j = 0; j < cols; j++) {
          var acc = 0, parts = [];
          for (var k = 0; k < inner; k++) { acc += a[i][k] * b[k][j]; parts.push("(" + num(a[i][k]) + ")(" + num(b[k][j]) + ")"); }
          prow.push(acc);
          stepLines.push("c" + (i + 1) + (j + 1) + " = " + parts.join(" + ") + " = " + num(acc));
        }
        product.push(prow);
      }
      return {
        type: "Matrix multiplication", method: "Row × column", input: matToString(a) + " × " + matToString(b),
        steps: [
          { title: "Check the sizes", lines: [matSize(a) + " × " + matSize(b) + " → " + rows + "×" + cols] },
          { title: "Multiply rows by columns", lines: stepLines }
        ],
        answer: matToString(product), level: "Advanced", topicIds: ["EM-18", "AEM-16"]
      };
    }
    return null;
  }

  /* =========================================================
   *  Solver: vectors
   * ========================================================= */
  function findVectors(text) {
    var out = [], re = /[(\[<]\s*(-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?)+)\s*[)\]>]/g, m;
    while ((m = re.exec(text))) {
      out.push({ start: m.index, end: m.index + m[0].length, v: m[1].split(",").map(function (s) { return parseFloat(s.trim()); }) });
    }
    return out;
  }

  function vecToString(v) { return "(" + v.map(num).join(", ") + ")"; }
  function dot(a, b) { return a.reduce(function (s, x, i) { return s + x * b[i]; }, 0); }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function norm(a) { return Math.sqrt(dot(a, a)); }

  function vectors(q) {
    var lower = q.toLowerCase();
    if (!/(dot product|cross product|scalar product|vector product|magnitude|unit vector|angle between|modulus|\bvector\b)/.test(lower)) return null;
    var vs = findVectors(q);
    if (!vs.length) return null;

    if (/(dot product|scalar product|\bdot\b)/.test(lower) && vs.length >= 2) {
      var a = vs[0].v, b = vs[1].v;
      var d = dot(a, b);
      var parts = a.map(function (x, i) { return "(" + num(x) + ")(" + num(b[i]) + ")"; });
      return {
        type: "Vector dot product", method: "Scalar product", input: vecToString(a) + " · " + vecToString(b),
        steps: [
          { title: "Use a·b = a\u2081b\u2081 + a\u2082b\u2082 + a\u2083b\u2083", lines: [parts.join(" + ") + " = " + num(d)] }
        ],
        answer: num(d), level: "Intermediate", topicIds: ["EM-19", "FM-11"]
      };
    }

    if (/(cross product|vector product|\bcross\b)/.test(lower) && vs.length >= 2) {
      var a2 = vs[0].v, b2 = vs[1].v;
      if (a2.length !== 3 || b2.length !== 3) return null;
      var c = cross(a2, b2);
      return {
        type: "Vector cross product", method: "Determinant form", input: vecToString(a2) + " × " + vecToString(b2),
        steps: [
          { title: "Use the determinant form", lines: ["a × b = (" + num(c[0]) + ", " + num(c[1]) + ", " + num(c[2]) + ")"] }
        ],
        answer: vecToString(c), level: "Advanced", topicIds: ["EM-19", "AEM-22"]
      };
    }

    if (/angle between/.test(lower) && vs.length >= 2) {
      var a3 = vs[0].v, b3 = vs[1].v;
      var cosT = dot(a3, b3) / (norm(a3) * norm(b3));
      var theta = Math.acos(Math.max(-1, Math.min(1, cosT))) * 180 / Math.PI;
      return {
        type: "Angle between vectors", method: "cos θ = (a·b)/(|a||b|)", input: vecToString(a3) + " and " + vecToString(b3),
        steps: [
          { title: "Find the dot product and magnitudes", lines: ["a·b = " + num(dot(a3, b3)), "|a| = " + num(norm(a3)) + ", |b| = " + num(norm(b3))] },
          { title: "Apply the formula", lines: ["cos θ = " + num(cosT), "θ = " + num(theta) + "°"] }
        ],
        answer: num(theta) + "°", level: "Intermediate", topicIds: ["EM-19", "FM-11"]
      };
    }

    if (/unit vector/.test(lower)) {
      var u = vs[0].v, n = norm(u);
      if (n === 0) return null;
      var unit = u.map(function (x) { return x / n; });
      return {
        type: "Unit vector", method: "Divide by the magnitude", input: vecToString(u),
        steps: [
          { title: "Find the magnitude", lines: ["|u| = √(" + u.map(function (x) { return "(" + num(x) + ")²"; }).join(" + ") + ") = " + num(n)] },
          { title: "Divide each component", lines: ["û = " + vecToString(unit.map(function (x) { return Math.round(x * 1e6) / 1e6; }))] }
        ],
        answer: vecToString(unit.map(function (x) { return Math.round(x * 1e6) / 1e6; })),
        level: "Intermediate", topicIds: ["EM-19", "FM-11"]
      };
    }

    if (/(magnitude|modulus|length)/.test(lower)) {
      var w = vs[0].v, m = norm(w);
      return {
        type: "Vector magnitude", method: "√(x² + y² + z²)", input: vecToString(w),
        steps: [{ title: "Apply the magnitude formula", lines: ["|v| = √(" + w.map(function (x) { return "(" + num(x) + ")²"; }).join(" + ") + ") = " + num(m)] }],
        answer: num(m), level: "Intermediate", topicIds: ["EM-19", "FM-11"]
      };
    }

    return null;
  }

  /* =========================================================
   *  Solver: differentiation
   * ========================================================= */
  function differentiation(q) {
    var m = q.match(/\b(?:differentiate|derivative of|find the derivative of|d\/dx)\b/i);
    if (!m && !/^\s*d\s*\/\s*d[a-z]/i.test(q)) return null;

    var body = q
      .replace(/^\s*(?:differentiate|find the derivative of|derivative of)\s*/i, "")
      .replace(/^\s*d\s*\/\s*d[a-z]\s*/i, "")
      .replace(/\bwith respect to\s+[a-z]\b/i, "")
      .replace(/\?+\s*$/, "")
      .trim();

    var ast;
    try { ast = E.parse(body); } catch (e) { return null; }
    if (ast.type === "eq") ast = ast.right;

    var vars = Object.keys(E.namesIn(ast));
    if (!vars.length) return null;
    var v = vars.length === 1 ? vars[0] : (vars.indexOf("x") >= 0 ? "x" : vars[0]);

    var poly = E.toPoly(ast, v);
    var steps = [{ title: "Write the function", lines: ["f(" + v + ") = " + E.toString(ast)] }];

    if (poly && E.polyDegree(poly) >= 1) {
      var lines = [];
      for (var k = E.trim(poly).length - 1; k >= 0; k--) {
        var c = poly[k];
        if (Math.abs(c) < 1e-12) continue;
        if (k === 0) continue;
        lines.push("d/d" + v + "(" + (Math.abs(c) === 1 ? "" : num(c)) + (k === 1 ? v : v + "^" + k) + ") = " + (c * k === 1 ? "" : num(c * k)) + (k - 1 === 0 ? "" : k - 1 === 1 ? v : v + "^" + (k - 1)));
      }
      lines.push("Constant terms differentiate to 0.");
      steps.push({ title: "Differentiate term by term using d/dx(xⁿ) = n·xⁿ⁻¹", lines: lines });
      var dpoly = E.polyDerivative(poly);
      steps.push({ title: "Collect the terms", lines: ["f'(" + v + ") = " + E.polyToString(dpoly, v)] });
      return {
        type: "Differentiation", method: "Power rule", input: E.toString(ast), steps: steps,
        answer: "f'(" + v + ") = " + E.polyToString(dpoly, v),
        level: "Intermediate", topicIds: ["EM-12", "FM-17"]
      };
    }

    var raw = E.differentiate(ast, v);
    if (!raw) return null;
    var simple = E.simplify(raw);
    steps.push({ title: "Apply the differentiation rules", lines: ["Use the product, quotient and chain rules as needed."] });
    steps.push({ title: "Simplify", lines: ["f'(" + v + ") = " + E.toString(simple)] });

    var hasTrig = /sin|cos|tan/.test(E.toString(ast));
    return {
      type: "Differentiation", method: hasTrig ? "Product / chain rules" : "Standard rules", input: E.toString(ast), steps: steps,
      answer: "f'(" + v + ") = " + E.toString(simple),
      level: "Advanced", topicIds: hasTrig ? ["EM-20", "EM-21", "AEM-14"] : ["EM-12", "EM-20"]
    };
  }

  /* =========================================================
   *  Solver: integration
   * ========================================================= */
  function integration(q) {
    var isIntegral = /∫|\b(?:integrate|integral of|antiderivative)\b/i.test(q);
    if (!isIntegral) return null;

    var body = q
      .replace(/∫/g, " ")
      .replace(/^\s*(?:integrate|find the integral of|integral of|antiderivative of)\s*/i, "")
      .replace(/\bd[a-z]\b\s*$/i, "")
      .replace(/\?+\s*$/, "")
      .trim();

    // Definite limits: "from 0 to 1" (also "between 0 and 1")
    var lo = null, hi = null;
    var lim = body.match(/\bfrom\s*(-?\d+(?:\.\d+)?)\s*to\s*(-?\d+(?:\.\d+)?)/i) ||
              body.match(/\bbetween\s*(-?\d+(?:\.\d+)?)\s*and\s*(-?\d+(?:\.\d+)?)/i);
    if (lim) {
      lo = parseFloat(lim[1]); hi = parseFloat(lim[2]);
      body = body.replace(lim[0], "").trim();
    }
    body = body.replace(/^\s*(from|between)\b.*$/i, "").trim();

    var ast;
    try { ast = E.parse(body); } catch (e) { return null; }

    var vars = Object.keys(E.namesIn(ast));
    var v = vars.length ? (vars.indexOf("x") >= 0 ? "x" : vars[0]) : "x";

    var poly = E.toPoly(ast, v);
    var steps = [{ title: "Write the integral", lines: ["∫ " + E.toString(ast) + " d" + v] }];
    var antideriv = null;

    var antiText = null;
    if (poly && E.polyDegree(poly) >= 1) {
      steps.push({ title: "Integrate term by term using ∫xⁿ dx = xⁿ⁺¹/(n + 1)", lines: ["Apply the power rule to each term."] });
      var antiPoly = E.polyIntegral(poly);
      antideriv = E.polyToAst(antiPoly, v);
      antiText = polyStringExact(antiPoly, v);
      steps.push({ title: "Collect the terms", lines: ["= " + antiText + " + C"] });
    } else {
      var raw = E.integrate(ast, v);
      if (!raw) return null;
      antideriv = E.simplify(raw);
      antiText = E.toString(antideriv);
      steps.push({ title: "Apply the standard results", lines: ["Use ∫sin, ∫cos, ∫eˣ and ∫1/x as needed."] });
      steps.push({ title: "Simplify", lines: ["= " + antiText + " + C"] });
    }

    if (lo === null || hi === null) {
      return {
        type: "Integration", method: "Indefinite integral", input: "∫ " + E.toString(ast) + " d" + v, steps: steps,
        answer: (antiText || E.toString(antideriv)) + " + C",
        level: poly ? "Intermediate" : "Advanced",
        topicIds: ["EM-13", "EM-29", "FM-19"]
      };
    }

    var Fhi = E.evaluate(antideriv, buildVars(v, hi));
    var Flo = E.evaluate(antideriv, buildVars(v, lo));
    var value = Fhi - Flo;
    steps.push({ title: "Evaluate between the limits", lines: ["F(" + num(hi) + ") − F(" + num(lo) + ") = " + num(Fhi) + " − " + num(Flo) + " = " + num(value)] });

    return {
      type: "Definite integral", method: "Fundamental theorem of calculus", input: "∫ from " + num(lo) + " to " + num(hi) + " of " + E.toString(ast) + " d" + v,
      steps: steps, answer: num(value), level: poly ? "Intermediate" : "Advanced",
      topicIds: ["EM-13", "EM-32", "EM-33"]
    };
  }

  function buildVars(v, value) {
    var o = {}; o[v] = value; return o;
  }

  /* =========================================================
   *  Solver: equations (linear, quadratic, polynomial, systems)
   * ========================================================= */

  function splitSystem(q) {
    var parts = String(q).split(/[;\n]|\band\b/gi).map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [];
    parts.forEach(function (p) {
      if ((p.match(/=/g) || []).length > 1) {
        p.split(",").forEach(function (s) { if (s.trim()) out.push(s.trim()); });
      } else {
        out.push(p);
      }
    });
    return out.map(stripLead).filter(Boolean);
  }

  function equationSolve(q) {
    if (q.indexOf("=") < 0) return null;
    var parts = splitSystem(q);
    var equations = [];
    for (var i = 0; i < parts.length; i++) {
      var ast;
      try { ast = E.parse(parts[i]); } catch (e) { return null; }
      if (ast.type !== "eq") return null;
      equations.push(ast);
    }
    if (!equations.length) return null;

    var allVars = {};
    equations.forEach(function (eq) { Object.keys(E.namesIn(eq)).forEach(function (v) { allVars[v] = true; }); });
    var vars = Object.keys(allVars);

    if (equations.length >= 2 && vars.length >= 2) return solveSystem(equations, vars);

    if (vars.length !== 1 || equations.length !== 1) return null;
    var v = vars[0];
    var diff = E.simplify(E.bin("-", equations[0].left, equations[0].right));
    var poly = E.toPoly(diff, v);
    if (!poly) return null;
    var degree = E.polyDegree(poly);

    if (degree === 1) return solveLinear(poly, v);
    if (degree === 2) return solveQuadratic(poly, v);
    if (degree >= 3) return solvePolynomial(poly, v);
    return null;
  }

  function solveLinear(poly, v) {
    var a = poly[1], b = poly[0] || 0;
    var root = -b / a;
    var steps = [
      { title: "Rearrange into the form a" + v + " + b = 0", lines: [E.polyToString(poly, v) + " = 0"] },
      { title: "Isolate " + v, lines: [num(a) + v + " = " + num(-b), v + " = " + num(-b) + " / " + num(a)] }
    ];
    var exact = exactText(root);
    if (exact !== num(root)) steps[1].lines.push(v + " = " + exact);
    return {
      type: "Linear equation", method: "Rearranging", input: E.polyToString(poly, v) + " = 0", steps: steps,
      answer: v + " = " + exact, level: "Foundation", topicIds: ["EM-05", "FM-05"]
    };
  }

  function sqrtSimplify(n) {
    if (n < 0) return null;
    var outside = 1, inside = n;
    for (var i = 2; i * i <= inside; i++) {
      while (inside % (i * i) === 0) { outside *= i; inside /= i * i; }
    }
    return { outside: outside, inside: inside };
  }

  function solveQuadratic(poly, v) {
    var a = poly[2], b = poly[1] || 0, c = poly[0] || 0;
    var d = b * b - 4 * a * c;
    var steps = [
      { title: "Write in standard form a" + v + "² + b" + v + " + c = 0", lines: [E.polyToString(poly, v) + " = 0"] },
      { title: "Identify the coefficients", lines: ["a = " + num(a) + ",  b = " + num(b) + ",  c = " + num(c)] },
      { title: "Calculate the discriminant Δ = b² − 4ac", lines: ["Δ = (" + num(b) + ")² − 4(" + num(a) + ")(" + num(c) + ")", "Δ = " + num(b * b) + " − " + num(4 * a * c) + " = " + num(d)] }
    ];
    var method, answer, level = "Intermediate";

    if (d < 0) {
      method = "Quadratic formula (complex roots)";
      var real = -b / (2 * a), imag = Math.sqrt(-d) / (2 * a);
      steps.push({ title: "Interpret Δ", lines: ["Δ < 0, so the roots are a complex-conjugate pair."] });
      steps.push({ title: "Apply the quadratic formula", lines: [v + " = (" + num(-b) + " ± i√" + num(-d) + ") / " + num(2 * a), v + " = " + num(real) + " ± " + num(imag) + "i"] });
      answer = v + " = " + num(real) + " ± " + num(imag) + "i";
      level = "Advanced";
    } else if (d === 0) {
      method = "Quadratic formula (repeated root)";
      steps.push({ title: "Interpret Δ", lines: ["Δ = 0, so there is one repeated real root."] });
      steps.push({ title: "Apply the formula", lines: [v + " = −b / 2a = " + num(-b / (2 * a))] });
      answer = v + " = " + num(-b / (2 * a)) + " (repeated)";
    } else {
      var sq = Math.sqrt(d);
      var perfect = Number.isInteger(sq);
      if (perfect) {
        method = "Factorising";
        var p = (-b + sq) / (2 * a), qq = (-b - sq) / (2 * a);
        steps.push({ title: "Interpret Δ", lines: ["Δ = " + num(d) + " is a perfect square, so the roots are rational and the quadratic factorises."] });
        var factorText;
        if (Math.abs(a - 1) < 1e-12) {
          factorText = "(" + v + " " + signOf(-p) + " " + exactText(Math.abs(p)) + ")(" + v + " " + signOf(-qq) + " " + exactText(Math.abs(qq)) + ") = 0";
        } else {
          var fs = quadraticFactorSearch(a, b, c, v);
          factorText = fs
            ? fs.text + " = 0"
            : num(a) + "(" + v + " " + signOf(-p) + " " + exactText(Math.abs(p)) + ")(" + v + " " + signOf(-qq) + " " + exactText(Math.abs(qq)) + ") = 0";
        }
        steps.push({ title: "Factorise", lines: [factorText] });
        steps.push({ title: "Set each factor to zero", lines: [v + " = " + exactText(p), v + " = " + exactText(qq)] });
        answer = v + " = " + exactText(p) + ",  " + v + " = " + exactText(qq);
      } else {
        method = "Quadratic formula";
        var sim = sqrtSimplify(d);
        steps.push({ title: "Interpret Δ", lines: ["Δ > 0 but is not a perfect square, so the roots are irrational."] });
        steps.push({ title: "Apply the formula", lines: [v + " = (" + num(-b) + " ± √" + num(d) + ") / " + num(2 * a)] });
        if (sim) {
          var surd = (sim.outside === 1 ? "" : num(sim.outside)) + "√" + num(sim.inside);
          steps.push({ title: "Simplify the surd", lines: ["√" + num(d) + " = " + surd] });
          steps.push({ title: "Give exact and decimal values", lines: [v + " = (" + num(-b) + " ± " + surd + ") / " + num(2 * a), v + " ≈ " + num(p = (-b + sq) / (2 * a)) + " or " + v + " ≈ " + num((-b - sq) / (2 * a))] });
          answer = v + " = (" + num(-b) + " ± " + surd + ") / " + num(2 * a) + "  ≈ " + num((-b + sq) / (2 * a)) + ", " + num((-b - sq) / (2 * a));
        } else {
          answer = v + " = " + num((-b + sq) / (2 * a)) + ",  " + v + " = " + num((-b - sq) / (2 * a));
        }
      }
    }

    return {
      type: "Quadratic equation", method: method, input: E.polyToString(poly, v) + " = 0", steps: steps,
      answer: answer, level: level, topicIds: ["EM-06", "FM-06"]
    };
  }

  function signOf(n) { return n < 0 ? "−" : "+"; }

  function rationalRoots(poly) {
    var p = E.trim(poly);
    if (p.length < 2) return [];
    var lead = p[p.length - 1], constant = p[0];
    if (Math.abs(lead) < 1e-12) return [];
    if (Math.abs(constant) < 1e-12) return [0];
    var factorsOf = function (n) {
      n = Math.abs(Math.round(n));
      var out = [];
      for (var i = 1; i <= n; i++) if (n % i === 0) out.push(i);
      return out;
    };
    var ps = factorsOf(constant), qs = factorsOf(lead), found = [];
    ps.forEach(function (pp) {
      qs.forEach(function (qq) {
        [pp / qq, -pp / qq].forEach(function (cand) {
          if (Math.abs(E.polyEval(p, cand)) < 1e-9) {
            if (!found.some(function (r) { return Math.abs(r - cand) < 1e-9; })) found.push(cand);
          }
        });
      });
    });
    return found;
  }

  function syntheticDivision(poly, root) {
    var p = E.trim(poly);
    var out = [p[p.length - 1]];
    for (var i = p.length - 2; i >= 0; i--) out.push(p[i] + out[out.length - 1] * root);
    var remainder = out.pop();
    return { quotient: E.trim(out.reverse()), remainder: remainder };
  }

  function solvePolynomial(poly, v) {
    var steps = [
      { title: "Write the equation", lines: [E.polyToString(poly, v) + " = 0"] },
      { title: "Try rational roots ±factors of the constant / factors of the leading coefficient", lines: ["Test the candidates."] }
    ];
    var roots = [];
    var current = E.trim(poly);
    var guard = 0;
    while (E.polyDegree(current) >= 3 && guard++ < 6) {
      var candidates = rationalRoots(current);
      if (!candidates.length) break;
      var r = candidates[0];
      var div = syntheticDivision(current, r);
      steps.push({
        title: "Divide by (" + v + " " + signOf(-r) + " " + num(Math.abs(r)) + ")",
        lines: ["Root found: " + v + " = " + num(r), "Quotient (by synthetic division): " + E.polyToString(div.quotient, v)]
      });
      roots.push(r);
      current = div.quotient;
    }

    if (E.polyDegree(current) === 2) {
      var q2 = solveQuadratic(current, v);
      q2.steps.forEach(function (s) { steps.push(s); });
      var a = current[2], b = current[1] || 0, c = current[0] || 0, d = b * b - 4 * a * c;
      if (d >= 0) {
        roots.push((-b + Math.sqrt(d)) / (2 * a));
        roots.push((-b - Math.sqrt(d)) / (2 * a));
      }
    } else if (E.polyDegree(current) === 1) {
      roots.push(-current[0] / current[1]);
    }

    if (!roots.length) {
      steps.push({ title: "No simple rational roots found", lines: ["This polynomial does not factorise with small rational roots; a numerical method is needed."] });
      return {
        type: "Polynomial equation", method: "Rational-root theorem", input: E.polyToString(poly, v) + " = 0", steps: steps,
        answer: "No simple rational roots", level: "Advanced", topicIds: ["EM-06", "EM-03"]
      };
    }

    var unique = [];
    roots.forEach(function (r) {
      if (!unique.some(function (u) { return Math.abs(u - r) < 1e-9; })) unique.push(r);
    });
    unique.sort(function (x, y) { return x - y; });
    var answer = unique.map(function (r) { return v + " = " + num(r); }).join(",  ");
    return {
      type: "Polynomial equation", method: "Rational-root theorem + synthetic division", input: E.polyToString(poly, v) + " = 0",
      steps: steps, answer: answer, level: "Advanced", topicIds: ["EM-06", "EM-03", "FM-06"]
    };
  }

  function solveSystem(equations, vars) {
    var rows = [], rhs = [];
    for (var i = 0; i < equations.length; i++) {
      var eq = equations[i];
      var lin = E.toLinear(E.simplify(E.bin("-", eq.left, eq.right)), vars);
      if (!lin) return null;
      var row = vars.map(function (v) { return lin.coeffs[v] || 0; });
      rows.push(row);
      rhs.push(-lin.constant);
    }
    if (rows.length !== vars.length) return null;

    var n = vars.length;
    var aug = rows.map(function (r, i) { return r.concat([rhs[i]]); });
    var steps = [];
    steps.push({ title: "Write the system", lines: equations.map(function (e) { return E.toString(e); }) });

    var elimination = [];
    for (var col = 0; col < n; col++) {
      var pivot = col;
      for (var r2 = col + 1; r2 < n; r2++) if (Math.abs(aug[r2][col]) > Math.abs(aug[pivot][col])) pivot = r2;
      if (Math.abs(aug[pivot][col]) < 1e-12) return null;
      if (pivot !== col) { var tmp = aug[col]; aug[col] = aug[pivot]; aug[pivot] = tmp; }
      for (var r3 = col + 1; r3 < n; r3++) {
        var factor = aug[r3][col] / aug[col][col];
        if (Math.abs(factor) < 1e-12) continue;
        for (var c2 = col; c2 <= n; c2++) aug[r3][c2] -= factor * aug[col][c2];
        elimination.push("R" + (r3 + 1) + " → R" + (r3 + 1) + " − (" + num(factor) + ")R" + (col + 1));
      }
    }
    steps.push({ title: "Eliminate by row operations (Gaussian elimination)", lines: elimination.length ? elimination : ["The system is already triangular."] });

    var solution = new Array(n);
    for (var r4 = n - 1; r4 >= 0; r4--) {
      var sum = aug[r4][n];
      for (var c3 = r4 + 1; c3 < n; c3++) sum -= aug[r4][c3] * solution[c3];
      solution[r4] = sum / aug[r4][r4];
    }
    steps.push({ title: "Back-substitute", lines: vars.map(function (v, idx) { return v + " = " + num(solution[idx]); }) });

    var answer = vars.map(function (v, idx) { return v + " = " + exactText(solution[idx]); }).join(",  ");
    return {
      type: "Simultaneous linear equations", method: "Gaussian elimination", input: equations.map(function (e) { return E.toString(e); }).join("; "),
      steps: steps, answer: answer, level: "Intermediate", topicIds: ["EM-05", "EM-18", "FM-05"]
    };
  }

  /* =========================================================
   *  Solver: expression work (expand / factorise / simplify)
   * ========================================================= */
  function expressionWork(q) {
    var lower = q.toLowerCase();
    var wantExpand = /\bexpand\b/.test(lower);
    var wantFactor = /\bfactor(is|ize|ise)?\b/.test(lower);
    var wantSimplify = /\bsimplif(y|ies|ied)\b/.test(lower);
    if (!wantExpand && !wantFactor && !wantSimplify) return null;

    var body = q
      .replace(/\bexpand(\s+and\s+simplify)?\b/i, "")
      .replace(/\bfactor(is|ize|ise)?\b/i, "")
      .replace(/\bsimplif(y|ies)\b/i, "")
      .replace(/^\s*(the\s+)?(expression\s+)?/i, "")
      .replace(/\?+\s*$/, "")
      .trim();

    var ast;
    try { ast = E.parse(body); } catch (e) { return null; }
    if (ast.type === "eq") return null;

    var vars = Object.keys(E.namesIn(ast));
    if (!vars.length) return null;

    if (wantFactor) return factorise(ast, vars);

    var expanded = E.simplify(expandExpression(ast));
    var steps = [{ title: "Write the expression", lines: [E.toString(ast)] }];
    if (wantExpand) steps.push({ title: "Multiply out the brackets", lines: ["Apply the distributive law to each pair of brackets."] });
    steps.push({ title: "Collect like terms", lines: ["= " + E.toString(expanded)] });

    var same = E.toString(expanded) === E.toString(ast);
    if (same && vars.length === 1) {
      var poly = E.toPoly(ast, vars[0]);
      if (poly) { expanded = polyToAstLocal(poly, vars[0]); steps[steps.length - 1].lines = ["= " + E.toString(expanded)]; }
    }

    return {
      type: wantExpand ? "Expanding" : "Simplifying",
      method: "Distributive law and collecting like terms",
      input: E.toString(ast), steps: steps,
      answer: E.toString(expanded),
      level: vars.length > 1 ? "Intermediate" : "Foundation",
      topicIds: ["EM-02", "FM-02", "EM-03"]
    };
  }

  function polyToAstLocal(poly, v) {
    return E.polyToAst(poly, v);
  }

  function factorise(ast, vars) {
    if (vars.length !== 1) {
      return {
        type: "Factorising", method: "Common factor", input: E.toString(ast),
        steps: [{ title: "Look for a common factor", lines: ["Multi-variable factorisation is not supported yet — the knowledge base below covers the method."] }],
        answer: "See the topic below", level: "Intermediate", topicIds: ["EM-02", "FM-02"]
      };
    }
    var v = vars[0];
    var poly = E.toPoly(ast, v);
    if (!poly) return null;
    var p = E.trim(poly);
    var steps = [{ title: "Write the expression", lines: [E.polyToString(p, v)] }];

    var content = 0;
    p.forEach(function (c) {
      var ci = Math.round(Math.abs(c) * 1e6);
      content = content === 0 ? ci : gcd(content, ci);
    });
    content = content / 1e6;
    if (!isFinite(content) || content < 1) content = 1;

    var text = null, method = "Common factor";

    if (p[0] === 0 && p.length > 1) {
      var k = 0;
      while (k < p.length && p[k] === 0) k++;
      var rest = p.slice(k);
      text = (v + "^" + k).replace("^1", "") + (rest.length > 1 ? "(" + E.polyToString(rest, v) + ")" : "");
      method = "Common factor";
      steps.push({ title: "Take out the common factor", lines: ["Each term contains " + (k === 1 ? v : v + "^" + k) + ".", "= " + text] });
    } else if (content > 1) {
      var reduced = p.map(function (c) { return c / content; });
      steps.push({ title: "Take out the common numerical factor", lines: ["The common factor is " + num(content) + ".", "= " + num(content) + "(" + E.polyToString(reduced, v) + ")"] });
      text = num(content) + "(" + E.polyToString(reduced, v) + ")";
      p = reduced;
    }

    if (p.length === 3) {
      var a = p[2], b = p[1], c = p[0];
      var found = quadraticFactorSearch(a, b, c);
      if (found) {
        steps.push({ title: "Find two brackets that multiply to give the quadratic", lines: [found.text] });
        text = text ? text + " · " + found.text : found.text;
        method = "Factorising a quadratic";
      } else {
        var d = b * b - 4 * a * c;
        if (d < 0) {
          steps.push({ title: "Check the discriminant", lines: ["Δ = " + num(d) + " < 0, so it does not factorise over the reals."] });
          text = null;
        }
      }
    } else if (p.length === 4) {
      var roots = rationalRoots(p);
      if (roots.length) {
        var r = roots[0];
        var div = syntheticDivision(p, r);
        var factorText = "(" + v + " " + signOf(-r) + " " + num(Math.abs(r)) + ")";
        var inner = div.quotient;
        var qf = inner.length === 3 ? quadraticFactorSearch(inner[2], inner[1], inner[0], v) : null;
        var full = factorText + (qf ? qf.text : "(" + E.polyToString(inner, v) + ")");
        steps.push({ title: "Find a root and divide it out", lines: [v + " = " + num(r) + " is a root, so " + factorText + " is a factor."] });
        steps.push({ title: "Factorise the quotient", lines: [full] });
        text = full;
        method = "Factor theorem";
      }
    }

    if (!text) {
      steps.push({ title: "Result", lines: ["This expression does not factorise with simple rational factors."] });
      return {
        type: "Factorising", method: method, input: E.polyToString(E.trim(poly), v), steps: steps,
        answer: "Does not factorise with simple factors", level: "Intermediate", topicIds: ["EM-02", "EM-08", "FM-07"]
      };
    }

    return {
      type: "Factorising", method: method, input: E.polyToString(E.trim(poly), v), steps: steps,
      answer: text, level: "Intermediate", topicIds: ["EM-02", "EM-08", "FM-07"]
    };
  }

  function quadraticFactorSearch(a, b, c, v) {
    v = v || "x";
    var scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c));
    if (scale > 500) return null;
    var divs = function (n) {
      n = Math.abs(Math.round(n));
      if (n === 0) return [0];
      var out = [];
      for (var i = 1; i <= n; i++) if (n % i === 0) out.push(i);
      return out;
    };
    var A = divs(a), C = divs(c);
    for (var i = 0; i < A.length; i++) {
      for (var j = 0; j < C.length; j++) {
        var m = A[i], n2 = a / m, pp = C[j], s = c / pp;
        if (!Number.isInteger(m) || !Number.isInteger(n2) || !Number.isInteger(pp) || !Number.isInteger(s)) continue;
        var combos = [[m, n2, pp, s], [m, n2, -pp, -s], [-m, -n2, pp, s], [-m, -n2, -pp, -s],
                      [m, n2, s, pp], [m, n2, -s, -pp], [-m, -n2, s, pp], [-m, -n2, -s, -pp]];
        for (var t = 0; t < combos.length; t++) {
          var M = combos[t][0], N = combos[t][1], P = combos[t][2], S = combos[t][3];
          if (M * S + N * P !== b) continue;
          var t1 = "(" + (M === 1 ? "" : M === -1 ? "-" : num(M)) + v + " " + signOf(P) + " " + num(Math.abs(P)) + ")";
          var t2 = "(" + (N === 1 ? "" : N === -1 ? "-" : num(N)) + v + " " + signOf(S) + " " + num(Math.abs(S)) + ")";
          return { text: t1 + t2 };
        }
      }
    }
    return null;
  }

  /* =========================================================
   *  Solver: plain arithmetic (must run last)
   * ========================================================= */
  function arithmetic(q) {
    var body = stripLead(q).replace(/\?+\s*$/, "").trim();
    if (!body) return null;
    if (/[a-df-z]/i.test(body.replace(/\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|ln|log10|log2|exp|sqrt|cbrt|abs|pi)\b/gi, ""))) return null;
    if (body.indexOf("=") >= 0) return null;

    var ast;
    try { ast = E.parse(body); } catch (e) { return null; }
    if (ast.type === "eq") return null;
    if (Object.keys(E.namesIn(ast)).length) return null;
    if (ast.type === "num") return null;

    var value = E.evaluate(ast);
    if (!isFinite(value)) return null;

    var steps = [{ title: "Work through the operations in BIDMAS order", lines: arithmeticSteps(ast) }];

    var frac = fracEval(ast);
    var answer = num(value);
    if (frac && frac.d !== 1 && Math.abs(frac.d) <= 10000) {
      var ft = fracText(frac.n, frac.d);
      steps.push({ title: "Exact value", lines: [ft + " ≈ " + num(value)] });
      answer = ft + "  (≈ " + num(value) + ")";
    }

    return {
      type: "Arithmetic", method: "Order of operations (BIDMAS)", input: E.toString(ast), steps: steps,
      answer: answer, level: "Foundation", topicIds: ["EM-01", "FM-01"]
    };
  }

  /* =========================================================
   *  Routing
   * ========================================================= */
  var SOLVERS = [
    percentage,
    matrices,
    vectors,
    differentiation,
    integration,
    sequences,
    logarithms,
    equationSolve,
    expressionWork,
    arithmetic
  ];

  var SUPPORTED = [
    "Arithmetic, percentages and fractions",
    "Simplifying, expanding and factorising expressions",
    "Linear equations and simultaneous equations",
    "Quadratic and polynomial equations",
    "Logarithms",
    "Sequences and series",
    "Differentiation and basic integration",
    "Matrices: determinant, inverse, multiplication",
    "Vectors: dot product, cross product, magnitude, angle"
  ];

  function solve(question) {
    var q = String(question || "").trim();
    if (!q) return null;
    for (var i = 0; i < SOLVERS.length; i++) {
      var result;
      try {
        result = SOLVERS[i](q);
      } catch (e) {
        result = null;
      }
      if (result) return result;
    }
    return null;
  }

  global.MathSolvers = {
    solve: solve,
    SUPPORTED: SUPPORTED,
    expandExpression: expandExpression,
    termsToAst: termsToAst
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
