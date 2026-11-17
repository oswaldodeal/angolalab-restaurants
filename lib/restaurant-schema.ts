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
    activated_at TEXT NOT NULL, cover_photo_url TEXT, menu_photo_url TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS restaurant_profile_details (
    restaurant_id TEXT PRIMARY KEY REFERENCES restaurant_listings(id),
    description TEXT NOT NULL, opening_hours TEXT NOT NULL, description_en TEXT, opening_hours_en TEXT, version TEXT NOT NULL,
    updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
  )`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_profile_details
    BEFORE DELETE ON restaurant_listings
    BEGIN DELETE FROM restaurant_profile_details WHERE restaurant_id=OLD.id; END`,
  `CREATE TABLE IF NOT EXISTS restaurant_logos (
    restaurant_id TEXT PRIMARY KEY REFERENCES restaurant_listings(id),
    photo_url TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
  )`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_logo
    BEFORE DELETE ON restaurant_listings
    BEGIN DELETE FROM restaurant_logos WHERE restaurant_id=OLD.id; END`,
  `CREATE TABLE IF NOT EXISTS restaurant_owners (
    restaurant_id TEXT PRIMARY KEY REFERENCES restaurant_listings(id),
    clerk_user_id TEXT NOT NULL, note TEXT NOT NULL, reviewer TEXT NOT NULL, linked_at TEXT NOT NULL
  )`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_owner
    BEFORE DELETE ON restaurant_listings
    BEGIN DELETE FROM restaurant_owners WHERE restaurant_id=OLD.id; END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_audit_owner_link
    AFTER INSERT ON restaurant_owners
    BEGIN INSERT INTO restaurant_review_history (submission_id,from_status,to_status,note,reviewer,reviewed_at)
      VALUES (NEW.restaurant_id,'owner-unlinked','owner-linked',NEW.note,NEW.reviewer,NEW.linked_at); END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_audit_owner_unlink
    AFTER DELETE ON restaurant_owners
    BEGIN INSERT INTO restaurant_review_history (submission_id,from_status,to_status,note,reviewer,reviewed_at)
      VALUES (OLD.restaurant_id,'owner-linked','owner-unlinked','Owner access revoked','shared-pilot-staff',strftime('%Y-%m-%dT%H:%M:%fZ','now')); END`,
  `CREATE TABLE IF NOT EXISTS restaurant_menu_items (
    id TEXT PRIMARY KEY, restaurant_id TEXT NOT NULL REFERENCES restaurant_listings(id),
    name TEXT NOT NULL, name_en TEXT, category TEXT NOT NULL CHECK(category IN ('mains','drinks','desserts')),
    price TEXT NOT NULL, photo TEXT, updated_at TEXT NOT NULL, availability TEXT NOT NULL DEFAULT 'available' CHECK(availability IN ('available','unavailable'))
  )`,
  // Reserve reference numbers permanently, including after an item is deleted.
  `CREATE TABLE IF NOT EXISTS restaurant_menu_references (
    number INTEGER PRIMARY KEY AUTOINCREMENT, item_id TEXT NOT NULL UNIQUE
  )`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_assign_menu_reference
    AFTER INSERT ON restaurant_menu_items
    BEGIN INSERT OR IGNORE INTO restaurant_menu_references (item_id) VALUES (NEW.id); END`,
  `INSERT OR IGNORE INTO restaurant_menu_references (item_id)
    SELECT m.id FROM restaurant_menu_items m
    WHERE NOT EXISTS (SELECT 1 FROM restaurant_menu_references r WHERE r.item_id=m.id)
    ORDER BY m.rowid`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_clear_removed_menu_photos
    AFTER UPDATE OF menu_photo_url ON restaurant_pro_plans
    WHEN NEW.menu_photo_url IS NOT NULL
    BEGIN
      UPDATE restaurant_menu_items SET photo=NULL,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
      WHERE restaurant_id=NEW.id AND photo IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM json_each(CASE WHEN json_valid(NEW.menu_photo_url)
        THEN NEW.menu_photo_url ELSE json_array(NEW.menu_photo_url) END) j WHERE j.value=restaurant_menu_items.photo);
    END`,
  `CREATE TRIGGER IF NOT EXISTS restaurant_remove_menu
    BEFORE DELETE ON restaurant_listings
    BEGIN DELETE FROM restaurant_menu_items WHERE restaurant_id = OLD.id; END`,
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
