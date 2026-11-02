/* Shared flow for the browser games, timed like the videos:
   1. the setup (where the clue is) is shown once, on a clock, then folded away;
   2. one question at a time, each on a clock; every question is played, and when time runs out
      the question is marked as unanswered (U), not as YES or NO;
   3. after the last question, everything opens up again with the answer. What matters is the first NO.
   A player can also skip straight to the answer from the start screen; every question is then unanswered.
   Like the videos, the setup's narration types itself out at reading speed (elements marked data-type;
   cards marked data-reveal appear whole when the typing reaches them), and a YES lands with a stamp or a
   new checklist line, a bumped counter and a sound (assets/sfx.js). Click the setup to show it all at once;
   with reduced motion nothing types or moves.
   Each game supplies its text and how to draw its documents. Reading budgets use the same
   speeds as the videos: 17 characters a second in English, 9 in Chinese, plus time to decide. */
(function () {
  const SPEED = { en: 17, zh: 9 };
  const DECIDE = 4;         // seconds to decide once the question is read
  const INTRO_EXTRA = 2;    // the setup is read once, like the video's setup screens

  function plain(html) { return String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(); }
  function seconds(text, lang, extra) { return Math.ceil(plain(text).length / SPEED[lang] + extra); }

  window.DriftGame = function (g) {
    const state = { lang: pickLang(), phase: "intro", answers: [], timeouts: [], untimed: false, skipped: false, typed: false, deadline: 0, budget: 0, lastLeft: null, justAdded: null };
    const main = document.getElementById("game");
    const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = null, typer = null;

    function sfx(name) { if (window.DriftSfx) DriftSfx.play(name); }

    // The sound switch sits in the status bar, next to the language switch.
    const langGroup = document.querySelector(".lang");
    let soundBtn = null;
    if (window.DriftSfx && langGroup) {
      soundBtn = document.createElement("button");
      soundBtn.type = "button"; soundBtn.id = "sound"; soundBtn.className = "sound";
      langGroup.parentNode.insertBefore(soundBtn, langGroup);
      soundBtn.addEventListener("click", function () {
        DriftSfx.unlock(); DriftSfx.set(!DriftSfx.on); paintSound(); sfx("click");
      });
    }
    function paintSound() {
      if (!soundBtn) return;
      const on = DriftSfx.on, zh = state.lang === "zh";
      soundBtn.textContent = on ? "🔊" : "🔇";
      soundBtn.setAttribute("aria-pressed", String(on));
      soundBtn.title = zh ? (on ? "声音：开" : "声音：关") : (on ? "Sound on" : "Sound off");
      soundBtn.setAttribute("aria-label", soundBtn.title);
    }

    function pickLang() {
      let lang = null;
      try { lang = new URLSearchParams(location.search).get("lang"); } catch (e) {}
      if (lang !== "en" && lang !== "zh") { try { lang = localStorage.getItem("check42-lang"); } catch (e) {} }
      if (lang !== "en" && lang !== "zh") lang = /^zh/i.test(navigator.language || "") ? "zh" : "en";
      return lang;
    }
    function t() { return g.T[state.lang]; }
    g.label = (a) => (a === "Y" ? t().yes : a === "N" ? t().no : ui().unknown);
    state.label = g.label;
    function ui() { return g.UI[state.lang]; }

    function startClock(secs) {
      clearInterval(tick);
      if (state.untimed) { state.deadline = 0; return; }
      state.budget = secs;
      state.lastLeft = null;
      state.deadline = Date.now() + secs * 1000;
      tick = setInterval(update, 100);
    }
    function update() {
      const fill = document.getElementById("timer-fill"), left = document.getElementById("timer-left");
      if (!state.deadline) return;
      const ms = Math.max(0, state.deadline - Date.now());
      if (fill) fill.style.width = (100 * ms / (state.budget * 1000)) + "%";
      const secsLeft = Math.ceil(ms / 1000);
      if (left) left.textContent = secsLeft;
      if (state.phase === "play" && ms > 0 && secsLeft <= 3 && secsLeft !== state.lastLeft) {
        sfx("tick");
        const box = left && left.closest(".timer");
        if (box) box.classList.add("urgent");
      }
      state.lastLeft = secsLeft;
      if (ms === 0) {
        clearInterval(tick);
        if (state.phase === "intro") begin();
        else if (state.phase === "play") answer("Y", true);
      }
    }
    function timer(label) {
      if (state.untimed) return "";
      return `<div class="timer" role="timer"><div class="timer-track"><div class="timer-fill" id="timer-fill"></div></div><span class="timer-label">${label} <b id="timer-left"></b></span></div>`;
    }

    function stopClock() { clearInterval(tick); state.deadline = 0; }

    function begin() {
      stopClock();   // before rendering: render() calls update(), which must not see the old deadline
      state.phase = "play";
      state.justAdded = 0;
      render();
      startClock(seconds(g.roundText(t(), 0), state.lang, DECIDE));
      window.scrollTo({ top: 0 });
    }
    function answer(a, timedOut) {
      stopClock();
      sfx(timedOut ? "timeout" : "click");
      const i = state.answers.length;
      state.answers.push(timedOut ? "U" : a);
      state.timeouts.push(Boolean(timedOut));
      if (g.done(state.answers)) {
        clearInterval(tick);
        state.phase = "done";
        state.justAdded = "end";
        render();
        setTimeout(() => sfx("reveal"), 200);
        const el = document.getElementById("reveal");
        if (el) el.scrollIntoView({ block: "start" });
        return;
      }
      state.justAdded = i + 1;
      render();
      landed();
      startClock(seconds(g.roundText(t(), i + 1), state.lang, DECIDE));
      const cur = document.getElementById("current");
      if (cur) cur.scrollIntoView({ block: "start" });
    }

    function skip() {
      stopClock();
      state.answers = []; state.timeouts = [];
      while (!g.done(state.answers) && state.answers.length < 100) { state.answers.push("U"); state.timeouts.push(false); }
      state.skipped = true;
      state.phase = "done";
      state.justAdded = "end";
      render();
      setTimeout(() => sfx("reveal"), 150);
      const el = document.getElementById("reveal");
      if (el) el.scrollIntoView({ block: "start" });
    }

    // A YES just went through: the stamp lands (or the new checklist line drops in), then the counter bumps.
    function landed() {
      if (state.answers[state.answers.length - 1] !== "Y") return;
      const last = main.querySelector(".after.last");
      if (!last) return;
      const stamp = last.querySelector(".stamp"), added = last.querySelector(".checklist li:last-child");
      if (stamp) {
        if (!still) { stamp.classList.add("slam"); const card = stamp.closest(".paper"); if (card) card.classList.add("shake"); }
        sfx("stamp");
      }
      if (added) { if (!still) added.classList.add("added"); sfx("add"); }
      const count = document.getElementById("count");
      setTimeout(function () {
        if (count && !still) { count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); }
        sfx("count");
      }, stamp ? 330 : 140);
    }

    // Type the setup's narration at reading speed, like the video. Cards appear whole when reached.
    function typeIntro() {
      clearInterval(typer);
      const root = main.querySelector(".intro");
      if (!root) return;
      const marked = [...root.querySelectorAll("[data-type], [data-reveal]")];
      if (state.typed || still || !marked.length) { state.typed = true; return; }
      const steps = [];
      for (const el of marked) {
        if (el.hasAttribute("data-reveal")) { el.classList.add("pending"); steps.push({ card: el }); continue; }
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
        while (walk.nextNode()) nodes.push(walk.currentNode);
        el.classList.add("pending");   // hidden until its first character, so empty bullets don't show
        for (const n of nodes) { steps.push({ node: n, text: n.nodeValue, owner: el }); n.nodeValue = ""; }
      }
      let si = 0, ci = 0, wait = 0;
      function show(card) {
        card.classList.remove("pending"); card.classList.add("shown");
        const stamp = card.querySelector(".stamp");
        if (stamp) { stamp.classList.add("slam"); sfx("stamp"); }
      }
      function finish() {
        clearInterval(typer);
        for (; si < steps.length; si++, ci = 0) { const st = steps[si]; if (st.card) show(st.card); else { st.node.nodeValue = st.text; st.owner.classList.remove("pending"); } }
        state.typed = true;
        root.classList.remove("typing");
        root.removeEventListener("click", finish);
      }
      root.classList.add("typing");
      root.addEventListener("click", finish);
      const perSecond = SPEED[state.lang];
      typer = setInterval(function () {
        if (wait > 0) { wait--; return; }
        while (si < steps.length) {
          const st = steps[si];
          if (st.card) { show(st.card); si++; wait = Math.round(perSecond * 0.6); return; }
          if (ci < st.text.length) {
            ci++;
            st.node.nodeValue = st.text.slice(0, ci);
            st.owner.classList.remove("pending");
            if (/\s/.test(st.text[ci - 1])) continue;   // spaces cost nothing
            return;
          }
          si++; ci = 0;
        }
        finish();
      }, 1000 / perSecond);
    }

    function roundBlock(i, open) {
      const ans = state.answers[i], to = state.timeouts[i];
      const buttons = `<div class="answers">
        <button type="button" class="${ans === "Y" ? "chosen" : ""}" data-a="Y" ${ans || !open ? "disabled" : ""}>${t().yes}</button>
        <button type="button" class="${ans === "N" ? "chosen" : ""}" data-a="N" ${ans || !open ? "disabled" : ""}>${t().no}</button>
      </div>`;
      return `<section class="round${state.justAdded === i ? " new" : ""}" id="${open ? "current" : "round-" + (i + 1)}">
        ${g.round(t(), i, state)}
        ${open ? timer(ui().decide) : ""}
        ${buttons}
        ${to ? `<p class="timeout">${ui().timedOut}</p>` : ""}
        ${ans === "Y" ? `<div class="after">${g.after(t(), i, state)}</div>` : ""}
      </section>`;
    }

    function render() {
      const T = t(), U = ui(), s = state;
      document.documentElement.lang = s.lang === "zh" ? "zh-CN" : "en";
      document.title = `${T.brand} · Agent Drift Game`;
      for (const b of document.querySelectorAll(".lang button")) b.setAttribute("aria-pressed", String(b.dataset.lang === s.lang));
      const bar = g.bar(T, s);
      document.getElementById("brand").textContent = T.brand;
      paintSound();
      const menu = document.getElementById("menu");
      if (menu) menu.textContent = s.lang === "zh" ? "← 菜单" : "← Menu";
      document.getElementById("clock").textContent = bar.clock;
      document.getElementById("count").textContent = bar.count;
      const due = document.getElementById("due");
      if (due) due.textContent = bar.due || "";

      let html = "";
      if (s.phase === "intro") {
        html = `${g.intro(T, s)}
          <div class="start">
            <p class="rules">${U.rules}</p>
            ${timer(U.reading)}
            <div class="actions">
              <button type="button" class="pill solid" id="begin">${U.begin}</button>
              <button type="button" class="pill" id="skip">${U.skip}</button>
              <label class="untimed"><input type="checkbox" id="untimed" ${s.untimed ? "checked" : ""}> ${U.untimed}</label>
            </div>
          </div>`;
      } else if (s.phase === "play") {
        const i = s.answers.length;
        html = `<p class="folded">${U.folded}</p>`;
        for (let k = 0; k < i; k++) html += `<p class="past">${g.past(T, k, s)}</p>`;
        if (i > 0 && s.answers[i - 1] === "Y") html += `<div class="after last">${g.after(T, i - 1, s)}</div>`;
        if (i > 0 && s.answers[i - 1] === "U") html += `<p class="timeout last">${U.timedOut}</p>`;
        html += roundBlock(i, true);
      } else {
        html = g.intro(T, s);
        for (let k = 0; k < s.answers.length; k++) html += roundBlock(k, false);
        html += g.reveal(T, s);
        html += `<div class="actions"><button type="button" class="pill" id="play-again">${T.playAgain}</button></div>`;
      }
      clearInterval(typer);
      main.innerHTML = html;
      update();
      if (s.phase === "intro") typeIntro();
    }

    main.addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      if (window.DriftSfx) DriftSfx.unlock();   // sound may start only after a click
      if (b.id === "begin") { sfx("click"); begin(); return; }
      if (b.id === "skip") { sfx("click"); skip(); return; }
      if (b.id === "play-again") {
        clearInterval(tick);
        Object.assign(state, { phase: "intro", answers: [], timeouts: [], skipped: false, typed: false, justAdded: null });
        render(); startClock(seconds(g.introText(t()), state.lang, INTRO_EXTRA)); window.scrollTo({ top: 0 }); return;
      }
      if (b.dataset.a && state.phase === "play" && !b.disabled) answer(b.dataset.a, false);
    });
    main.addEventListener("change", function (e) {
      if (e.target.id !== "untimed") return;
      state.untimed = e.target.checked;
      if (state.untimed) { clearInterval(tick); state.deadline = 0; render(); }
      else { render(); startClock(seconds(g.introText(t()), state.lang, INTRO_EXTRA)); }
    });
    document.querySelector(".lang").addEventListener("click", function (e) {
      const b = e.target.closest("button[data-lang]");
      if (!b) return;
      state.lang = b.dataset.lang;
      try { localStorage.setItem("check42-lang", state.lang); } catch (err) {}
      state.justAdded = null;
      state.typed = true;   // switching language mid-setup shows the whole text in the new language
      render();   // the clock keeps running across a language switch
    });

    render();
    startClock(seconds(g.introText(t()), state.lang, INTRO_EXTRA));
  };
})();
