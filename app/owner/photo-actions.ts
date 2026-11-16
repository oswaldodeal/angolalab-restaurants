'use server';
import { createHash } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { photoUpload } from '@/lib/photo-upload';
import { MENU_PHOTO_LIMIT, readMenuPhotos } from '@/lib/store';

export async function updateOwnerMenuPhoto(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('id') ?? '');
  const remove = form.get('intent') === 'remove';
  const token = String(form.get('photoToken') ?? '');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || (remove && !/^[a-f0-9]{64}$/.test(token))) return 'stale';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const access = `EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id
      JOIN restaurant_verified_contacts v ON v.id=l.id WHERE o.restaurant_id=restaurant_pro_plans.id AND o.clerk_user_id=?)`;
    const row = sqlRows(await executePrivateSql(`SELECT menu_photo_url,cover_photo_url FROM restaurant_pro_plans WHERE id=? AND ${access}`, [id,userId]))[0];
    if (row) {
      const photos = readMenuPhotos(row.menu_photo_url,row.cover_photo_url);
      const photo = remove ? photos.find(src => createHash('sha256').update(src).digest('hex') === token) : await photoUpload(form);
      if (!photo) return remove ? 'stale' : 'invalid-upload';
      if (!remove && photos.includes(photo)) return 'menu-duplicate';
      if (!remove && photos.length >= MENU_PHOTO_LIMIT) return 'menu-limit';
      const next = remove ? photos.filter(src => src !== photo) : [...photos,photo];
      const changed = await executePrivateSql(`UPDATE restaurant_pro_plans SET menu_photo_url=? WHERE id=?
        AND menu_photo_url IS ? AND (menu_photo_url IS NOT NULL OR cover_photo_url IS ?) AND ${access}`,
        [JSON.stringify(next),id,row.menu_photo_url,row.cover_photo_url,userId]);
      if (Number(changed.affected_row_count) === 1) result = remove ? 'menu-removed' : 'menu-saved';
    }
  } catch (error) { result = error instanceof Error && error.message === 'INVALID_PHOTO_UPLOAD' ? 'invalid-upload' : 'unavailable'; }
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout'); revalidatePath('/pt/restaurantes', 'layout');
  return result;
}
