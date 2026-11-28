'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { staffAuthorized } from '@/lib/staff-auth';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { executePrivateSql } from '@/lib/turso';

export async function linkRestaurantOwner(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('restaurantId') ?? '');
  const userId = String(form.get('userId') ?? '').trim();
  const note = String(form.get('note') ?? '').trim();
  const remove = form.get('intent') === 'remove';
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !/^user_[a-zA-Z0-9]{10,100}$/.test(userId)
    || (!remove && (note.length < 20 || note.length > 2000 || form.get('permission') !== 'on'))) {
    redirect('/staff/review?result=invalid-owner');
  }
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const changed = remove
      ? await executePrivateSql('DELETE FROM restaurant_owners WHERE restaurant_id=? AND clerk_user_id=?', [id,userId])
      : await executePrivateSql(`INSERT INTO restaurant_owners (restaurant_id,clerk_user_id,note,reviewer,linked_at)
          SELECT l.id,?,?,?,? FROM restaurant_listings l WHERE l.id=?
          AND NOT EXISTS (SELECT 1 FROM restaurant_owners o WHERE o.restaurant_id=l.id)`,
        [userId,note,'shared-pilot-staff',new Date().toISOString(),id]);
    if (Number(changed.affected_row_count) === 1) result = remove ? 'owner-unlinked' : 'owner-linked';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review'); revalidatePath('/en/account'); revalidatePath('/pt/conta');
  redirect('/staff/review?result=' + result);
}
