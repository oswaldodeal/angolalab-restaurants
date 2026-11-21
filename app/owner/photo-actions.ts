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
    await executePrivateSql(`INSERT INTO restaurant_profile_media(id,menu_photo_url)
      SELECT l.id,'[]' FROM restaurant_listings l JOIN restaurant_owners o ON o.restaurant_id=l.id WHERE l.id=? AND o.clerk_user_id=? ON CONFLICT(id) DO NOTHING`,[id,userId]);

    const access = `EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id WHERE o.restaurant_id=restaurant_profile_media.id AND o.clerk_user_id=?)`;
    const row = sqlRows(await executePrivateSql(`SELECT menu_photo_url,cover_photo_url,(SELECT verified_at FROM restaurant_verified_contacts v WHERE v.id=restaurant_profile_media.id AND v.is_active=1) AS verified_at FROM restaurant_profile_media WHERE id=? AND ${access}`, [id,userId]))[0];
    if (row) {
      const photos = readMenuPhotos(row.menu_photo_url,row.cover_photo_url);
      const photo = remove ? photos.find(src => createHash('sha256').update(src).digest('hex') === token) : await photoUpload(form);
      if (!photo) return remove ? 'stale' : 'invalid-upload';
      if (!remove && photos.includes(photo)) return 'menu-duplicate';
      if (!remove && photos.length >= (row.verified_at ? MENU_PHOTO_LIMIT : 2)) return 'menu-limit';
      const next = remove ? photos.filter(src => src !== photo) : [...photos,photo];
      const changed = await executePrivateSql(`UPDATE restaurant_profile_media SET menu_photo_url=? WHERE id=?
        AND menu_photo_url IS ? AND (menu_photo_url IS NOT NULL OR cover_photo_url IS ?) AND ${access} AND (${remove ? 1 : 0}=1 OR ${next.length}<=2 OR EXISTS(SELECT 1 FROM restaurant_verified_contacts v WHERE v.id=restaurant_profile_media.id AND v.is_active=1))`,
        [JSON.stringify(next),id,row.menu_photo_url,row.cover_photo_url,userId]);
      if (Number(changed.affected_row_count) === 1) result = remove ? 'menu-removed' : 'menu-saved';
    }
  } catch (error) { result = error instanceof Error && error.message === 'INVALID_PHOTO_UPLOAD' ? 'invalid-upload' : 'unavailable'; }
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout'); revalidatePath('/pt/restaurantes', 'layout');
  return result;
}

export async function updateOwnerCoverPhoto(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('id') ?? '');
  const token = String(form.get('coverToken') ?? '');
  const remove = form.get('intent') === 'remove';
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || (token && !/^[a-f0-9]{64}$/.test(token))) return 'stale';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    await executePrivateSql(`INSERT INTO restaurant_profile_media(id,menu_photo_url)
      SELECT l.id,'[]' FROM restaurant_listings l JOIN restaurant_owners o ON o.restaurant_id=l.id WHERE l.id=? AND o.clerk_user_id=? ON CONFLICT(id) DO NOTHING`,[id,userId]);

    const access = `EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id WHERE o.restaurant_id=restaurant_profile_media.id AND o.clerk_user_id=?)`;
    const row = sqlRows(await executePrivateSql(`SELECT cover_photo_url,menu_photo_url FROM restaurant_profile_media WHERE id=? AND ${access}`, [id,userId]))[0];
    if (row) {
      const currentToken = row.cover_photo_url ? createHash('sha256').update(row.cover_photo_url).digest('hex') : '';
      if (token !== currentToken || (remove && !row.cover_photo_url)) return 'stale';
      const photo = remove ? null : await photoUpload(form);
      if (!remove && !photo) return 'invalid-upload';
      if (!remove && photo === row.cover_photo_url) return 'cover-duplicate';
      // Preserve the legacy sample menu before the cover changes. A concurrent menu edit wins.
      const menu = JSON.stringify(readMenuPhotos(row.menu_photo_url,row.cover_photo_url));
      const changed = await executePrivateSql(`UPDATE restaurant_profile_media SET cover_photo_url=?,menu_photo_url=COALESCE(menu_photo_url,?)
        WHERE id=? AND cover_photo_url IS ? AND ${access}`, [photo,menu,id,row.cover_photo_url,userId]);
      if (Number(changed.affected_row_count) === 1) result = remove ? 'cover-removed' : 'cover-saved';
    }
  } catch (error) { result = error instanceof Error && error.message === 'INVALID_PHOTO_UPLOAD' ? 'invalid-upload' : 'unavailable'; }
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout'); revalidatePath('/pt/restaurantes', 'layout');
  revalidatePath('/findme');
  return result;
}
