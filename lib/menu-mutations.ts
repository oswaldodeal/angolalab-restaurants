import 'server-only';
import { randomUUID } from 'node:crypto';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { readMenuPhotos } from '@/lib/store';

export async function mutateMenuItem(form: FormData, ownerId: string | null): Promise<string> {
  const id = String(form.get('restaurantId') ?? '');
  const itemId = String(form.get('itemId') ?? '');
  const expected = String(form.get('version') ?? '');
  const remove = form.get('intent') === 'remove';
  const name = String(form.get('name') ?? '').trim();
  const category = String(form.get('category') ?? '');
  const price = String(form.get('price') ?? '').trim();
  const availability = form.has('availability') ? String(form.get('availability')) : null;
  const photoIndex = String(form.get('photo') ?? '');
  const validId = (s: string) => /^[a-zA-Z0-9-]{1,100}$/.test(s);
  if (!validId(id) || (itemId && !validId(itemId)) || (remove && !itemId)
    || (!remove && ((availability !== null && !['available','unavailable'].includes(availability)) || name.length < 2 || name.length > 100 || !['mains','drinks','desserts'].includes(category)
      || !/^\d{1,7}(\.\d{1,2})?$/.test(price)))) return 'invalid-item';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const ownerGuard = ownerId ? ' AND EXISTS (SELECT 1 FROM restaurant_owners o WHERE o.restaurant_id=l.id AND o.clerk_user_id=?)' : '';
    const row = sqlRows(await executePrivateSql(`SELECT l.id,v.verified_at,p.menu_photo_url,p.cover_photo_url
      FROM restaurant_listings l LEFT JOIN restaurant_verified_contacts v ON v.id=l.id
      LEFT JOIN restaurant_pro_plans p ON p.id=v.id WHERE l.id=?${ownerGuard}`, ownerId ? [id,ownerId] : [id]))[0];
    if (row) {
      const photos = readMenuPhotos(row.menu_photo_url, row.cover_photo_url);
      const photo = photoIndex === '' ? null : (/^\d$/.test(photoIndex) ? photos[Number(photoIndex)] : undefined);
      if (!remove && (photo === undefined || (!row.verified_at && category !== 'mains'))) {
        result = 'invalid-item';
      } else {
        const limit = row.verified_at ? '60' : '2';
        const permission = `EXISTS (SELECT 1 FROM restaurant_listings l WHERE l.id=?${ownerGuard})`;
        const permissionArgs = ownerId ? [id,ownerId] : [id];
        const room = `(SELECT count(*) FROM restaurant_menu_items WHERE restaurant_id=? AND id!=?) < ${limit}`;
        let changed;
        if (remove) {
          changed = await executePrivateSql(`DELETE FROM restaurant_menu_items WHERE restaurant_id=? AND id=? AND updated_at=? AND ${permission}`, [id,itemId,expected,...permissionArgs]);
        } else if (itemId) {
          changed = await executePrivateSql(`UPDATE restaurant_menu_items SET name=?,category=?,price=?,photo=?,availability=COALESCE(?,availability),updated_at=?
            WHERE restaurant_id=? AND id=? AND updated_at=? AND ${permission} AND ${room}`,
            [name,category,Number(price).toFixed(2),photo!,availability,new Date(Math.max(Date.now(),(Date.parse(expected) || 0) + 1)).toISOString(),id,itemId,expected,...permissionArgs,id,itemId]);
        } else {
          changed = await executePrivateSql(`INSERT INTO restaurant_menu_items (id,restaurant_id,name,category,price,photo,availability,updated_at)
            SELECT ?,?,?,?,?,?,COALESCE(?,'available'),? WHERE ${permission} AND ${room}`,
            [randomUUID(),id,name,category,Number(price).toFixed(2),photo!,availability,new Date().toISOString(),...permissionArgs,id,'']);
        }
        if (Number(changed.affected_row_count) === 1) result = remove ? 'item-removed' : 'item-saved';
      }
    }
  } catch { result = 'unavailable'; }
  return result;
}
