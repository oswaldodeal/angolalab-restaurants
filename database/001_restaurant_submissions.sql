-- AngolaLab Restaurants V1 — private owner submissions.
-- Run once in the separate Restaurants Turso database.
-- Never expose this table directly to public clients.
CREATE TABLE IF NOT EXISTS restaurant_submissions (
  id TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('AO', 'PT')),
  city TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  address TEXT NOT NULL,
  opening_hours TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_restaurant_submissions_status_created
  ON restaurant_submissions(status, created_at);
