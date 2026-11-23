'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { isPilotContactBlocked, pilotContactBlocked, verifiedContactKeys } from '@/lib/pilot-access-blocks';
import { restaurantReferral } from '@/lib/restaurant-referral';
import { prepareRestaurantOrders } from '@/lib/restaurant-orders';
import { executePrivateSql, sqlRows } from '@/lib/turso';

function refreshOrders() {
  revalidatePath('/en/account');
  revalidatePath('/pt/conta');
}

export async function submitRestaurantOrder(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('orderId') ?? '');
  if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/.test(id)) return 'invalid';
  const restaurantId = restaurantReferral(form.get('restaurantId'));
  if (!restaurantId) return 'invalid';
  const items: Array<{ reference: string; quantity: number }> = [];
  for (const [key, value] of form) {
    if (!key.startsWith('item:') || value === '0' || value === '') continue;
    const reference = key.slice(5);
    if (!/^AL-\d{6,12}$/.test(reference) || !/^(?:[1-9]|10)$/.test(String(value)) ||
        items.some(item => item.reference === reference) || items.length >= 20) return 'invalid';
    items.push({reference, quantity: Number(value)});
  }
  if (!items.length) return 'invalid';
  try {
    const keys = await verifiedContactKeys(userId);
    if (keys === '[]') return 'verification-required';
    await prepareRestaurantOrders();
    const changed = await executePrivateSql(`WITH requested AS (
      SELECT json_extract(value,'$.reference') AS reference, json_extract(value,'$.quantity') AS quantity FROM json_each(?)
    ), available AS (
      SELECT q.reference,q.quantity,m.name,COALESCE(m.name_en,'') AS name_en,m.price
      FROM requested q JOIN restaurant_menu_references ref ON q.reference=printf('AL-%06d',ref.number)
      JOIN restaurant_menu_items m ON m.id=ref.item_id AND m.restaurant_id=? AND m.availability='available'
    )
    INSERT INTO restaurant_orders(id,restaurant_id,customer_id,lines,created_at)
    SELECT ?,l.id,?,(SELECT json_group_array(json_object('reference',reference,'quantity',quantity,
      'name',name,'nameEn',name_en,'price',price)) FROM available),?
    FROM restaurant_listings l WHERE l.id=?
      AND EXISTS (SELECT 1 FROM restaurant_owners WHERE restaurant_id=l.id AND clerk_user_id<>?)
      AND (SELECT count(*) FROM available)=(SELECT count(*) FROM requested)
      AND NOT ${pilotContactBlocked}
    ON CONFLICT DO NOTHING`, [JSON.stringify(items),restaurantId,id,userId,new Date().toISOString(),restaurantId,userId,keys]);
    if (!Number(changed.affected_row_count)) {
      if (await isPilotContactBlocked(keys)) return 'blocked';
      const [result] = sqlRows(await executePrivateSql(`SELECT CASE
        WHEN EXISTS (SELECT 1 FROM restaurant_owners WHERE restaurant_id=? AND clerk_user_id=?) THEN 'own-restaurant'
        WHEN EXISTS (SELECT 1 FROM restaurant_orders WHERE id=? AND restaurant_id=? AND customer_id=?) THEN 'already-submitted'
        WHEN EXISTS (SELECT 1 FROM restaurant_orders WHERE restaurant_id=? AND customer_id=? AND status='pending') THEN 'pending-order'
        WHEN NOT EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id WHERE l.id=?) THEN 'counter-unavailable'
        ELSE 'stale' END AS reason`, [restaurantId,userId,id,restaurantId,userId,restaurantId,userId,restaurantId]));
      refreshOrders();
      return result?.reason ?? 'stale';
    }
    refreshOrders();
    return 'submitted';
  } catch { return 'unavailable'; }
}

export async function decideRestaurantOrder(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('orderId') ?? '');
  const decision = String(form.get('decision') ?? '');
  const reason = String(form.get('reason') ?? '');
  const item = String(form.get('item') ?? '');
  const note = String(form.get('note') ?? '').trim();
  if (!/^[\da-f-]{36}$/.test(id) || !['accepted','declined','completed'].includes(decision) ||
      (decision === 'declined' && (!['unavailable','capacity','other'].includes(reason) ||
        (reason === 'unavailable' && !item) || note.length > 300))) return 'invalid';
  try {
    await prepareRestaurantOrders();
    const now = new Date().toISOString();
    const changed = await executePrivateSql(`UPDATE restaurant_orders AS r SET status=?,
      decided_at=CASE WHEN ?='completed' THEN decided_at ELSE ? END,
      completed_at=CASE WHEN ?='completed' THEN ? ELSE NULL END,
      decision_by=CASE WHEN ?='completed' THEN decision_by ELSE ? END,
      decline_reason=?,decline_item=?,decline_note=?
      WHERE r.id=? AND r.status=?
        AND EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id
          WHERE o.restaurant_id=r.restaurant_id AND o.clerk_user_id=?)
        AND (? IS NULL OR EXISTS (SELECT 1 FROM json_each(r.lines) WHERE json_extract(value,'$.reference')=?))`,
    [decision,decision,now,decision,now,decision,userId,
      decision === 'declined' ? reason : null,decision === 'declined' && item ? item : null,decision === 'declined' && note ? note : null,
      id,decision === 'completed' ? 'accepted' : 'pending',userId,
      decision === 'declined' && item ? item : null,item]);
    if (!Number(changed.affected_row_count)) return 'stale';
    refreshOrders();
    return 'saved';
  } catch { return 'unavailable'; }
}
