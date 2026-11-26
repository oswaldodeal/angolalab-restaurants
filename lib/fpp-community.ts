import 'server-only';

import { randomUUID } from 'node:crypto';

import { pilotContactBlocked } from '@/lib/pilot-access-blocks';
import { emptyVisitorSettings, fppVisitorDetails } from '@/lib/fpp-visitor-settings';
import { prepareVisitorSettings } from '@/lib/fpp-visitor-storage';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { prepareProfessionalProfiles } from '@/lib/professional-profile';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import type { FppPostStatus, FppPostType } from '@/lib/fpp-posts';

let preparation: Promise<void> | undefined;
export function prepareFppCommunity() {
  preparation ??= prepareFppTables().catch(error => { preparation = undefined; throw error; });
  return preparation;
}

async function prepareFppTables() {
  await prepareProfessionalProfiles();
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS fpp_requests (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES professional_profiles(user_id),
    id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending','approved','declined')),
    requested_at TEXT NOT NULL,
    reviewed_at TEXT
  )`);
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS fpp_posts (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES fpp_requests(user_id),
    kind TEXT NOT NULL CHECK(kind IN ('idea','question','project')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending','published','declined','removed')),
    created_at TEXT NOT NULL,
    reviewed_at TEXT,
    published_at TEXT,
    restaurant_id TEXT
  )`);
  const columns = async () => sqlRows(await executePrivateSql('PRAGMA table_info(fpp_posts)'));
  if (!(await columns()).some(column => column.name === 'restaurant_id')) {
    try {
      await executePrivateSql('ALTER TABLE fpp_posts ADD COLUMN restaurant_id TEXT');
    } catch (error) {
      if (!(await columns()).some(column => column.name === 'restaurant_id')) throw error;
    }
  }
  await executePrivateSql('CREATE INDEX IF NOT EXISTS fpp_posts_by_user ON fpp_posts(user_id, created_at DESC)');
  await executePrivateSql('CREATE INDEX IF NOT EXISTS fpp_posts_by_status ON fpp_posts(status, published_at DESC)');
}

type PostDraft = { kind: FppPostType; title: string; body: string };
export type FppPost = PostDraft & { id: string; author_name: string; status: FppPostStatus };
export async function getOwnFppPosts(userId: string) {
  await prepareFppCommunity();
  return sqlRows(await executePrivateSql(`SELECT id, kind, title, status FROM fpp_posts
    WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 30`, [userId])) as unknown as
    Array<Pick<FppPost, 'id' | 'kind' | 'title' | 'status'>>;
}

export async function submitFppPost(userId: string, id: string, post: PostDraft, contactKeys: string, restaurantId = '') {
  await prepareFppCommunity();
  if (restaurantId) await prepareRestaurantDatabase();
  const now = new Date().toISOString();

  // Existing post tables reference this row. Keep old decisions for history without using them as access gates.
  await executePrivateSql(`INSERT INTO fpp_requests (user_id, id, status, requested_at)
    SELECT user_id, ?, 'approved', ? FROM professional_profiles WHERE user_id = ? AND NOT ${pilotContactBlocked}
    ON CONFLICT(user_id) DO NOTHING`, [randomUUID(), now, userId, contactKeys]);

  const businessCheck = restaurantId ? `AND EXISTS (
    SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id = o.restaurant_id
    WHERE o.clerk_user_id = p.user_id AND l.id = ?)` : '';
  const authorName = restaurantId ? '(SELECT name FROM restaurant_listings WHERE id = ?)' : 'p.display_name';
  const result = await executePrivateSql(`INSERT INTO fpp_posts (id, user_id, kind, title, body, author_name, status, created_at, restaurant_id)
    SELECT ?, p.user_id, ?, ?, ?, ${authorName}, 'pending', ?, ?
    FROM professional_profiles p JOIN fpp_requests r ON r.user_id = p.user_id
    WHERE p.user_id = ? AND NOT ${pilotContactBlocked} ${businessCheck}`,
  [id, post.kind, post.title, post.body, ...(restaurantId ? [restaurantId] : []), now, restaurantId, userId, contactKeys, ...(restaurantId ? [restaurantId] : [])]);
  return Number(result.affected_row_count) === 1;
}

export async function getFppBusinesses(userId: string) {
  await prepareRestaurantDatabase();
  return sqlRows(await executePrivateSql(`SELECT l.id, l.name FROM restaurant_owners o
    JOIN restaurant_listings l ON l.id = o.restaurant_id
    WHERE o.clerk_user_id = ? ORDER BY l.name, l.id`, [userId])) as unknown as Array<{ id: string; name: string }>;
}

const visiblePhoto = `EXISTS (SELECT 1 FROM json_each(s.preferences, '$.visible') WHERE value = 'photo')`;

type FeedPost = Omit<FppPost, 'status'> & {
  has_photo: '0' | '1';
  business_id: string | null;
  business_name: string | null;
  business_tier: 'basic' | 'verified' | 'pro' | null;
};

export async function getPublishedFppPosts() {
  try {
    await prepareFppCommunity();
    await prepareVisitorSettings();
    await prepareRestaurantDatabase();
    return await readFppFeed();
  } catch (error) {
    console.error('FPP feed enrichment failed:', error instanceof Error ? error.message : 'unknown');
    const rows = sqlRows(await executePrivateSql(`SELECT id, kind, title, body, author_name FROM fpp_posts
      WHERE status = 'published' AND COALESCE(restaurant_id, '') = '' ORDER BY published_at DESC, id DESC LIMIT 50`));
    return rows.map(row => ({ ...row, has_photo: '0', business_id: null, business_name: null, business_tier: null })) as FeedPost[];
  }
}

async function readFppFeed() {
  return sqlRows(await executePrivateSql(`SELECT p.id, p.kind, p.title, p.body, p.author_name,
      CASE WHEN ${visiblePhoto} AND json_extract(s.preferences, '$.photo') <> '' THEN 1 ELSE 0 END AS has_photo,
      l.id AS business_id, l.name AS business_name,
      CASE WHEN l.id IS NULL THEN NULL
        WHEN COALESCE(v.is_active, 0) <> 1 OR COALESCE(v.verified_at, '') = '' OR
          COALESCE(v.public_address, '') = '' OR COALESCE(v.public_phone, '') = '' THEN 'basic'
        WHEN plans.profile_tier = 'pro' THEN 'pro' ELSE 'verified' END AS business_tier
    FROM fpp_posts p LEFT JOIN fpp_visitor_settings s ON s.user_id = p.user_id
    LEFT JOIN restaurant_listings l ON l.id = (
      SELECT CASE WHEN COUNT(*) = 1 THEN MIN(owned.id) END
      FROM restaurant_owners o JOIN restaurant_listings owned ON owned.id = o.restaurant_id
      WHERE o.clerk_user_id = p.user_id AND (
        owned.id = p.restaurant_id OR (p.restaurant_id IS NULL AND owned.name = p.author_name COLLATE NOCASE))
    )
    LEFT JOIN restaurant_verified_contacts v ON v.id = l.id
    LEFT JOIN restaurant_pro_plans plans ON plans.id = l.id
    WHERE p.status = 'published' AND (COALESCE(p.restaurant_id, '') = '' OR l.id IS NOT NULL) ORDER BY p.published_at DESC, p.id DESC LIMIT 50`)) as unknown as FeedPost[];
}

export async function getFppVisitorProfile(postId: string, language: 'en' | 'pt') {
  await prepareFppCommunity();
  await prepareVisitorSettings();

  const [row] = sqlRows(await executePrivateSql(`SELECT p.author_name, a.profession, a.skills, a.languages, a.projects,
      CASE WHEN json_extract(s.preferences, '$.shareDetails') = 1 THEN s.preferences ELSE NULL END AS shared_settings,
      CASE WHEN ${visiblePhoto} AND json_extract(s.preferences, '$.photo') <> '' THEN 1 ELSE 0 END AS has_photo
    FROM fpp_posts p JOIN professional_profiles a ON a.user_id = p.user_id
    LEFT JOIN fpp_visitor_settings s ON s.user_id = p.user_id
    WHERE p.id = ? AND p.status = 'published' AND COALESCE(p.restaurant_id, '') = ''`, [postId]));
  if (!row?.author_name) return null;
  const details = row.shared_settings ? fppVisitorDetails({
    displayName: row.author_name,
    profession: row.profession ?? '',
    skills: row.skills ?? '',
    languages: row.languages ?? '',
    projects: row.projects ?? '',
  }, { ...emptyVisitorSettings, ...JSON.parse(row.shared_settings) }, language) : [];
  return { displayName: row.author_name, details, hasPhoto: row.has_photo === '1' };
}

export async function getPublishedFppPhoto(postId: string) {
  await Promise.all([prepareFppCommunity(), prepareVisitorSettings(), prepareRestaurantDatabase()]);
  const [row] = sqlRows(await executePrivateSql(`SELECT json_extract(s.preferences, '$.photo') AS photo
    FROM fpp_posts p JOIN fpp_visitor_settings s ON s.user_id = p.user_id
    WHERE p.id = ? AND p.status = 'published' AND ${visiblePhoto}
      AND (COALESCE(p.restaurant_id, '') = '' OR EXISTS (
        SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id = o.restaurant_id
        WHERE o.clerk_user_id = p.user_id AND l.id = p.restaurant_id
      ))`, [postId]));
  return row?.photo ?? null;
}

export const fppReviewPageSize = 25;

export async function getFppReview(page: number) {
  await prepareFppCommunity();
  const offset = (page - 1) * fppReviewPageSize;
  return sqlRows(await executePrivateSql(`SELECT id, kind, title, body, author_name, status FROM fpp_posts
    ORDER BY (status = 'pending') DESC, created_at DESC, id DESC LIMIT CAST(? AS INTEGER) OFFSET CAST(? AS INTEGER)`,
  [String(fppReviewPageSize + 1), String(offset)])) as unknown as FppPost[];
}

export async function reviewFppPost(id: string, decision: 'published' | 'declined' | 'removed') {
  const now = new Date().toISOString();
  const result = await executePrivateSql(`UPDATE fpp_posts SET status = ?, reviewed_at = ?,
    published_at = CASE WHEN ? = 'published' THEN ? ELSE published_at END WHERE id = ? AND status = ?`,
  [decision, now, decision, now, id, decision === 'removed' ? 'published' : 'pending']);
  return Number(result.affected_row_count) === 1;
}
