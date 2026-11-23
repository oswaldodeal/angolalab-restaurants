import 'server-only';

import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { executePrivateSql, sqlRows } from '@/lib/turso';

export async function prepareRestaurantOrders() {
  await prepareRestaurantDatabase();
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS restaurant_orders (
    id TEXT PRIMARY KEY NOT NULL, restaurant_id TEXT NOT NULL, customer_id TEXT NOT NULL,
    lines TEXT NOT NULL CHECK(json_valid(lines)), status TEXT NOT NULL DEFAULT 'pending'
      CHECK(status IN ('pending','accepted','declined','completed')),
    created_at TEXT NOT NULL, decided_at TEXT, completed_at TEXT, decision_by TEXT,
    decline_reason TEXT, decline_item TEXT, decline_note TEXT
  )`);
  await executePrivateSql(`CREATE UNIQUE INDEX IF NOT EXISTS restaurant_orders_pending_customer
    ON restaurant_orders(restaurant_id,customer_id) WHERE status='pending'`);
}

export type OrderLine = { reference: string; name: string; nameEn: string; price: string; quantity: number };

export async function getRestaurantOrders(userId: string, restaurantId: string | undefined, counter = false) {
  if (counter && !restaurantId) return [];
  await prepareRestaurantOrders();
  const filter = counter
    ? 'EXISTS (SELECT 1 FROM restaurant_owners o WHERE o.restaurant_id=r.restaurant_id AND o.clerk_user_id=?)'
    : 'r.customer_id=?';
  const rows = sqlRows(await executePrivateSql(`SELECT r.restaurant_id,i.restaurant_name,i.country,r.id,r.lines,r.status,r.created_at,r.decline_reason,r.decline_item,r.decline_note
    FROM restaurant_orders r LEFT JOIN restaurant_intake i ON i.id=r.restaurant_id
    WHERE (? IS NULL OR r.restaurant_id=?) AND ${filter}
    ORDER BY CASE r.status WHEN 'pending' THEN 0 WHEN 'accepted' THEN 1 ELSE 2 END,r.created_at DESC,r.rowid DESC LIMIT 50`, [restaurantId ?? null,restaurantId ?? null,userId]));
  return rows.map(row => ({
    restaurantId: row.restaurant_id!, restaurantName: row.restaurant_name, country: row.country,
    id: row.id!, status: row.status!, created_at: row.created_at!,
    decline_reason: row.decline_reason, decline_item: row.decline_item, decline_note: row.decline_note,
    lines: JSON.parse(row.lines!) as OrderLine[],
  }));
}
