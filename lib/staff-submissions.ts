import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export type StaffSubmission = {
  id: string; restaurant_name: string; country: string; city: string; cuisine: string;
  address: string; opening_hours: string | null; owner_name: string; owner_email: string;
  owner_phone: string; status: string; created_at: string; reviewed_at: string | null;
  verified_at: string | null; pro_id: string | null; cover_photo_url: string | null; review_note: string | null; reviewed_by: string | null;
};

export async function getStaffSubmissions(): Promise<StaffSubmission[]> {
  await prepareRestaurantDatabase();
  return sqlRows(await executePrivateSql(`SELECT i.id,restaurant_name,country,city,cuisine,
    address,opening_hours,owner_name,owner_email,owner_phone,status,created_at,
    reviewed_at,review_note,reviewed_by,v.verified_at,p.id AS pro_id,p.cover_photo_url FROM restaurant_intake i
    LEFT JOIN restaurant_verified_contacts v ON v.id = i.id LEFT JOIN restaurant_pro_plans p ON p.id = v.id ORDER BY created_at DESC LIMIT 100`)) as StaffSubmission[];
}
