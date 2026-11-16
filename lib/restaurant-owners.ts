import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { readProfileDetails } from '@/lib/restaurant-data';

export async function getOwnedRestaurants() {
  const { userId } = await auth();
  if (!userId) return [];
  try {
    const [result,details] = await Promise.all([
      executePrivateSql(`SELECT l.id,l.name,l.country,l.opening_hours,v.verified_at,p.id AS pro_id,p.menu_photo_url,p.cover_photo_url
        FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id
        LEFT JOIN restaurant_verified_contacts v ON v.id=l.id LEFT JOIN restaurant_pro_plans p ON p.id=v.id
        WHERE o.clerk_user_id=? ORDER BY l.name LIMIT 100`, [userId]),
      readProfileDetails(),
    ]);
    const byId = new Map(details.map(item => [item.restaurant_id,item]));
    return sqlRows(result).map((restaurant): Record<string,string | null> & {description:string;opening_hours:string | null;details_version:string} => {
      const saved = byId.get(restaurant.id);
      return {...restaurant,description:saved?.description ?? '',opening_hours:saved ? saved.opening_hours : restaurant.opening_hours,details_version:saved?.version ?? ''};
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_OWNERS_NOT_MIGRATED') return [];
    throw error;
  }
}
