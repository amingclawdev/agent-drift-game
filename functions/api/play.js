// POST /api/play: one finished game, sent once per browser per episode by site/assets/game-stats.js.
// Stores the answers, the language, timed or not, the short link the player came in by, the time and
// the player's IP address (db/schema.sql). No name, no cookie. Only the first game from each IP counts,
// per episode. Needs a D1 binding called DB.

// The key that decides "same player": an IPv4 address as is; an IPv6 address cut to its /64 network,
// since phones change the rest of the address all the time and would otherwise count as new players.
function network(ip) {
  ip = ip.split("%")[0];
  if (!ip.includes(":")) return ip;
  const [head, tail] = ip.split("::");
  const h = head ? head.split(":") : [], t = tail ? tail.split(":") : [];
  const groups = tail === undefined ? h : [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t];
  return groups.slice(0, 4).map((g) => g.toLowerCase().replace(/^0+(?=.)/, "") || "0").join(":") + "::/64";
}

// What a finished game looks like, per episode. Episodes 1 and 2 are YES/NO (Y, N, or U when time ran out).
// Episode 3 picks a file per task (a–d; task 6 has only a), and has no "first NO".
const GAMES = {
  1: { pattern: /^[YNU]{10}$/, real: /[YN]/, firstNo: true },
  2: { pattern: /^[YNU]{6}$/, real: /[YN]/, firstNo: true },
  3: { pattern: /^[a-dU]{5}[aU]$/, real: /[a-d]/, firstNo: false },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "stats_off" }, 503);
  const ip = (request.headers.get("CF-Connecting-IP") || "").trim();
  if (!ip || ip.length > 64) return json({ ok: false, error: "no_ip" }, 400);
  const size = Number(request.headers.get("Content-Length") || 0);
  if (size > 2000) return json({ ok: false, error: "too_big" }, 413);

  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_json" }, 400);

  const ep = Number(body.ep);
  const game = GAMES[ep];
  const answers = typeof body.answers === "string" ? body.answers : "";
  // A full game, one letter per question, and at least one real answer (a skipped game is all U).
  if (!game || !game.pattern.test(answers) || !game.real.test(answers)) {
    return json({ ok: false, error: "bad_game" }, 400);
  }
  const lang = body.lang === "zh" ? "zh" : "en";
  const timed = body.timed ? 1 : 0;
  const src = typeof body.src === "string" && /^[a-z0-9]{1,12}$/.test(body.src) ? body.src : "";
  const v = Number.isInteger(body.v) && body.v > 0 && body.v < 100 ? body.v : 1;
  const i = game.firstNo ? answers.indexOf("N") : -1;

  // The unique index on (ep, net) keeps the first game from each IP; later ones are ignored.
  const out = await env.DB.prepare(
    "INSERT OR IGNORE INTO plays (ep, answers, first_no, lang, timed, src, v, ip, net) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(ep, answers, i === -1 ? null : i + 1, lang, timed, src, v, ip, network(ip)).run();
  return json({ ok: true, counted: Boolean(out && out.meta && out.meta.changes) });
}
