import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { restaurantSchema } from '@/lib/restaurant-schema';
import { initialRestaurants, type Restaurant } from '@/lib/store';

let preparation: Promise<void> | undefined;
// Used by intake/staff only. Public reads never migrate or publish records.
export async function prepareRestaurantDatabase() {
  if (!preparation) preparation = (async () => {
    for (const statement of restaurantSchema) await executePrivateSql(statement);
  })().catch(error => { preparation = undefined; throw error; });
  return preparation;
}

export function publicRestaurant(row: Record<string, string | null>): Restaurant {
  // Explicit allowlist: no owner data, address, telephone, or coordinates cross this boundary.
  return {
    id: row.id!, ownerId: 'staff-reviewed', name: row.name!, country: row.country!,
    city: row.city!, cuisine: row.cuisine!, neighbourhood: '', address: '',
    lat: null, lng: null, hours: row.opening_hours ?? undefined,
    status: 'basic', profilePlan: 'basic', submittedAt: row.published_at!,
    photos: [], menuPhotos: [], isPremium: false,
  };
}

export async function getPublishedRestaurants(): Promise<Restaurant[]> {
  const result = await executePrivateSql(
    'SELECT id,name,country,city,cuisine,opening_hours,published_at FROM restaurant_listings ORDER BY published_at DESC'
  );
  return sqlRows(result).map(publicRestaurant);
}

export async function getRestaurantDirectory() {
  try { return { restaurants: [...await getPublishedRestaurants(), ...initialRestaurants], unavailable: false }; }
  catch { return { restaurants: initialRestaurants, unavailable: true }; }
}

export async function getPublishedRestaurant(id: string) {
  const result = await executePrivateSql(
    'SELECT id,name,country,city,cuisine,opening_hours,published_at FROM restaurant_listings WHERE id = ?', [id]
  );
  const row = sqlRows(result)[0];
  return row ? publicRestaurant(row) : null;
}
