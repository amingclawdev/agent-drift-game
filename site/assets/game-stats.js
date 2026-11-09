/* Anonymous play counts, shared by every episode.
   When a game ends (and wasn't skipped), the page sends it once per browser per episode to /api/play:
   the answers, the language, timed or not, and the short link the player came in by (?src=...).
   No name, no cookie. The server also records the player's IP address and counts one game per IP. The reveal then shows where everyone first said NO, from /api/stats.
   If the API isn't there (a local preview, or stats turned off), nothing is sent and nothing is shown. */
(function () {
  const EP = Number((location.pathname.match(/\/ep(\d+)\//) || [])[1]) || 0;
  const VERSION = { 1: 1, 2: 1, 3: 1 };   // bump an episode's number when its questions change

  // The short link the player came in by. Kept for the tab, so "Play again" keeps it too.
  const SRC = (function () {
    try {
      const s = new URLSearchParams(location.search).get("src");
      if (s && /^[a-z0-9]{1,12}$/.test(s)) { sessionStorage.setItem("drift-src", s); return s; }
      return sessionStorage.getItem("drift-src") || "";
    } catch (e) { return ""; }
  })();

  const TXT = {
    en: {
      notice: "Your answers go into the stats without your name or a cookie. Your IP address is recorded, so each IP counts once.",
      title: "How other players answered",
      lead: (n) => `${n} ${n === 1 ? "player has" : "players have"} finished this game. Where each one first said NO:`,
      leadScore: (n, of) => `${n} ${n === 1 ? "player has" : "players have"} finished this game. How many of the ${of} each one got:`,
      none: "Never", you: "you",
      note: "What's recorded: the answers, the language, timed or not, the link the player came in by, and the IP address. Only the first finished game from each IP counts.",
    },
    zh: {
      notice: "你的答案会计入统计：不记名字，也不用 cookie；会记录你的 IP，一个 IP 只算一局。",
      title: "其他玩家怎么答",
      lead: (n) => `到目前为止，有 ${n} 位玩家玩完了这一集。每个人第一次说 NO 的位置：`,
      leadScore: (n, of) => `到目前为止，有 ${n} 位玩家玩完了这一集。${of} 个里每个人选中了几个：`,
      none: "没说", you: "你",
      note: "记录的内容：答案、语言、是否限时、从哪个链接进来，以及 IP 地址。每个 IP 只算第一次玩完的那一局。",
    },
  };
  const txt = (lang) => TXT[lang === "zh" ? "zh" : "en"];

  let data = null;      // the last /api/stats answer for this episode
  let pending = null;   // a send and/or load in flight
  let last = null;      // the state the block was last drawn for

  function load() {
    if (!EP) return Promise.resolve(null);
    return fetch(`/api/stats?ep=${EP}`, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && d.ok) data = d; return data; })
      .catch(() => null);
  }

  function send(s) {
    let first = true;
    try {
      const key = `drift-played-ep${EP}`;
      first = !localStorage.getItem(key);
      if (first) localStorage.setItem(key, new Date().toISOString().slice(0, 10));
    } catch (e) {}
    if (!first) return Promise.resolve();
    const body = JSON.stringify({ ep: EP, answers: s.answers.join(""), lang: s.lang, timed: !s.untimed, src: SRC, v: VERSION[EP] || 1 });
    return fetch("/api/play", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
      .then(() => {}, () => {});
  }

  // A scored episode (window.DRIFT_KEY) shows how many each player got; the others, where each first said NO.
  function block(s) {
    if (!data || !data.total) return "";
    const t = txt(s.lang), n = s.answers.length;
    if (data.scores) return scoreBlock(s, t);
    const i = s.skipped ? -2 : s.answers.indexOf("N");
    const mine = i === -2 ? null : i === -1 ? "none" : String(i + 1);
    const keys = Array.from({ length: n }, (_, k) => String(k + 1)).concat(["none"]);
    const max = Math.max(1, ...keys.map((k) => data.firstNo[k] || 0));
    const rows = keys.map((k) => {
      const c = data.firstNo[k] || 0, pct = Math.round((c * 100) / data.total), me = k === mine;
      return `<div class="crowd-row${me ? " mine" : ""}"><span class="k">${k === "none" ? t.none : "#" + k}</span>` +
        `<span class="crowd-bar"><i style="width:${((c / max) * 100).toFixed(1)}%"></i></span>` +
        `<span class="v">${pct}%${me ? ` · ${t.you}` : ""}</span></div>`;
    }).join("");
    return `<div class="right"><h3>${t.title}</h3><p>${t.lead(data.total)}</p></div>
      <div class="crowd-chart">${rows}</div>
      <p class="crowd-note">${t.note}</p>`;
  }

  function scoreBlock(s, t) {
    const key = window.DRIFT_KEY || "", of = data.out_of || key.length;
    const mine = s.skipped || !key ? null : String(key.split("").filter((k, i) => s.answers[i] === k).length);
    const keys = Array.from({ length: of + 1 }, (_, k) => String(k));
    const max = Math.max(1, ...keys.map((k) => data.scores[k] || 0));
    const rows = keys.map((k) => {
      const c = data.scores[k] || 0, pct = Math.round((c * 100) / data.total), me = k === mine;
      return `<div class="crowd-row${me ? " mine" : ""}"><span class="k">${k} / ${of}</span>` +
        `<span class="crowd-bar"><i style="width:${((c / max) * 100).toFixed(1)}%"></i></span>` +
        `<span class="v">${pct}%${me ? ` · ${t.you}` : ""}</span></div>`;
    }).join("");
    return `<div class="right"><h3>${t.title}</h3><p>${t.leadScore(data.total, of)}</p></div>
      <div class="crowd-chart">${rows}</div>
      <p class="crowd-note">${t.note}</p>`;
  }

  // Draws the block into the #crowd slot that DriftEnd leaves at the top of the end section.
  function draw() {
    const el = document.getElementById("crowd");
    if (el && last) el.innerHTML = block(last);
  }

  window.DriftStats = {
    notice: (lang) => txt(lang).notice,
    // The game just ended: send it (unless skipped), then load everyone's answers and draw them.
    finish(s) {
      last = s;
      if (!EP) return;
      pending = (s.skipped ? Promise.resolve() : send(s)).then(load).then(() => { pending = null; draw(); });
    },
    // The reveal was drawn (again, e.g. after a language switch): fill the block from what we have.
    fill(s) {
      last = s;
      if (data) { draw(); return; }
      if (!pending && EP) pending = load().then(() => { pending = null; draw(); });
    },
  };
})();
