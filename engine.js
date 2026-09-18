/* MathEngine — a small expression engine for the Math AI tutor.
 *
 * Provides: tokenising, a recursive-descent parser, numeric evaluation,
 * polynomial algebra, symbolic simplification, differentiation and basic
 * integration. Everything is plain ES5-compatible JavaScript so the page can be
 * opened straight from disk without a build step.
 */
(function (global) {
  "use strict";

  var FUNCTIONS = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    ln: Math.log,
    log: Math.log,
    log10: Math.log10,
    log2: Math.log2,
    exp: Math.exp,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    abs: Math.abs
  };

  var CONSTANTS = { pi: Math.PI, e: Math.E };
  var FUNCTION_NAMES = {};
  Object.keys(FUNCTIONS).forEach(function (k) { FUNCTION_NAMES[k] = true; });

  /* ── AST helpers ── */

  function num(v) { return { type: "num", value: v }; }
  function variable(name) { return { type: "var", name: name }; }
  function bin(op, left, right) { return { type: "bin", op: op, left: left, right: right }; }
  function neg(arg) { return { type: "neg", arg: arg }; }
  function call(name, args) { return { type: "call", name: name, args: args }; }

  function isNum(n) { return n && n.type === "num"; }
  function isZero(n) { return isNum(n) && Math.abs(n.value) < 1e-12; }
  function isOne(n) { return isNum(n) && Math.abs(n.value - 1) < 1e-12; }

  /* ── Tokenizer ── */

  function normalizeInput(input) {
    return String(input)
      .replace(/[×·∗∙⋅]/g, "*")
      .replace(/÷/g, "/")
      .replace(/[−–—]/g, "-")
      .replace(/\*\*/g, "^")
      .replace(/\^\{([^}]*)\}/g, "^($1)")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .replace(/π/g, "pi");
  }

  function tokenize(input) {
    var s = normalizeInput(input);
    var tokens = [];
    var i = 0;

    while (i < s.length) {
      var c = s[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") { i++; continue; }

      if (c >= "0" && c <= "9" || c === ".") {
        var j = i, dot = false;
        while (j < s.length && (s[j] >= "0" && s[j] <= "9" || s[j] === ".")) {
          if (s[j] === ".") { if (dot) break; dot = true; }
          j++;
        }
        var text = s.slice(i, j);
        if (isNaN(Number(text))) throw new Error('Unreadable number "' + text + '"');
        tokens.push({ t: "num", v: Number(text) });
        i = j;
        continue;
      }

      if (/[A-Za-z]/.test(c)) {
        var k = i;
        while (k < s.length && /[A-Za-z0-9_]/.test(s[k])) k++;
        tokens.push({ t: "name", v: s.slice(i, k) });
        i = k;
        continue;
      }

      if ("+-*/^()".indexOf(c) >= 0) { tokens.push({ t: "op", v: c }); i++; continue; }
      if (c === ",") { tokens.push({ t: "comma", v: "," }); i++; continue; }
      if (c === "=") { tokens.push({ t: "eq", v: "=" }); i++; continue; }

      throw new Error('Unexpected character "' + c + '"');
    }
    return tokens;
  }

  /* ── Parser ── */

  function Parser(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  Parser.prototype.peek = function () { return this.tokens[this.pos] || null; };

  Parser.prototype.startsAtom = function (tok) {
    if (!tok) return false;
    if (tok.t === "num" || tok.t === "name") return true;
    return tok.t === "op" && tok.v === "(";
  };

  Parser.prototype.parseExpression = function () {
    var node = this.parseTerm();
    for (;;) {
      var tok = this.peek();
      if (tok && tok.t === "op" && (tok.v === "+" || tok.v === "-")) {
        this.pos++;
        node = bin(tok.v, node, this.parseTerm());
      } else {
        return node;
      }
    }
  };

  Parser.prototype.parseTerm = function () {
    var node = this.parseUnary();
    for (;;) {
      var tok = this.peek();
      if (tok && tok.t === "op" && (tok.v === "*" || tok.v === "/")) {
        this.pos++;
        node = bin(tok.v, node, this.parseUnary());
      } else if (this.startsAtom(tok)) {
        node = bin("*", node, this.parseUnary());
      } else {
        return node;
      }
    }
  };

  Parser.prototype.parseUnary = function () {
    var tok = this.peek();
    if (tok && tok.t === "op" && (tok.v === "-" || tok.v === "+")) {
      this.pos++;
      var arg = this.parseUnary();
      return tok.v === "-" ? neg(arg) : arg;
    }
    return this.parsePower();
  };

  Parser.prototype.parsePower = function () {
    var base = this.parseAtom();
    var tok = this.peek();
    if (tok && tok.t === "op" && tok.v === "^") {
      this.pos++;
      return bin("^", base, this.parseUnary());
    }
    return base;
  };

  Parser.prototype.parseAtom = function () {
    var tok = this.tokens[this.pos++];
    if (!tok) throw new Error("The expression ends unexpectedly.");

    if (tok.t === "num") return num(tok.v);

    if (tok.t === "name") {
      var name = tok.v.toLowerCase();
      if (FUNCTION_NAMES[name]) {
        var next = this.peek();
        if (next && next.t === "op" && next.v === "(") {
          this.pos++;
          var args = [];
          if (!(this.peek() && this.peek().t === "op" && this.peek().v === ")")) {
            args.push(this.parseExpression());
            while (this.peek() && this.peek().t === "comma") {
              this.pos++;
              args.push(this.parseExpression());
            }
          }
          var close = this.tokens[this.pos++];
          if (!close || close.v !== ")") throw new Error("A closing bracket is missing.");
          return call(name, args);
        }
        return call(name, [this.parsePower()]);
      }
      if (Object.prototype.hasOwnProperty.call(CONSTANTS, name)) return num(CONSTANTS[name]);
      return variable(tok.v);
    }

    if (tok.t === "op" && tok.v === "(") {
      var inner = this.parseExpression();
      var end = this.tokens[this.pos++];
      if (!end || end.v !== ")") throw new Error("A closing bracket is missing.");
      return inner;
    }

    throw new Error('Unexpected "' + tok.v + '" in the expression.');
  };

  function parse(input) {
    var tokens = tokenize(input);
    var eq = -1;
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].t === "eq") { eq = i; break; }
    }
    if (eq >= 0) {
      var left = tokens.slice(0, eq);
      var right = tokens.slice(eq + 1);
      return {
        type: "eq",
        left: new Parser(left).parseExpression(),
        right: new Parser(right).parseExpression()
      };
    }
    var p = new Parser(tokens);
    var node = p.parseExpression();
    if (p.pos < tokens.length) throw new Error("Too much in the expression.");
    return node;
  }

  /* ── Evaluation ── */

  function evaluate(node, vars) {
    vars = vars || {};
    switch (node.type) {
      case "num": return node.value;
      case "var":
        if (Object.prototype.hasOwnProperty.call(vars, node.name)) return vars[node.name];
        throw new Error('No value given for "' + node.name + '".');
      case "neg": return -evaluate(node.arg, vars);
      case "bin": {
        var a = evaluate(node.left, vars);
        var b = evaluate(node.right, vars);
        if (node.op === "+") return a + b;
        if (node.op === "-") return a - b;
        if (node.op === "*") return a * b;
        if (node.op === "/") return a / b;
        if (node.op === "^") return Math.pow(a, b);
        break;
      }
      case "call": {
        var fn = FUNCTIONS[node.name];
        if (!fn) throw new Error('Unknown function "' + node.name + '".');
        return fn.apply(null, node.args.map(function (arg) { return evaluate(arg, vars); }));
      }
    }
    throw new Error("This expression cannot be evaluated.");
  }

  /* ── Evaluation helpers used by the solvers ── */

  function namesIn(node, out) {
    out = out || {};
    if (!node) return out;
    if (node.type === "var") out[node.name] = true;
    if (node.type === "neg") namesIn(node.arg, out);
    if (node.type === "bin") { namesIn(node.left, out); namesIn(node.right, out); }
    if (node.type === "call") node.args.forEach(function (a) { namesIn(a, out); });
    if (node.type === "eq") { namesIn(node.left, out); namesIn(node.right, out); }
    return out;
  }

  function dependsOn(node, name) {
    return !!namesIn(node)[name];
  }

  /* ── Number formatting ── */

  function fmtNum(v) {
    if (typeof v !== "number" || !isFinite(v)) return String(v);
    if (Math.abs(v) < 1e-12) return "0";
    if (Number.isInteger(v)) return String(v);
    var s = v.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Pretty printing ── */

  function precedence(node) {
    if (node.type === "bin") {
      if (node.op === "+" || node.op === "-") return 1;
      if (node.op === "*" || node.op === "/") return 2;
      if (node.op === "^") return 4;
    }
    if (node.type === "neg") return 3;
    return 5;
  }

  function toString(node) {
    switch (node.type) {
      case "num": return fmtNum(node.value);
      case "var": return node.name;
      case "call": return node.name + "(" + node.args.map(toString).join(", ") + ")";
      case "neg": {
        var inner = toString(node.arg);
        return node.arg.type === "bin" ? "-(" + inner + ")" : "-" + inner;
      }
      case "bin": {
        var p = precedence(node);
        var l = toString(node.left);
        var r = toString(node.right);
        if (precedence(node.left) < p) l = "(" + l + ")";
        if (node.op === "^") {
          if (node.right.type === "bin" || node.right.type === "neg") r = "(" + r + ")";
          return l + "^" + r;
        }
        if (precedence(node.right) < p) r = "(" + r + ")";
        else if ((node.op === "-" || node.op === "/") && precedence(node.right) === p) r = "(" + r + ")";
        if (node.op === "*") {
          if (isNum(node.left) && !isNum(node.right)) return l + r;
          return l + " · " + r;
        }
        if (node.op === "/") return l + " / " + r;
        if (node.op === "-") return l + " − " + r;
        return l + " + " + r;
      }
      case "eq": return toString(node.left) + " = " + toString(node.right);
    }
    return "";
  }

  function toHTML(text) {
    return escapeHtml(String(text))
      .replace(/\^(-?\d+)/g, "<sup>$1</sup>")
      .replace(/\^\(([^)]*)\)/g, "<sup>$1</sup>")
      .replace(/\^([A-Za-z]+)/g, "<sup>$1</sup>");
  }

  /* ── Simplification ── */

  function applyNum(op, a, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? null : a / b;
    if (op === "^") return Math.pow(a, b);
    return null;
  }

  function simplify(node) {
    switch (node.type) {
      case "num":
      case "var":
        return node;

      case "neg": {
        var a = simplify(node.arg);
        if (isNum(a)) return num(-a.value);
        if (a.type === "neg") return a.arg;
        return neg(a);
      }

      case "call": {
        var args = node.args.map(simplify);
        if (args.length === 1 && isNum(args[0]) && FUNCTIONS[node.name]) {
          var value = FUNCTIONS[node.name](args[0].value);
          if (isFinite(value)) return num(value);
        }
        return call(node.name, args);
      }

      case "bin": {
        var l = simplify(node.left);
        var r = simplify(node.right);
        if (isNum(l) && isNum(r)) {
          var v = applyNum(node.op, l.value, r.value);
          if (v !== null) return num(v);
        }
        if (node.op === "+") {
          if (isZero(l)) return r;
          if (isZero(r)) return l;
          if (isNum(l) && isNum(r)) return num(l.value + r.value);
        }
        if (node.op === "-") {
          if (isZero(r)) return l;
          if (isZero(l)) return neg(r);
          if (isNum(l) && isNum(r)) return num(l.value - r.value);
        }
        if (node.op === "*") {
          if (isZero(l) || isZero(r)) return num(0);
          if (isOne(l)) return r;
          if (isOne(r)) return l;
        }
        if (node.op === "/") {
          if (isZero(l)) return num(0);
          if (isOne(r)) return l;
        }
        if (node.op === "^") {
          if (isZero(r)) return num(1);
          if (isOne(r)) return l;
        }
        return bin(node.op, l, r);
      }
    }
    return node;
  }

  /* ── Polynomial algebra (coefficient arrays, index = degree) ── */

  function trim(p) {
    var out = p.slice();
    while (out.length > 1 && Math.abs(out[out.length - 1]) < 1e-12) out.pop();
    return out.map(function (c) { return Math.abs(c) < 1e-12 ? 0 : c; });
  }

  function polyAdd(a, b) {
    var out = [];
    var n = Math.max(a.length, b.length);
    for (var i = 0; i < n; i++) out.push((a[i] || 0) + (b[i] || 0));
    return trim(out);
  }

  function polyScale(a, k) {
    return trim(a.map(function (c) { return c * k; }));
  }

  function polyMul(a, b) {
    var out = new Array(a.length + b.length - 1).fill(0);
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) out[i + j] += a[i] * b[j];
    }
    return trim(out);
  }

  function polyDerivative(p) {
    if (p.length <= 1) return [0];
    var out = [];
    for (var i = 1; i < p.length; i++) out.push(p[i] * i);
    return trim(out);
  }

  function polyIntegral(p) {
    var out = [0];
    for (var i = 0; i < p.length; i++) out.push(p[i] / (i + 1));
    return trim(out);
  }

  function polyEval(p, x) {
    var v = 0;
    for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i];
    return v;
  }

  function polyDegree(p) { return trim(p).length - 1; }

  function polyToString(p, v) {
    var c = trim(p);
    var terms = [];
    for (var k = c.length - 1; k >= 0; k--) {
      var a = c[k];
      if (Math.abs(a) < 1e-12) continue;
      var abs = Math.abs(a);
      var term;
      if (k === 0) term = fmtNum(abs);
      else {
        var pow = k === 1 ? v : v + "^" + k;
        term = (Math.abs(abs - 1) < 1e-12 ? "" : fmtNum(abs)) + pow;
      }
      terms.push({ sign: a < 0 ? "-" : "+", term: term });
    }
    if (!terms.length) return "0";
    var out = (terms[0].sign === "-" ? "-" : "") + terms[0].term;
    for (var i = 1; i < terms.length; i++) out += " " + terms[i].sign + " " + terms[i].term;
    return out;
  }

  function polyToAst(p, v) {
    var nodes = [];
    for (var k = trim(p).length - 1; k >= 0; k--) {
      var a = p[k];
      if (Math.abs(a) < 1e-12) continue;
      var term = k === 0 ? num(a) : bin("*", num(a), bin("^", variable(v), num(k)));
      nodes.push(term);
    }
    if (!nodes.length) return num(0);
    return nodes.reduce(function (acc, t) { return bin("+", acc, t); });
  }

  function toPoly(node, v) {
    switch (node.type) {
      case "num": return [node.value];
      case "var": return node.name === v ? [0, 1] : null;
      case "neg": {
        var p = toPoly(node.arg, v);
        return p ? polyScale(p, -1) : null;
      }
      case "bin": {
        var a = toPoly(node.left, v);
        var b = toPoly(node.right, v);
        if (!a || !b) return null;
        if (node.op === "+") return polyAdd(a, b);
        if (node.op === "-") return polyAdd(a, polyScale(b, -1));
        if (node.op === "*") return polyMul(a, b);
        if (node.op === "/") return b.length === 1 && b[0] !== 0 ? polyScale(a, 1 / b[0]) : null;
        if (node.op === "^") {
          if (b.length !== 1) return null;
          var n = b[0];
          if (!Number.isInteger(n) || n < 0 || n > 24) return null;
          var out = [1];
          for (var i = 0; i < n; i++) out = polyMul(out, a);
          return out;
        }
        return null;
      }
    }
    return null;
  }

  /* Linear form: { coeffs: { varName: number }, constant: number } */

  function linScale(a, k) {
    var coeffs = {};
    Object.keys(a.coeffs).forEach(function (name) { coeffs[name] = a.coeffs[name] * k; });
    return { coeffs: coeffs, constant: a.constant * k };
  }

  function linAdd(a, b) {
    var coeffs = {};
    Object.keys(a.coeffs).forEach(function (name) { coeffs[name] = a.coeffs[name] || 0; });
    Object.keys(b.coeffs).forEach(function (name) { coeffs[name] = (coeffs[name] || 0) + b.coeffs[name]; });
    Object.keys(coeffs).forEach(function (name) {
      if (Math.abs(coeffs[name]) < 1e-12) delete coeffs[name];
    });
    return { coeffs: coeffs, constant: a.constant + b.constant };
  }

  function isConstLin(a) { return Object.keys(a.coeffs).length === 0; }

  function toLinear(node, vars) {
    switch (node.type) {
      case "num": return { coeffs: {}, constant: node.value };
      case "var":
        if (vars.indexOf(node.name) >= 0) {
          var c = {}; c[node.name] = 1;
          return { coeffs: c, constant: 0 };
        }
        return null;
      case "neg": {
        var a = toLinear(node.arg, vars);
        return a ? linScale(a, -1) : null;
      }
      case "bin": {
        var l = toLinear(node.left, vars);
        var r = toLinear(node.right, vars);
        if (!l || !r) return null;
        if (node.op === "+") return linAdd(l, r);
        if (node.op === "-") return linAdd(l, linScale(r, -1));
        if (node.op === "*") {
          if (isConstLin(l)) return linScale(r, l.constant);
          if (isConstLin(r)) return linScale(l, r.constant);
          return null;
        }
        if (node.op === "/") return isConstLin(r) && r.constant !== 0 ? linScale(l, 1 / r.constant) : null;
        if (node.op === "^") {
          if (!isConstLin(r)) return null;
          if (Math.abs(r.constant) < 1e-12) return { coeffs: {}, constant: 1 };
          if (Math.abs(r.constant - 1) < 1e-12) return l;
          return null;
        }
        return null;
      }
    }
    return null;
  }

  /* ── Differentiation ── */

  function differentiate(node, v) {
    switch (node.type) {
      case "num": return num(0);
      case "var": return num(node.name === v ? 1 : 0);
      case "neg": {
        var na = differentiate(node.arg, v);
        return na ? neg(na) : null;
      }
      case "bin": {
        var u = node.left, w = node.right;
        var du = differentiate(u, v);
        var dw = differentiate(w, v);
        if (!du || !dw) return null;
        if (node.op === "+") return bin("+", du, dw);
        if (node.op === "-") return bin("-", du, dw);
        if (node.op === "*") return bin("+", bin("*", du, w), bin("*", u, dw));
        if (node.op === "/") {
          return bin("/", bin("-", bin("*", du, w), bin("*", u, dw)), bin("^", w, num(2)));
        }
        if (node.op === "^") {
          if (isNum(w)) {
            var n = w.value;
            return bin("*", bin("*", num(n), bin("^", u, num(n - 1))), du);
          }
          if (isNum(u)) {
            return bin("*", bin("*", bin("^", u, w), call("ln", [u])), dw);
          }
          return bin("*", node, bin("+", bin("*", dw, call("ln", [u])), bin("/", bin("*", w, du), u)));
        }
        return null;
      }
      case "call": {
        var inner = node.args[0];
        var din = differentiate(inner, v);
        if (!din) return null;
        var outer;
        switch (node.name) {
          case "sin": outer = call("cos", [inner]); break;
          case "cos": outer = neg(call("sin", [inner])); break;
          case "tan": outer = bin("/", num(1), bin("^", call("cos", [inner]), num(2))); break;
          case "ln": outer = bin("/", num(1), inner); break;
          case "exp": outer = call("exp", [inner]); break;
          case "sqrt": outer = bin("/", num(1), bin("*", num(2), call("sqrt", [inner]))); break;
          default: return null;
        }
        return bin("*", outer, din);
      }
    }
    return null;
  }

  /* ── Basic integration ── */

  function integrate(node, v) {
    if (!dependsOn(node, v)) return bin("*", node, variable(v));

    var p = toPoly(node, v);
    if (p) return polyToAst(polyIntegral(p), v);

    if (node.type === "bin" && (node.op === "+" || node.op === "-")) {
      var l = integrate(node.left, v);
      var r = integrate(node.right, v);
      if (l && r) return bin(node.op, l, r);
      return null;
    }

    if (node.type === "neg") {
      var inner = integrate(node.arg, v);
      return inner ? neg(inner) : null;
    }

    if (node.type === "bin" && node.op === "/" && isNum(node.left) && Math.abs(node.left.value - 1) < 1e-12) {
      var den = toLinear(node.right, [v]);
      if (den && den.coeffs[v]) return bin("/", call("ln", [node.right]), num(den.coeffs[v]));
      return null;
    }

    if (node.type === "call") {
      var lin = toLinear(node.args[0], [v]);
      if (lin && lin.coeffs[v]) {
        var a = lin.coeffs[v];
        var arg = node.args[0];
        if (node.name === "sin") return bin("/", neg(call("cos", [arg])), num(a));
        if (node.name === "cos") return bin("/", call("sin", [arg]), num(a));
        if (node.name === "exp") return bin("/", call("exp", [arg]), num(a));
      }
      return null;
    }

    return null;
  }

  var MathEngine = {
    parse: parse,
    tokenize: tokenize,
    evaluate: evaluate,
    toString: toString,
    toHTML: toHTML,
    simplify: simplify,
    differentiate: differentiate,
    integrate: integrate,
    toPoly: toPoly,
    toLinear: toLinear,
    polyAdd: polyAdd,
    polyMul: polyMul,
    polyScale: polyScale,
    polyDerivative: polyDerivative,
    polyIntegral: polyIntegral,
    polyEval: polyEval,
    polyDegree: polyDegree,
    polyToString: polyToString,
    polyToAst: polyToAst,
    trim: trim,
    namesIn: namesIn,
    dependsOn: dependsOn,
    fmtNum: fmtNum,
    escapeHtml: escapeHtml,
    isNum: isNum,
    isZero: isZero,
    isOne: isOne,
    num: num,
    variable: variable,
    bin: bin,
    neg: neg,
    call: call,
    FUNCTIONS: FUNCTIONS,
    CONSTANTS: CONSTANTS
  };

  global.MathEngine = MathEngine;
  if (typeof module !== "undefined" && module.exports) module.exports = MathEngine;
})(typeof globalThis !== "undefined" ? globalThis : this);
