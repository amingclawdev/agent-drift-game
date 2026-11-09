-- For a database created from the first schema (before IPs were recorded): add the IP columns and the
-- one-game-per-IP index. Run once:  wrangler d1 execute drift-game-stats --remote --file db/migrations/0002_ip.sql
ALTER TABLE plays ADD COLUMN ip TEXT;
ALTER TABLE plays ADD COLUMN net TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS plays_net ON plays (ep, net);
