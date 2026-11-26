import 'server-only';

import { pilotContactBlocked } from '@/lib/pilot-access-blocks';
import { prepareProfessionalProfiles } from '@/lib/professional-profile';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import type { FppPostStatus, FppPostType, FppRequestStatus } from '@/lib/fpp-posts';

async function prepareFppCommunity() {
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
    published_at TEXT
  )`);
  await executePrivateSql('CREATE INDEX IF NOT EXISTS fpp_posts_by_user ON fpp_posts(user_id, created_at DESC)');
  await executePrivateSql('CREATE INDEX IF NOT EXISTS fpp_posts_by_status ON fpp_posts(status, published_at DESC)');
}

type PostDraft = { kind: FppPostType; title: string; body: string };
export type FppPost = PostDraft & { id: string; author_name: string; status: FppPostStatus };
export type FppReviewRequest = { id: string; user_id: string; display_name: string; status: FppRequestStatus };

export async function getFppAccount(userId: string) {
  await prepareFppCommunity();
  const [access, posts] = await Promise.all([
    executePrivateSql('SELECT status FROM fpp_requests WHERE user_id = ?', [userId]),
    executePrivateSql(`SELECT id, kind, title, body, author_name, status FROM fpp_posts
      WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 30`, [userId]),
  ]);
  return {
    status: (sqlRows(access)[0]?.status ?? null) as FppRequestStatus | null,
    posts: sqlRows(posts) as unknown as FppPost[],
  };
}

export async function requestFppAccess(userId: string, id: string, contactKeys: string) {
  await prepareFppCommunity();
  const result = await executePrivateSql(`INSERT INTO fpp_requests (user_id, id, status, requested_at)
    SELECT user_id, ?, 'pending', ? FROM professional_profiles WHERE user_id = ? AND NOT ${pilotContactBlocked}
    ON CONFLICT(user_id) DO UPDATE SET id = excluded.id, status = 'pending',
      requested_at = excluded.requested_at, reviewed_at = NULL
    WHERE fpp_requests.status = 'declined'`, [id, new Date().toISOString(), userId, contactKeys]);
  return Number(result.affected_row_count) === 1;
}

export async function submitFppPost(userId: string, id: string, post: PostDraft, contactKeys: string) {
  await prepareFppCommunity();
  const result = await executePrivateSql(`INSERT INTO fpp_posts (id, user_id, kind, title, body, author_name, status, created_at)
    SELECT ?, p.user_id, ?, ?, ?, p.display_name, 'pending', ?
    FROM professional_profiles p JOIN fpp_requests r ON r.user_id = p.user_id
    WHERE p.user_id = ? AND r.status = 'approved' AND NOT ${pilotContactBlocked}`,
  [id, post.kind, post.title, post.body, new Date().toISOString(), userId, contactKeys]);
  return Number(result.affected_row_count) === 1;
}

export async function getPublishedFppPosts() {
  await prepareFppCommunity();
  return sqlRows(await executePrivateSql(`SELECT id, kind, title, body, author_name FROM fpp_posts
    WHERE status = 'published' ORDER BY published_at DESC, id DESC LIMIT 50`)) as unknown as Array<Omit<FppPost, 'status'>>;
}

export const fppReviewPageSize = 25;

export async function getFppReview(page: number, queue: 'requests' | 'posts') {
  // Ordering the open queue first keeps decisions within reach while preserving access to history.
  await prepareFppCommunity();
  const offset = (page - 1) * fppReviewPageSize;
  const pagination = [String(fppReviewPageSize + 1), String(offset)];
  if (queue === 'requests') {
    const requests = sqlRows(await executePrivateSql(`SELECT r.id, r.user_id, p.display_name, r.status
      FROM fpp_requests r JOIN professional_profiles p ON p.user_id = r.user_id
      ORDER BY (r.status = 'pending') DESC, r.requested_at DESC, r.id DESC LIMIT CAST(? AS INTEGER) OFFSET CAST(? AS INTEGER)`, pagination));
    return { requests: requests as unknown as FppReviewRequest[], posts: [] as FppPost[] };
  }
  const posts = sqlRows(await executePrivateSql(`SELECT id, kind, title, body, author_name, status FROM fpp_posts
    ORDER BY (status = 'pending') DESC, created_at DESC, id DESC LIMIT CAST(? AS INTEGER) OFFSET CAST(? AS INTEGER)`, pagination));
  return { requests: [] as FppReviewRequest[], posts: posts as unknown as FppPost[] };
}

export async function reviewFppRequest(id: string, decision: 'approved' | 'declined') {
  const result = await executePrivateSql(`UPDATE fpp_requests SET status = ?, reviewed_at = ?
    WHERE id = ? AND status = 'pending'`, [decision, new Date().toISOString(), id]);
  return Number(result.affected_row_count) === 1;
}

export async function reviewFppPost(id: string, decision: 'published' | 'declined' | 'removed') {
  const now = new Date().toISOString();
  const result = await executePrivateSql(`UPDATE fpp_posts SET status = ?, reviewed_at = ?,
    published_at = CASE WHEN ? = 'published' THEN ? ELSE published_at END WHERE id = ? AND status = ?`,
  [decision, now, decision, now, id, decision === 'removed' ? 'published' : 'pending']);
  return Number(result.affected_row_count) === 1;
}
