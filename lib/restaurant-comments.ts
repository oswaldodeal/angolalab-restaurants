import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export async function prepareComments() {
  await prepareRestaurantDatabase();
  for (const sql of [
    `CREATE TABLE IF NOT EXISTS restaurant_commenters (user_id TEXT PRIMARY KEY, public_name TEXT NOT NULL, active INTEGER NOT NULL CHECK(active IN (0,1)), review_note TEXT NOT NULL, reviewed_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS restaurant_comment_access_requests (user_id TEXT PRIMARY KEY NOT NULL, requested_at TEXT NOT NULL)`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_access_granted_on_insert AFTER INSERT ON restaurant_commenters WHEN NEW.active=1 BEGIN DELETE FROM restaurant_comment_access_requests WHERE user_id=NEW.user_id; END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_access_granted_on_update AFTER UPDATE OF active ON restaurant_commenters WHEN NEW.active=1 BEGIN DELETE FROM restaurant_comment_access_requests WHERE user_id=NEW.user_id; END`,
    `CREATE TABLE IF NOT EXISTS restaurant_comments (id TEXT PRIMARY KEY, restaurant_id TEXT NOT NULL REFERENCES restaurant_listings(id) ON DELETE CASCADE, user_id TEXT NOT NULL, public_name TEXT NOT NULL, menu_reference TEXT NOT NULL, body TEXT NOT NULL CHECK(length(body) BETWEEN 20 AND 1000), status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','removed')), created_at TEXT NOT NULL, version TEXT NOT NULL, review_note TEXT, reviewed_at TEXT)`,
    `CREATE TABLE IF NOT EXISTS restaurant_comment_replies (
      comment_id TEXT PRIMARY KEY NOT NULL REFERENCES restaurant_comments(id) ON DELETE CASCADE,
      owner_id TEXT NOT NULL, owner_linked_at TEXT NOT NULL, body TEXT NOT NULL CHECK(length(body) BETWEEN 20 AND 1000),
      status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
      version TEXT NOT NULL, submitted_at TEXT NOT NULL, review_note TEXT, reviewed_at TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS restaurant_comment_replies_queue ON restaurant_comment_replies(status,submitted_at)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comments_public ON restaurant_comments(restaurant_id,status,created_at)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comments_author ON restaurant_comments(user_id,created_at)`,
    `CREATE TABLE IF NOT EXISTS restaurant_comment_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id TEXT NOT NULL, event TEXT NOT NULL, note TEXT, recorded_at TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS restaurant_comment_audit_subject_event ON restaurant_comment_audit(subject_id,event)`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_created AFTER INSERT ON restaurant_comments BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,recorded_at) VALUES(NEW.id,'pending',NEW.created_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_comment_reviewed AFTER UPDATE OF status ON restaurant_comments BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.id,NEW.status,NEW.review_note,NEW.reviewed_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_commenter_created AFTER INSERT ON restaurant_commenters BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.user_id,'commenter-verified',NEW.review_note,NEW.reviewed_at); END`,
    `CREATE TRIGGER IF NOT EXISTS restaurant_commenter_updated AFTER UPDATE ON restaurant_commenters BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at) VALUES(NEW.user_id,CASE WHEN NEW.active=1 THEN 'commenter-verified' ELSE 'commenter-revoked' END,NEW.review_note,NEW.reviewed_at); END`,
  ]) await executePrivateSql(sql);
  for (const table of ['restaurant_comments', 'restaurant_comment_replies']) {
    const columns = sqlRows(await executePrivateSql(`PRAGMA table_info(${table})`));
    for (const name of table === 'restaurant_comments' ? ['body_en', 'body_pt', 'under_review'] : ['body_en', 'body_pt']) {
      if (columns.some(column => column.name === name)) continue;
      try {
        await executePrivateSql(`ALTER TABLE ${table} ADD COLUMN ${name} ${name === 'under_review' ? 'INTEGER NOT NULL DEFAULT 0' : 'TEXT'}`);
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'TURSO_COMMENT_TRANSLATION_ALREADY_MIGRATED') throw error;
      }
    }
  }
  await executePrivateSql(`CREATE TRIGGER IF NOT EXISTS restaurant_comment_investigation
    AFTER UPDATE OF under_review ON restaurant_comments WHEN OLD.under_review=0 AND NEW.under_review=1
    BEGIN INSERT INTO restaurant_comment_audit(subject_id,event,note,recorded_at)
    VALUES(NEW.id,'under-review',NEW.review_note,NEW.reviewed_at); END`);
}

export async function publicComments(id: string, language: 'en' | 'pt' = 'pt') {
  const translationColumn = language === 'en' ? 'c.body_en' : 'c.body_pt';
  let showTranslation = true;
  let hasReviewFlag = true;
  const notice = language === 'en' ? 'This comment is under review.' : 'Este comentário está em análise.';
  let showReplies = true;
  let showReplyTranslation = true;
  const replyColumn = language === 'en' ? 'r.body_en' : 'r.body_pt';
  while (true) {
    const body = showTranslation ? `COALESCE(NULLIF(${translationColumn},''),c.body)` : 'c.body';
    const replyText = showReplyTranslation ? `COALESCE(NULLIF(${replyColumn},''),r.body)` : 'r.body';
    const reply = showReplies
      ? `(SELECT ${replyText} FROM restaurant_comment_replies r WHERE r.comment_id=c.id AND r.status='approved')`
      : 'NULL';
    const publicBody = hasReviewFlag ? `CASE WHEN c.under_review=1 THEN ? ELSE ${body} END` : body;
    const publicReply = hasReviewFlag ? `CASE WHEN c.under_review=1 THEN NULL ELSE ${reply} END` : reply;
    try {
      return sqlRows(await executePrivateSql(`SELECT c.public_name,c.menu_reference,${publicBody} AS body,c.created_at,${publicReply} AS reply_body
        FROM restaurant_comments c JOIN restaurant_commenters u ON u.user_id=c.user_id AND u.active=1
        JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.restaurant_id=? AND c.status='approved'
        ORDER BY c.created_at DESC LIMIT 20`, hasReviewFlag ? [notice, id] : [id]));
    } catch (error) {
      if (hasReviewFlag && error instanceof Error && error.message === 'TURSO_COMMENT_REVIEW_NOT_MIGRATED') {
        hasReviewFlag = false;
      } else if (showReplies && error instanceof Error && error.message === 'TURSO_COMMENT_REPLIES_NOT_MIGRATED') {
        showReplies = false;
      } else if (showReplyTranslation && error instanceof Error && error.message === 'TURSO_REPLY_TRANSLATION_NOT_MIGRATED') {
        showReplyTranslation = false;
      } else if (showTranslation && error instanceof Error && error.message === 'TURSO_COMMENT_TRANSLATION_NOT_MIGRATED') {
        showTranslation = false;
      } else return null;
    }
  }
}

export async function commenterAccount(userId: string) {
  await prepareComments();
  const commenter = sqlRows(await executePrivateSql('SELECT public_name,active FROM restaurant_commenters WHERE user_id=?',[userId]))[0];
  const comments = sqlRows(await executePrivateSql(`SELECT c.id,c.restaurant_id,c.body,c.menu_reference,c.status,c.created_at,l.name FROM restaurant_comments c JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.user_id=? ORDER BY c.created_at DESC LIMIT 30`,[userId]));
  const ownedIds=sqlRows(await executePrivateSql('SELECT restaurant_id FROM restaurant_owners WHERE clerk_user_id=?',[userId])).map(row=>row.restaurant_id);
  const accessRequested = commenter?.active !== '1' && sqlRows(await executePrivateSql(
    'SELECT 1 FROM restaurant_comment_access_requests WHERE user_id=?', [userId],
  )).length > 0;
  return { commenter, comments, ownedIds, accessRequested };
}
