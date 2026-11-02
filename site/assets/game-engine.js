/* Shared flow for the browser games, timed like the videos:
   1. the setup (where the clue is) is shown once, on a clock, then folded away;
   2. one question at a time, each on a clock; every question is played, and when time runs out
      the question is marked as unanswered (U), not as YES or NO;
   3. after the last question, everything opens up again with the answer. What matters is the first NO.
   A player can also skip straight to the answer from the start screen; every question is then unanswered.
   Each game supplies its text and how to draw its documents. Reading budgets use the same
   speeds as the videos: 17 characters a second in English, 9 in Chinese, plus time to decide. */
(function () {
  const SPEED = { en: 17, zh: 9 };
  const DECIDE = 4;         // seconds to decide once the question is read
  const INTRO_EXTRA = 2;    // the setup is read once, like the video's setup screens

  function plain(html) { return String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(); }
  function seconds(text, lang, extra) { return Math.ceil(plain(text).length / SPEED[lang] + extra); }

  window.DriftGame = function (g) {
    const state = { lang: pickLang(), phase: "intro", answers: [], timeouts: [], untimed: false, skipped: false, deadline: 0, budget: 0, justAdded: null };
    const main = document.getElementById("game");
    let tick = null;

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
      state.deadline = Date.now() + secs * 1000;
      tick = setInterval(update, 100);
    }
    function update() {
      const fill = document.getElementById("timer-fill"), left = document.getElementById("timer-left");
      if (!state.deadline) return;
      const ms = Math.max(0, state.deadline - Date.now());
      if (fill) fill.style.width = (100 * ms / (state.budget * 1000)) + "%";
      if (left) left.textContent = Math.ceil(ms / 1000);
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
      const i = state.answers.length;
      state.answers.push(timedOut ? "U" : a);
      state.timeouts.push(Boolean(timedOut));
      if (g.done(state.answers)) {
        clearInterval(tick);
        state.phase = "done";
        state.justAdded = "end";
        render();
        const el = document.getElementById("reveal");
        if (el) el.scrollIntoView({ block: "start" });
        return;
      }
      state.justAdded = i + 1;
      render();
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
      const el = document.getElementById("reveal");
      if (el) el.scrollIntoView({ block: "start" });
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
      main.innerHTML = html;
      update();
    }

    main.addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.id === "begin") { begin(); return; }
      if (b.id === "skip") { skip(); return; }
      if (b.id === "play-again") {
        clearInterval(tick);
        Object.assign(state, { phase: "intro", answers: [], timeouts: [], skipped: false, justAdded: null });
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
      render();   // the clock keeps running across a language switch
    });

    render();
    startClock(seconds(g.introText(t()), state.lang, INTRO_EXTRA));
  };
})();
