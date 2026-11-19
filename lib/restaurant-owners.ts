import { readRestaurantMedia } from '@/lib/restaurant-media';
import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { prepareRestaurantDatabase, readProfileDetails, readRestaurantLogos } from '@/lib/restaurant-data';

export async function getOwnedRestaurants() {
  const { userId } = await auth();
  if (!userId) return [];
  try {
    await prepareRestaurantDatabase();
    const [result,details,logos,media] = await Promise.all([
      executePrivateSql(`SELECT l.id,l.name,l.country,l.opening_hours,CASE WHEN v.is_active=1 THEN v.verified_at END AS verified_at,p.id AS pro_id,p.menu_photo_url,p.cover_photo_url
        FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id
        LEFT JOIN restaurant_verified_contacts v ON v.id=l.id LEFT JOIN restaurant_pro_plans p ON p.id=v.id
        WHERE o.clerk_user_id=? ORDER BY l.name LIMIT 100`, [userId]),
      readProfileDetails(), readRestaurantLogos(), readRestaurantMedia(),
    ]);
    const mediaById = new Map(media.map(item=>[item.id,item]));
    const byId = new Map(details.map(item => [item.restaurant_id,item]));
    const logoById = new Map(logos.map(item => [item.restaurant_id,item.photo_url]));
    return sqlRows(result).map((restaurant): Record<string,string | null> & {description:string;opening_hours:string | null;details_version:string} => {
      const saved = byId.get(restaurant.id);
      return {...restaurant,...mediaById.get(restaurant.id),logo_url:logoById.get(restaurant.id) ?? null,description:saved?.description ?? '',description_en:saved?.description_en ?? '',opening_hours_en:saved?.opening_hours_en ?? '',opening_hours:saved ? saved.opening_hours : restaurant.opening_hours,details_version:saved?.version ?? ''};
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_OWNERS_NOT_MIGRATED') return [];
    throw error;
  }
}
