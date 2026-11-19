import { readRestaurantMedia } from '@/lib/restaurant-media';
import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { readMenuPhotos } from '@/lib/store';
import { readProfileDetails, prepareRestaurantDatabase } from '@/lib/restaurant-data';

export type StaffSubmission = {
  details_updated_by: string | null; details_updated_at: string | null;
  description: string; public_hours: string; description_en: string; opening_hours_en: string; details_version: string;
  id: string; restaurant_name: string; country: string; city: string; cuisine: string;
  address: string; opening_hours: string | null; owner_name: string; owner_email: string;
  owner_phone: string; status: string; created_at: string; reviewed_at: string | null;
  verified_at: string | null; profile_tier: string | null; pro_id: string | null; cover_photo_url: string | null; menu_photo_url: string | null; review_note: string | null; reviewed_by: string | null;
};

export async function getStaffSubmissions(): Promise<Array<StaffSubmission & { menuPhotos: string[] }>> {
  await prepareRestaurantDatabase();
  const [result,details,media] = await Promise.all([executePrivateSql(`SELECT i.id,restaurant_name,country,city,cuisine,
    address,i.opening_hours,owner_name,owner_email,owner_phone,status,created_at,
    reviewed_at,review_note,reviewed_by,CASE WHEN v.is_active=1 THEN v.verified_at END AS verified_at,p.id AS pro_id,p.profile_tier,p.cover_photo_url,p.menu_photo_url,d.updated_by AS details_updated_by,d.updated_at AS details_updated_at FROM restaurant_intake i
    LEFT JOIN restaurant_verified_contacts v ON v.id = i.id LEFT JOIN restaurant_pro_plans p ON p.id = v.id LEFT JOIN restaurant_profile_details d ON d.restaurant_id=i.id ORDER BY created_at DESC LIMIT 100`),readProfileDetails(),readRestaurantMedia()]);
  const mediaById = new Map(media.map(item=>[item.id,item]));
  const byId = new Map(details.map(item => [item.restaurant_id,item]));
  const submissions = sqlRows(result) as unknown as StaffSubmission[];
  return submissions.map(item => {
    const saved = byId.get(item.id);
    const photos=mediaById.get(item.id);
    return {...item,...photos,description:saved?.description ?? '',public_hours:saved ? saved.opening_hours ?? '' : item.opening_hours ?? '',
      description_en:saved?.description_en ?? '',opening_hours_en:saved?.opening_hours_en ?? '',details_version:saved?.version ?? '',
      menuPhotos:readMenuPhotos(photos ? photos.menu_photo_url : item.menu_photo_url,photos ? photos.cover_photo_url : item.cover_photo_url)};
  });
}
