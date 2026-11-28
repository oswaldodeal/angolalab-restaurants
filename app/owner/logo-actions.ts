'use server';
import { createHash } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { photoUpload } from '@/lib/photo-upload';

export async function updateOwnerLogo(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('id') ?? '');
  const token = String(form.get('logoToken') ?? '');
  const remove = form.get('intent') === 'remove';
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || (token && !/^[a-f0-9]{64}$/.test(token))) return 'stale';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const access = `EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id WHERE o.restaurant_id=? AND o.clerk_user_id=?)`;
    const row = sqlRows(await executePrivateSql(`SELECT g.photo_url FROM restaurant_listings l JOIN restaurant_owners o ON o.restaurant_id=l.id
      LEFT JOIN restaurant_logos g ON g.restaurant_id=l.id WHERE l.id=? AND o.clerk_user_id=?`,[id,userId]))[0];
    if (row) {
      const current = row.photo_url ? createHash('sha256').update(row.photo_url).digest('hex') : '';
      if (token !== current || (remove && !row.photo_url)) return 'stale';
      const photo = remove ? null : await photoUpload(form);
      if (!remove && !photo) return 'invalid-upload';
      if (!remove && photo === row.photo_url) return 'logo-duplicate';
      const changed = remove
        ? await executePrivateSql(`DELETE FROM restaurant_logos WHERE restaurant_id=? AND photo_url=? AND ${access}`,[id,row.photo_url,id,userId])
        : row.photo_url
          ? await executePrivateSql(`UPDATE restaurant_logos SET photo_url=?,updated_at=?,updated_by=? WHERE restaurant_id=? AND photo_url=? AND ${access}`,[photo,new Date().toISOString(),userId,id,row.photo_url,id,userId])
          : await executePrivateSql(`INSERT INTO restaurant_logos (photo_url,updated_at,updated_by,restaurant_id) SELECT ?,?,?,? WHERE ${access}
              AND NOT EXISTS (SELECT 1 FROM restaurant_logos WHERE restaurant_id=?)`,[photo,new Date().toISOString(),userId,id,id,userId,id]);
      if (Number(changed.affected_row_count) === 1) result = remove ? 'logo-removed' : 'logo-saved';
    }
  } catch (error) { result = error instanceof Error && error.message === 'INVALID_PHOTO_UPLOAD' ? 'invalid-upload' : 'unavailable'; }
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout');
  return result;
}
