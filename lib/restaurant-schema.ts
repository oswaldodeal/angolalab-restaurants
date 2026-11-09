// Additive migration: original submissions remain untouched as a recovery source.
export const restaurantSchema = [
  `CREATE TABLE IF NOT EXISTS restaurant_submissions (
    id TEXT PRIMARY KEY, owner_name TEXT NOT NULL, owner_email TEXT NOT NULL,
    owner_phone TEXT NOT NULL, restaurant_name TEXT NOT NULL,
    country TEXT NOT NULL CHECK(country IN ('AO','PT','GB')), city TEXT NOT NULL,
    cuisine TEXT NOT NULL, address TEXT NOT NULL, opening_hours TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), reviewed_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_intake (
    id TEXT PRIMARY KEY, owner_name TEXT NOT NULL, owner_email TEXT NOT NULL,
    owner_phone TEXT NOT NULL, restaurant_name TEXT NOT NULL,
    country TEXT NOT NULL CHECK(country IN ('AO','PT','GB')), city TEXT NOT NULL,
    cuisine TEXT NOT NULL, address TEXT NOT NULL, opening_hours TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','withdrawn')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    reviewed_at TEXT, review_note TEXT, reviewed_by TEXT,
    CHECK(status = 'pending' OR (length(trim(review_note)) >= 20 AND reviewed_by IS NOT NULL))
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_listings (
    id TEXT PRIMARY KEY REFERENCES restaurant_intake(id), name TEXT NOT NULL,
    country TEXT NOT NULL, city TEXT NOT NULL, cuisine TEXT NOT NULL,
    opening_hours TEXT, published_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_review_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, submission_id TEXT NOT NULL,
    from_status TEXT NOT NULL, to_status TEXT NOT NULL,
    note TEXT NOT NULL, reviewer TEXT NOT NULL, reviewed_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_verified_contacts (
    id TEXT PRIMARY KEY REFERENCES restaurant_listings(id),
    public_address TEXT NOT NULL, public_phone TEXT NOT NULL,
    note TEXT NOT NULL, reviewer TEXT NOT NULL, verified_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_pro_plans (
    id TEXT PRIMARY KEY REFERENCES restaurant_verified_contacts(id),
    activated_at TEXT NOT NULL, touristlab_url TEXT
  )`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_pro_plan
    BEFORE DELETE ON restaurant_verified_contacts
    BEGIN
      DELETE FROM restaurant_pro_plans WHERE id = OLD.id;
    END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_audit_verification
    AFTER INSERT ON restaurant_verified_contacts
    BEGIN
      INSERT INTO restaurant_review_history (submission_id,from_status,to_status,note,reviewer,reviewed_at)
      VALUES (NEW.id,'basic','verified',NEW.note,NEW.reviewer,NEW.verified_at);
    END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_verified_contacts
    BEFORE DELETE ON restaurant_listings
    BEGIN
      DELETE FROM restaurant_verified_contacts WHERE id = OLD.id;
    END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_publish_basic
    AFTER UPDATE OF status ON restaurant_intake
    WHEN OLD.status != NEW.status AND NEW.status = 'approved'
    BEGIN
      INSERT INTO restaurant_listings (id,name,country,city,cuisine,opening_hours,published_at)
      VALUES (NEW.id,NEW.restaurant_name,NEW.country,NEW.city,NEW.cuisine,NEW.opening_hours,NEW.reviewed_at);
    END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_record_review
    AFTER UPDATE OF status ON restaurant_intake WHEN OLD.status != NEW.status
    BEGIN
      INSERT INTO restaurant_review_history (submission_id,from_status,to_status,note,reviewer,reviewed_at)
      VALUES (NEW.id,OLD.status,NEW.status,NEW.review_note,NEW.reviewed_by,NEW.reviewed_at);
      DELETE FROM restaurant_listings WHERE id = NEW.id AND NEW.status != 'approved';
    END`,
  `CREATE INDEX IF NOT EXISTS idx_restaurant_intake_status ON restaurant_intake(status,created_at)`,
  // Imported records require a fresh publication review; no legacy status grants verification.
  `INSERT OR IGNORE INTO restaurant_intake
    (id,owner_name,owner_email,owner_phone,restaurant_name,country,city,cuisine,address,opening_hours,created_at)
    SELECT id,owner_name,owner_email,owner_phone,restaurant_name,country,city,cuisine,address,opening_hours,created_at
    FROM restaurant_submissions`,
];
