import 'server-only';

import { prepareFppCommunity } from '@/lib/fpp-community';
import { pilotContactBlocked } from '@/lib/pilot-access-blocks';
import { executePrivateSql, sqlRows } from '@/lib/turso';

async function prepareComments() {
  await prepareFppCommunity();
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS fpp_comments (
    id TEXT PRIMARY KEY NOT NULL,
    post_id TEXT NOT NULL REFERENCES fpp_posts(id),
    user_id TEXT NOT NULL REFERENCES professional_profiles(user_id),
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','published','declined','removed')),
    created_at TEXT NOT NULL,
    reviewed_at TEXT
  )`);
  await executePrivateSql('CREATE INDEX IF NOT EXISTS fpp_comments_post_status ON fpp_comments(post_id, status, created_at DESC)');
}

export async function writeFppComment(id: string, userId: string, postId: string, body: string, contactKeys: string) {
  await prepareComments();
  const now = new Date().toISOString();
  const row = await executePrivateSql(`INSERT INTO fpp_comments (id, post_id, user_id, author_name, body, status, created_at)
    SELECT ?, p.id, a.user_id, a.display_name, ?, 'pending', ?
    FROM fpp_posts p JOIN professional_profiles a ON a.user_id = ?
    WHERE p.id = ? AND p.status = 'published' AND NOT ${pilotContactBlocked}
      AND (COALESCE(p.restaurant_id, '') = '' OR EXISTS (
        SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id = o.restaurant_id
        WHERE o.clerk_user_id = p.user_id AND l.id = p.restaurant_id
      ))
      AND NOT EXISTS (SELECT 1 FROM fpp_comments c
        WHERE c.post_id = p.id AND c.user_id = a.user_id AND c.status = 'pending' AND c.body = ?)`,
  [id, body, now, userId, postId, contactKeys, body]);
  return Number(row.affected_row_count) === 1;
}

type VisibleComment = { id: string; post_id: string; author_name: string; body: string };

export async function getPublishedFppComments(postIds: string[]) {
  if (!postIds.length) return [];
  await prepareComments();
  return sqlRows(await executePrivateSql(`WITH recent AS (
    SELECT id, post_id, user_id, author_name, body, created_at FROM (
      SELECT id, post_id, user_id, author_name, body, created_at,
        ROW_NUMBER() OVER (PARTITION BY post_id ORDER BY created_at DESC, id DESC) AS position
      FROM fpp_comments WHERE status = 'published' AND post_id IN (SELECT value FROM json_each(?))
    ) WHERE position <= 10
  ), profiles AS (
    SELECT c.id AS comment_id, p.id AS profile_post_id,
      ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY p.published_at DESC, p.id DESC) AS position
    FROM recent c JOIN fpp_posts p ON p.user_id = c.user_id AND p.author_name = c.author_name COLLATE NOCASE
    WHERE p.status = 'published' AND (COALESCE(p.restaurant_id, '') = '' OR EXISTS (
      SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id = o.restaurant_id
      WHERE o.clerk_user_id = p.user_id AND l.id = p.restaurant_id
    ))
  )
  SELECT c.id, c.post_id, c.author_name, c.body, profiles.profile_post_id
  FROM recent c LEFT JOIN profiles ON profiles.comment_id = c.id AND profiles.position = 1
  ORDER BY c.created_at, c.id`, [JSON.stringify(postIds)])) as unknown as
    Array<VisibleComment & { profile_post_id: string | null }>;
}

export async function getFppCommentReview(page: number, pageSize: number) {
  await prepareComments();
  return sqlRows(await executePrivateSql(`SELECT c.id, c.author_name, c.body, c.status, p.title AS post_title, p.status AS post_status
    FROM fpp_comments c JOIN fpp_posts p ON p.id = c.post_id
    WHERE c.status IN ('pending', 'published')
    ORDER BY (c.status = 'pending') DESC, c.created_at DESC, c.id DESC
    LIMIT CAST(? AS INTEGER) OFFSET CAST(? AS INTEGER)`,
  [String(pageSize + 1), String((page - 1) * pageSize)])) as unknown as Array<VisibleComment & {
    status: 'pending' | 'published'; post_title: string; post_status: string;
  }>;
}

export async function reviewFppComment(id: string, decision: 'published' | 'declined' | 'removed') {
  await prepareComments();
  const result = await executePrivateSql(`UPDATE fpp_comments SET status = ?, reviewed_at = ?
    WHERE id = ? AND status = ? AND (? <> 'published' OR EXISTS (
      SELECT 1 FROM fpp_posts p WHERE p.id = fpp_comments.post_id AND p.status = 'published'
    ))`, [decision, new Date().toISOString(), id, decision === 'removed' ? 'published' : 'pending', decision]);
  return Number(result.affected_row_count) === 1;
}
