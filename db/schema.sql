-- Anonymous play counts for the browser games (Cloudflare D1, bound to the Pages project as DB).
-- One row per finished game, and only the first one from each IP address per episode: the answers,
-- the language, timed or not, the short link the player came in by, the time, and the IP address
-- (functions/api/play.js). No name, no cookie.
CREATE TABLE IF NOT EXISTS plays (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  ts       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  ep       INTEGER NOT NULL,            -- episode: 1, 2 or 3
  answers  TEXT    NOT NULL,            -- one letter per question: Y, N, or U (time ran out); episode 3: a-d per task
  first_no INTEGER,                     -- question number of the first N; NULL if never (always NULL in episode 3)
  lang     TEXT    NOT NULL,            -- en or zh
  timed    INTEGER NOT NULL,            -- 1 timed, 0 "play without a timer"
  src      TEXT    NOT NULL DEFAULT '', -- short link channel (bili, yt, ...) or ''
  v        INTEGER NOT NULL DEFAULT 1,  -- version of that episode's questions
  ip       TEXT,                        -- the player's IP address, as Cloudflare saw it
  net      TEXT                         -- the "same player" key: the IPv4 address, or the IPv6 /64
);
CREATE INDEX IF NOT EXISTS plays_ep ON plays (ep, first_no);
-- One counted game per IP per episode. An existing database gets this from migrations/0002_ip.sql.
CREATE UNIQUE INDEX IF NOT EXISTS plays_net ON plays (ep, net);
