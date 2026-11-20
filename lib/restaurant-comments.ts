import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export async function prepareComments() {
  await prepareRestaurantDatabase();
  for (const sql of [
    `CREATE TABLE IF NOT EXISTS restaurant_commenters (user_id TEXT PRIMARY KEY, public_name TEXT NOT NULL, active INTEGER NOT NULL CHECK(active IN (0,1)), review_note TEXT NOT NULL, reviewed_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS restaurant_comments (id TEXT PRIMARY KEY, restaurant_id TEXT NOT NULL REFERENCES restaurant_listings(id) ON DELETE CASCADE, user_id TEXT NOT NULL, public_name TEXT NOT NULL, menu_reference TEXT NOT NULL, body TEXT NOT NULL CHECK(length(body) BETWEEN 20 AND 1000), status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','removed')), created_at TEXT NOT NULL, version TEXT NOT NULL, review_note TEXT, reviewed_at TEXT)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comments_public ON restaurant_comments(restaurant_id,status,created_at)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comments_author ON restaurant_comments(user_id,created_at)`,
    `CREATE TABLE IF NOT EXISTS restaurant_comment_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id TEXT NOT NULL, event TEXT NOT NULL, note TEXT, recorded_at TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comment_audit_subject_event ON restaurant_comment_audit(subject_id,event)`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_created AFTER INSERT ON restaurant_comments BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,recorded_at) VALUES(NEW.id,'pending',NEW.created_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_reviewed AFTER UPDATE OF status ON restaurant_comments BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.id,NEW.status,NEW.review_note,NEW.reviewed_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_commenter_created AFTER INSERT ON restaurant_commenters BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.user_id,'commenter-verified',NEW.review_note,NEW.reviewed_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_commenter_updated AFTER UPDATE ON restaurant_commenters BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.user_id,CASE WHEN NEW.active=1 THEN 'commenter-verified' ELSE 'commenter-revoked' END,NEW.review_note,NEW.reviewed_at); END`,
  ]) await executePrivateSql(sql);
  const columns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_comments)'));
  if (!columns.some(column => column.name === 'body_en')) {
    try {
      await executePrivateSql('ALTER TABLE restaurant_comments ADD COLUMN body_en TEXT');
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'TURSO_COMMENT_TRANSLATION_ALREADY_MIGRATED') throw error;
    }
  }
}

export async function publicComments(id: string, language: 'en' | 'pt' = 'pt') {
  const read = async (showTranslation: boolean) => {
    const body = showTranslation ? "COALESCE(NULLIF(c.body_en,''),c.body)" : 'c.body';
    return sqlRows(await executePrivateSql(`SELECT c.public_name,c.menu_reference,${body} AS body,c.created_at FROM restaurant_comments c JOIN restaurant_commenters u ON u.user_id=c.user_id AND u.active=1 JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.restaurant_id=? AND c.status='approved' ORDER BY c.created_at DESC LIMIT 20`,[id]));
  };
  try {
    return await read(language === 'en');
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_COMMENT_TRANSLATION_NOT_MIGRATED') {
      try { return await read(false); } catch { return null; }
    }
    return null;
  }
}

export async function commenterAccount(userId: string) {
  await prepareComments();
  const commenter = sqlRows(await executePrivateSql('SELECT public_name,active FROM restaurant_commenters WHERE user_id=?',[userId]))[0];
  const comments = sqlRows(await executePrivateSql(`SELECT c.id,c.restaurant_id,c.body,c.menu_reference,c.status,c.created_at,l.name FROM restaurant_comments c JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.user_id=? ORDER BY c.created_at DESC LIMIT 30`,[userId]));
  const ownedIds=sqlRows(await executePrivateSql('SELECT restaurant_id FROM restaurant_owners WHERE clerk_user_id=?',[userId])).map(row=>row.restaurant_id);
  return { commenter, comments, ownedIds };
}
