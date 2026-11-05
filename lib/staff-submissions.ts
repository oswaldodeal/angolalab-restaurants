import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export type StaffSubmission = {
  id: string; restaurant_name: string; country: string; city: string; cuisine: string;
  address: string; opening_hours: string | null; owner_name: string; owner_email: string;
  owner_phone: string; status: string; created_at: string; reviewed_at: string | null;
  review_note: string | null; reviewed_by: string | null;
};

export async function getStaffSubmissions(): Promise<StaffSubmission[]> {
  await prepareRestaurantDatabase();
  return sqlRows(await executePrivateSql(`SELECT id,restaurant_name,country,city,cuisine,
    address,opening_hours,owner_name,owner_email,owner_phone,status,created_at,
    reviewed_at,review_note,reviewed_by FROM restaurant_intake ORDER BY created_at DESC LIMIT 100`)) as StaffSubmission[];
}
