// GET /api/stats?ep=3: how many players finished an episode, and where each one first said NO.
// Read by site/assets/game-stats.js for the "How other players answered" block. Needs a D1 binding called DB.
// Games sent with src "test" (checks after a deploy) are stored but never counted here.

const QUESTIONS = { 1: 10, 2: 6, 3: 6 };
// Episode 3 is scored, not "first NO": how many of the five tasks matched the file Dana meant.
const KEYS = { 3: "cdbab" };

function json(body, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "stats_off" }, 503);
  const ep = Number(new URL(request.url).searchParams.get("ep"));
  if (!QUESTIONS[ep]) return json({ ok: false, error: "bad_ep" }, 400);

  if (KEYS[ep]) {
    const key = KEYS[ep];
    const { results } = await env.DB.prepare(
      "SELECT substr(answers, 1, ?) AS a, COUNT(*) AS n FROM plays WHERE ep = ? AND src != 'test' GROUP BY a"
    ).bind(key.length, ep).all();
    const scores = {};
    let total = 0;
    for (const row of results || []) {
      let s = 0;
      for (let i = 0; i < key.length; i++) if (row.a[i] === key[i]) s++;
      scores[String(s)] = (scores[String(s)] || 0) + row.n;
      total += row.n;
    }
    return json({ ok: true, ep, total, scores, out_of: key.length });
  }

  const { results } = await env.DB.prepare(
    "SELECT first_no AS k, COUNT(*) AS n FROM plays WHERE ep = ? AND src != 'test' GROUP BY first_no"
  ).bind(ep).all();
  const firstNo = {};
  let total = 0;
  for (const row of results || []) {
    firstNo[row.k === null ? "none" : String(row.k)] = row.n;
    total += row.n;
  }
  // Not cached: a player who just finished should see their own game in the count.
  return json({ ok: true, ep, total, firstNo });
}
