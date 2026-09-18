/* Math AI — chat front end, knowledge-base retrieval and answer rendering.
 *
 * Uses window.MathEngine (expression engine), window.MathSolvers (step-by-step
 * solvers) and the knowledge base in Math_AI.md (loaded over http, or from the
 * bundled kb.js when the page is opened straight from disk).
 */
(function () {
  "use strict";

  var E = window.MathEngine;
  var Solver = window.MathSolvers;

  /* ── Config ── */

  var KB_PATHS = ["../Math_AI.md", "Math_AI.md"];

  var STOPWORDS = {};
  ("a an the is are was were be been am do does did of to in on at for with and or but if then so as by from about " +
   "what who whom whose which when where why how this that these those it its i you your me my we our they them their " +
   "he she his her can could would should will shall may might must tell say know please there here").split(" ")
    .forEach(function (w) { STOPWORDS[w] = true; });

  var LEVEL_RANK = { Foundation: 1, Intermediate: 2, Advanced: 3 };
  var RANK_LEVEL = { 1: "Foundation", 2: "Intermediate", 3: "Advanced" };

  /* ── DOM ── */

  var chat = document.getElementById("chat");
  var input = document.getElementById("input");
  var sendBtn = document.getElementById("send");
  var statusEl = document.getElementById("status");
  var sourceEl = document.getElementById("source");
  var themeToggle = document.getElementById("themeToggle");
  var levelBadge = document.getElementById("levelBadge");
  var isProcessing = false;

  /* ── Knowledge base state ── */

  var knowledge = [];
  var kbLoaded = false;

  /* ── Theme ── */

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("mathai-theme", theme); } catch (e) { /* storage unavailable */ }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("mathai-theme"); } catch (e) { /* ignore */ }
    if (saved === "light" || saved === "dark") { applyTheme(saved); return; }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  themeToggle.addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ── Knowledge base loading ── */

  function setStatus(kind, message) {
    statusEl.textContent = message;
    statusEl.className = "header-sub" + (kind ? " " + kind : "");
  }

  function loadKnowledgeBase() {
    var tryPath = function (idx) {
      if (idx >= KB_PATHS.length) return Promise.resolve(null);
      return fetch(encodeURI(KB_PATHS[idx]), { cache: "no-store" }).then(function (res) {
        if (!res.ok) throw new Error("not found");
        return res.text();
      }).then(function (text) {
        if (text && text.trim()) {
          sourceEl.textContent = "Source: " + KB_PATHS[idx];
          setStatus("loaded", "Knowledge base loaded — " + KB_PATHS[idx].split("/").pop());
          return text;
        }
        throw new Error("empty");
      }).catch(function () { return tryPath(idx + 1); });
    };

    return tryPath(0).then(function (text) {
      if (text) { kbLoaded = true; return parseKnowledgeBase(text); }
      if (window.MATH_AI_KB && window.MATH_AI_KB.trim()) {
        kbLoaded = true;
        sourceEl.textContent = "Source: Math_AI.md (bundled copy)";
        setStatus("loaded", "Knowledge base loaded — bundled copy of Math_AI.md");
        return parseKnowledgeBase(window.MATH_AI_KB);
      }
      kbLoaded = false;
      sourceEl.textContent = "Source: unavailable (run project AI/tools/build_kb.py)";
      setStatus("error", "Couldn't read Math_AI.md.");
      return [];
    });
  }

  var FIELD_RE = /^([A-Z][A-Z0-9_]*)\s*:\s*(.*)$/;

  function parseKnowledgeBase(text) {
    var lines = String(text).replace(/\r\n/g, "\n").split("\n");
    var entries = [];
    var section = null;
    var topic = null;
    var openField = null;

    function flushSection() {
      if (section && section.body.length) entries.push(makeSection(section.title, section.body.join(" ")));
      section = null;
    }
    function flushTopic() {
      if (topic) { var e = makeTopic(topic); if (e) entries.push(e); }
      topic = null;
      openField = null;
    }

    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;

      if (/^TOPIC_ID\s*:/.test(line)) { flushSection(); flushTopic(); topic = {}; }

      if (topic) {
        if (line === "END_TOPIC") { flushTopic(); return; }
        var field = line.match(FIELD_RE);
        if (field) { topic[field[1]] = field[2].trim(); openField = field[1]; }
        else if (openField) { topic[openField] = (topic[openField] + "\n" + line).trim(); }
        return;
      }

      var heading = line.match(/^#{1,6}\s+(.*)$/);
      if (heading) { flushSection(); section = { title: heading[1].trim(), body: [] }; return; }
      if (section) section.body.push(line);
    });

    flushTopic();
    flushSection();
    return entries;
  }

  function makeTopic(fields) {
    var id = (fields.TOPIC_ID || "").trim();
    var name = (fields.TOPIC_NAME || "").trim();
    if (!id && !name) return null;
    return {
      type: "topic",
      id: id,
      name: name || id,
      subjectArea: (fields.SUBJECT_AREA || "").trim(),
      source: (fields.SOURCE_DOCUMENT || "").trim(),
      location: (fields.SOURCE_LOCATION || "").trim(),
      level: (fields.LEVEL || "").trim(),
      concepts: (fields.KEY_CONCEPTS || "").split(";").map(function (c) { return c.trim(); }).filter(Boolean),
      overview: (fields.OVERVIEW || "").trim(),
      related: (fields.RELATED_TOPICS || "").split(";").map(function (r) { return r.trim(); }).filter(Boolean),
      body: Object.keys(fields).map(function (k) { return fields[k]; }).join(" ")
    };
  }

  function makeSection(title, body) {
    return { type: "section", id: "", name: title, subjectArea: "", source: "", location: "", level: "", concepts: [], overview: "", related: [], body: body };
  }

  function tokenize(text) {
    var words = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
    return words.filter(function (w) { return !STOPWORDS[w] && w.length > 1; });
  }

  function topics() { return knowledge.filter(function (e) { return e.type === "topic"; }); }

  function topicById(id) {
    for (var i = 0; i < knowledge.length; i++) if (knowledge[i].id === id) return knowledge[i];
    return null;
  }

  function searchKnowledge(question, limit) {
    var phrase = String(question).toLowerCase().trim();
    var tokens = tokenize(question);
    if (!tokens.length) return [];
    var scored = [];
    knowledge.forEach(function (entry) {
      var name = entry.name.toLowerCase();
      var subject = entry.subjectArea.toLowerCase();
      var concepts = entry.concepts.join(" ").toLowerCase();
      var haystack = entry.body.toLowerCase();
      var score = 0;
      tokens.forEach(function (token) {
        if (name.indexOf(token) >= 0) score += 4;
        else if (subject.indexOf(token) >= 0) score += 3;
        else if (concepts.indexOf(token) >= 0) score += 2;
        else if (haystack.indexOf(token) >= 0) score += 1;
      });
      if (phrase && name.indexOf(phrase) >= 0) score += 6;
      if (score > 0) scored.push({ entry: entry, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, limit || 3).map(function (s) { return s.entry; });
  }

  /* ── Level inference ── */

  var STRONG_ADVANCED_CUES = /\b(laplace|fourier|eigen|det|determinant|matrix|matrices|partial derivative|differential equation|complex number|hyperbolic|residue|divergence|curl|taylor|maclaurin)\b/i;
  var MODERATE_CUES = /\b(integrat|integral|differentiat|derivative|simultaneous|cross product|normal distribution|regression|correlation)\b/i;
  var FOUNDATION_CUES = /\b(percentage|percent|fraction|round|estimate|simplify|expand|factoris|factoriz|place value|ratio|decimal|truth table)\b/i;

  function detectLevel(question, result, matched) {
    var rank = LEVEL_RANK[result && result.level] || 2;
    matched.forEach(function (t) { if (LEVEL_RANK[t.level]) rank = Math.max(rank, LEVEL_RANK[t.level]); });
    if (MODERATE_CUES.test(question)) rank = Math.max(rank, 2);
    if (STRONG_ADVANCED_CUES.test(question)) rank = Math.max(rank, 3);
    if (FOUNDATION_CUES.test(question) && !MODERATE_CUES.test(question) && !STRONG_ADVANCED_CUES.test(question)) {
      rank = Math.min(rank, 1);
    }
    return RANK_LEVEL[rank];
  }

  /* ── Rendering ── */

  function esc(s) { return E.escapeHtml(s); }
  function math(s) { return E.toHTML(s); }

  function renderTopic(entry, level) {
    var meta = [entry.subjectArea, entry.level].filter(Boolean).map(esc).join(" · ");
    var concepts = entry.concepts.length
      ? '<div class="kb-concepts">' + entry.concepts.map(esc).join(" · ") + "</div>"
      : "";
    var source = "";
    if (level !== "Foundation" || true) {
      var srcBits = [entry.source, entry.location].filter(Boolean).map(esc).join(" · ");
      if (srcBits) source = '<div class="kb-meta">' + srcBits + "</div>";
    }
    var overview = entry.overview
      ? '<div class="kb-section"><div class="kb-label">Overview</div><div class="kb-text">' + esc(entry.overview) + "</div></div>"
      : "";

    return '<div class="kb-topic"><div class="kb-topic-head"><span class="kb-topic-name">' + esc(entry.name) + "</span>" +
      (entry.id ? '<span class="kb-topic-id">' + esc(entry.id) + "</span>" : "") + "</div>" +
      source + (meta ? '<div class="kb-meta">' + meta + "</div>" : "") + concepts + overview + "</div>";
  }

  function relatedTopics(entry, limit) {
    var pool = topics().filter(function (t) {
      return t.id !== entry.id && t.subjectArea && t.subjectArea === entry.subjectArea;
    });
    return pool.slice(0, limit || 4);
  }

  function renderSolution(result, question) {
    var matchedIds = result.topicIds || [];
    var matched = matchedIds.map(topicById).filter(Boolean);
    var level = detectLevel(question, result, matched);

    var chips = [];
    if (result.method) chips.push('<span class="chip">' + esc(result.method) + "</span>");
    chips.push('<span class="chip">Level: ' + esc(level) + "</span>");

    var html = '<div class="sol-head"><span class="sol-type">' + esc(result.type) + '</span><span class="sol-chips">' + chips.join("") + "</span></div>";
    html += '<div class="math-display">' + math(result.input) + "</div>";

    (result.steps || []).forEach(function (step, i) {
      var lines = (step.lines || []).map(function (l) { return '<div class="math-formula">' + math(l) + "</div>"; }).join("");
      var note = step.note ? '<div class="math-note">' + esc(step.note) + "</div>" : "";
      html += '<div class="math-step"><span class="step-num">' + (i + 1) + "</span><div class=\"step-body\"><strong>" +
        esc(step.title) + "</strong>" + lines + note + "</div></div>";
    });

    html += '<div class="math-solution answer"><strong>Answer:</strong> <span class="ans-mono">' + math(result.answer) + "</span></div>";

    if (matched.length) {
      html += '<div class="answer-note">Learn this topic</div>';
      matched.forEach(function (t) { html += renderTopic(t, level); });

      if (level !== "Foundation") {
        var related = [];
        matched.forEach(function (t) { related = related.concat(relatedTopics(t)); });
        var seen = {};
        related = related.filter(function (t) { if (seen[t.id]) return false; seen[t.id] = true; return true; }).slice(0, 4);
        if (related.length) {
          html += '<div class="answer-note">Related topics</div><div class="related-list">' +
            related.map(function (t) { return '<span class="chip">' + esc(t.name) + " (" + esc(t.id) + ")</span>"; }).join("") + "</div>";
        }
      }
    }

    html += '<div class="answer-foot">' + topics().length + " topics · " + esc(level) + " level</div>";
    return { html: html, level: level };
  }

  function renderKnowledgeOnly(question, matched) {
    if (!matched.length) return null;
    var html = '<div class="answer-note">I can\'t compute this one, but here\'s what the knowledge base covers</div>';
    matched.forEach(function (t) { html += renderTopic(t, "Intermediate"); });
    html += '<div class="answer-foot">Ask for a calculation (equation, derivative, matrix…) or pick a topic above.</div>';
    return html;
  }

  function helpText() {
    return '<p>I\'m a <strong>Math AI tutor</strong>. I solve problems step by step and point you to the right topics.</p>' +
      "<p><strong>I can handle:</strong></p><ul>" +
      Solver.SUPPORTED.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
      "</ul><p>Type a question like <code>Solve x² + 5x + 6 = 0</code> or <code>Differentiate x^3 sin x</code>.</p>";
  }

  /* ── Answer generation ── */

  function getAnswer(question) {
    var lower = question.toLowerCase().trim();

    if (/^(hi|hello|hey|yo|sup|good\s+(morning|afternoon|evening))\b/.test(lower)) {
      return { html: "<p>Hello! Type a maths question and I'll solve it step by step.</p>", level: null };
    }

    var result = null;
    try { result = Solver.solve(question); } catch (e) { result = null; }

    if (result) return renderSolution(result, question);

    var matched = searchKnowledge(question, 3);
    var kbAnswer = renderKnowledgeOnly(question, matched);
    if (kbAnswer) return { html: kbAnswer, level: matched[0] && matched[0].level };

    if (!kbLoaded) {
      return { html: "<p>I couldn't load my knowledge base. Run <code>python \"project AI/tools/build_kb.py\" \"App/Math_AI.md\" \"App/site/kb.js\"</code> and reload.</p>", level: null };
    }

    return { html: helpText(), level: null };
  }

  /* ── Chat UI ── */

  function addMessage(html, role) {
    var welcome = chat.querySelector(".welcome");
    if (welcome) welcome.remove();
    var div = document.createElement("div");
    div.className = "message " + role;
    var bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.innerHTML = html;
    div.appendChild(bubble);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "message ai";
    div.id = "typing-indicator";
    div.innerHTML = '<div class="message-bubble"><span class="typing-cursor"></span></div>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  function setLevelBadge(level) {
    if (!level) { levelBadge.hidden = true; return; }
    levelBadge.hidden = false;
    levelBadge.textContent = "Level: " + level;
  }

  function handleSend() {
    var text = input.value.trim();
    if (!text || isProcessing) return;

    isProcessing = true;
    sendBtn.disabled = true;
    input.value = "";

    addMessage(esc(text), "user");
    showTyping();

    window.setTimeout(function () {
      removeTyping();
      var answer;
      try { answer = getAnswer(text); } catch (e) {
        answer = { html: "<p>Sorry, something went wrong working through that. Try rephrasing it.</p>", level: null };
      }
      addMessage(answer.html, "ai");
      setLevelBadge(answer.level);
      isProcessing = false;
      sendBtn.disabled = false;
      input.focus();
    }, 320 + Math.random() * 320);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  document.querySelectorAll(".example-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      input.value = chip.textContent;
      handleSend();
    });
  });

  /* ── Init ── */

  initTheme();
  loadKnowledgeBase().then(function (entries) {
    knowledge = entries;
    input.focus();
  });

  /* Debug hook, also used by the offline test harness. */
  window.MathAI = {
    topics: topics,
    search: searchKnowledge,
    answer: getAnswer,
    loaded: function () { return kbLoaded; },
    count: function () { return knowledge.length; }
  };
})();
