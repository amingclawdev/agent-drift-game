/* The part every game shows after the reveal: how other players answered, how AI agents played the
   same game, a prompt to hand your own agent, and where to go next. Each game passes its own text per
   language; the agents and prompt blocks are optional (episode 3 has neither). */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render(e) {
    const a = e.agents, p = e.prompt;
    const table = a && a.table
      ? `<div class="tablewrap"><table><thead><tr>${a.table.head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${
          a.table.rows.map((r, i) => `<tr class="${i === a.table.best ? "best" : ""}">${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")
        }</tbody></table></div>`
      : "";
    const next = e.next.map((n) => `<div class="paper${n.tbc ? " tbc" : ""}">
        <span class="title">${n.title}</span><p>${n.desc}</p>
        <div class="actions"><a class="pill${n.tbc ? "" : " solid"}" href="${n.href}">${n.cta}</a></div>
      </div>`).join("");
    return `<section class="end" id="end">
      <div class="crowd" id="crowd"></div>
      ${a ? `<div class="right"><h3>${a.title}</h3><p>${a.intro}</p></div>` : ""}
      ${table}
      ${a && a.notes && a.notes.length ? `<ul>${a.notes.map((n) => `<li>${n}</li>`).join("")}</ul>` : ""}
      ${p ? `<div class="right"><h3>${p.title}</h3><p>${p.intro}</p></div>
      <div class="prompt"><pre id="agent-prompt">${esc(p.text)}</pre></div>
      <div class="actions">
        <button type="button" class="pill solid" id="copy-prompt" data-done="${p.copied}">${p.copy}</button>
        ${p.note ? `<span class="home-link">${p.note}</span>` : ""}
      </div>` : ""}
      ${e.next && e.next.length ? `<div class="right"><h3>${e.nextTitle}</h3></div><div class="next">${next}</div>` : ""}
    </section>`;
  }

  // One listener per page; the copy button is re-rendered with the page.
  document.addEventListener("click", function (ev) {
    const b = ev.target.closest("#copy-prompt");
    if (!b) return;
    const text = document.getElementById("agent-prompt").textContent;
    const label = b.textContent;
    const done = () => { b.textContent = b.dataset.done; setTimeout(() => { b.textContent = label; }, 1500); };
    // Some views refuse the clipboard; then select the prompt so the player can copy it by hand.
    const select = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById("agent-prompt")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, select); else select();
  });

  window.DriftEnd = { render: render };
})();
