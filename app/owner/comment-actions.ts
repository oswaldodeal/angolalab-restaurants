'use server';
import { randomUUID } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { executePrivateSql } from '@/lib/turso';
import { prepareComments } from '@/lib/restaurant-comments';

function refreshComments() {
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout');
}
export async function submitComment(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('restaurantId') ?? '');
  const reference = String(form.get('reference') ?? '').trim().toUpperCase();
  const body = String(form.get('body') ?? '').trim();
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !/^AL-\d{6,12}$/.test(reference) || body.length < 20 || body.length > 1000 || form.get('consent') !== 'on') return 'invalid';
  try {
    await prepareComments();
    const now = new Date();
    const changed = await executePrivateSql(`INSERT INTO restaurant_comments(id,restaurant_id,user_id,public_name,menu_reference,body,status,created_at,version)
      SELECT ?,l.id,u.user_id,u.public_name,?,?,'pending',?,? FROM restaurant_listings l JOIN restaurant_commenters u ON u.user_id=? AND u.active=1 WHERE l.id=?
      AND EXISTS(SELECT 1 FROM restaurant_menu_items m JOIN restaurant_menu_references r ON r.item_id=m.id WHERE m.restaurant_id=l.id AND r.number=CAST(? AS INTEGER))
      AND NOT EXISTS(SELECT 1 FROM restaurant_owners o WHERE o.restaurant_id=l.id AND o.clerk_user_id=u.user_id)
      AND NOT EXISTS(SELECT 1 FROM restaurant_comments c WHERE c.user_id=u.user_id AND c.restaurant_id=l.id AND c.created_at>?)
      AND (SELECT COUNT(*) FROM restaurant_comments c WHERE c.user_id=u.user_id AND c.created_at>?)<5`,
      [randomUUID(),reference,body,now.toISOString(),randomUUID(),userId,id,reference.slice(3),new Date(now.getTime()-86400000).toISOString(),new Date(now.getTime()-86400000).toISOString()]);
    if (Number(changed.affected_row_count) !== 1) return 'not-allowed';
    refreshComments(); return 'comment-pending';
  } catch { return 'unavailable'; }
}
export async function removeOwnComment(form: FormData): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;
  await prepareComments();
  await executePrivateSql(`UPDATE restaurant_comments SET status='removed',review_note='Removed by author',reviewed_at=?,version=? WHERE id=? AND user_id=? AND status IN ('pending','approved')`,[new Date().toISOString(),randomUUID(),String(form.get('id')??''),userId]);
  refreshComments();
}
