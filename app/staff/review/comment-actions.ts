'use server';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { staffAuthorized } from '@/lib/staff-auth';
import { executePrivateSql } from '@/lib/turso';
import { prepareComments } from '@/lib/restaurant-comments';

function refreshComments() {
  for (const path of ['/staff/review','/en/account','/pt/conta']) revalidatePath(path);
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout');
}
export async function verifyCommenter(_previous: string, form: FormData): Promise<string> {
  if (!(await staffAuthorized())) return 'unauthorized';
  const id=String(form.get('userId')??'').trim(), name=String(form.get('publicName')??'').trim(), note=String(form.get('note')??'').trim();
  const revoke=form.get('intent')==='revoke';
  if (!/^user_[a-zA-Z0-9]{8,100}$/.test(id) || note.length<20 || note.length>2000 || (!revoke && (name.length<2 || name.length>50 || !/\p{L}/u.test(name) || /[@<>\r\n]/.test(name) || form.get('checked')!=='on'))) return 'invalid';
  try {
  await prepareComments();
  if (revoke) {
    const changed=await executePrivateSql('UPDATE restaurant_commenters SET active=0,review_note=?,reviewed_at=? WHERE user_id=?',[note,new Date().toISOString(),id]);
    if (Number(changed.affected_row_count)!==1) return 'stale';
  }
  else await executePrivateSql(`INSERT INTO restaurant_commenters(user_id,public_name,active,review_note,reviewed_at) VALUES(?,?,1,?,?) ON CONFLICT(user_id) DO UPDATE SET public_name=excluded.public_name,active=1,review_note=excluded.review_note,reviewed_at=excluded.reviewed_at`,[id,name,note,new Date().toISOString()]);
  refreshComments(); return revoke ? 'revoked' : 'verified';
  } catch { return 'unavailable'; }
}
export async function moderateComment(_previous: string, form: FormData): Promise<string> {
  if (!(await staffAuthorized())) return 'unauthorized';
  const id=String(form.get('id')??''), version=String(form.get('version')??''), decision=String(form.get('decision')??''), note=String(form.get('note')??'').trim();
  const english = form.has('bodyEn') ? String(form.get('bodyEn') ?? '').trim() : null;
  const portuguese = form.has('bodyPt') ? String(form.get('bodyPt') ?? '').trim() : null;
  if (!['approved','rejected'].includes(decision) || note.length<20 || note.length>2000 || (decision==='approved' && Math.max(english?.length ?? 0, portuguese?.length ?? 0)>1500) || id.length>100 || version.length>100) return 'invalid';
  try {
  await prepareComments();
  const changed=await executePrivateSql(`UPDATE restaurant_comments SET status=?,review_note=?,reviewed_at=?,version=?,body_en=CASE WHEN ?='approved' THEN COALESCE(?,body_en) ELSE body_en END,body_pt=CASE WHEN ?='approved' THEN COALESCE(?,body_pt) ELSE body_pt END WHERE id=? AND version=? AND status IN ('pending','approved') AND EXISTS(SELECT 1 FROM restaurant_listings l WHERE l.id=restaurant_comments.restaurant_id) AND (?='rejected' OR EXISTS(SELECT 1 FROM restaurant_commenters u WHERE u.user_id=restaurant_comments.user_id AND u.active=1))`,[decision,note,new Date().toISOString(),randomUUID(),decision,english,decision,portuguese,id,version,decision]);
  refreshComments();return Number(changed.affected_row_count)===1?'review-saved':'stale';
  } catch { return 'unavailable'; }
}

export async function moderateRestaurantReply(_previous: string, form: FormData): Promise<string> {
  if (!(await staffAuthorized())) return 'unauthorized';
  const id = String(form.get('commentId') ?? '');
  const version = String(form.get('version') ?? '');
  const decision = String(form.get('decision') ?? '');
  const note = String(form.get('note') ?? '').trim();
  if (!id || !version || id.length > 100 || version.length > 100 ||
    !['approved', 'rejected'].includes(decision) || note.length < 20 || note.length > 2000) return 'invalid';
  try {
    await prepareComments();
    const result = await executePrivateSql(`UPDATE restaurant_comment_replies AS r
      SET status=?,review_note=?,reviewed_at=?,version=?
      WHERE comment_id=? AND version=? AND
        (status='pending' OR (status='approved' AND ?='rejected'))
      AND (?='rejected' OR EXISTS (
        SELECT 1 FROM restaurant_comments c JOIN restaurant_listings l ON l.id=c.restaurant_id
        JOIN restaurant_commenters u ON u.user_id=c.user_id AND u.active=1
        JOIN restaurant_owners o ON o.restaurant_id=l.id AND o.clerk_user_id=r.owner_id AND o.linked_at=r.owner_linked_at
        WHERE c.id=r.comment_id AND c.status='approved'
      ))`, [decision, note, new Date().toISOString(), randomUUID(), id, version, decision, decision]);
    if (Number(result.affected_row_count) !== 1) return 'stale';
    refreshComments();
    return 'review-saved';
  } catch { return 'unavailable'; }
}
