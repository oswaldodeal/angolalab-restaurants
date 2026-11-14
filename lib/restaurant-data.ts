import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { restaurantSchema } from '@/lib/restaurant-schema';
import { initialRestaurants, readMenuPhotos, type Restaurant } from '@/lib/store';

let preparation: Promise<void> | undefined;
// Used by intake/staff only. Public reads never migrate or publish records.
export async function prepareRestaurantDatabase() {
  if (!preparation) preparation = (async () => {
    for (const statement of restaurantSchema) await executePrivateSql(statement);
    const columns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_pro_plans)'));
    for (const name of ['cover_photo_url', 'menu_photo_url']) {
      if (columns.some(column => column.name === name)) continue;
      try {
        await executePrivateSql(`ALTER TABLE restaurant_pro_plans ADD COLUMN ${name} TEXT`);
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error;
      }
    }
  })().catch(error => { preparation = undefined; throw error; });
  return preparation;
}

export function publicRestaurant(row: Record<string, string | null>): Restaurant {
  // Only separately approved business contact fields can cross this boundary.
  const verified = Boolean(row.verified_at && row.public_address && row.public_phone);
  return {
    id: row.id!, ownerId: 'staff-reviewed', name: row.name!, country: row.country!,
    city: row.city!, cuisine: row.cuisine!, neighbourhood: '', address: verified ? row.public_address! : '',
    phone: verified ? row.public_phone! : undefined,
    lat: null, lng: null, hours: row.opening_hours ?? undefined,
    status: verified ? 'verified' : 'basic', profilePlan: verified ? (row.pro_id ? 'pro' : 'verified') : 'basic',
    verifiedAt: verified ? row.verified_at! : undefined, submittedAt: row.published_at!,
    photos: verified && row.pro_id && row.cover_photo_url ? [row.cover_photo_url] : [], menuPhotos: verified && row.pro_id ? readMenuPhotos(row.menu_photo_url, row.cover_photo_url) : [], isPremium: false,
  };
}

async function readListings(id?: string) {
  const columns = 'l.id,l.name,l.country,l.city,l.cuisine,l.opening_hours,l.published_at';
  const tail = id === undefined ? 'ORDER BY l.published_at DESC' : 'WHERE l.id = ?';
  const args = id === undefined ? [] : [id];
  const verifiedListings = `FROM restaurant_listings l LEFT JOIN restaurant_verified_contacts v ON v.id = l.id`;
  const verifiedColumns = `${columns},v.public_address,v.public_phone,v.verified_at`;
  try {
    try {
      const proListings = `${verifiedListings} LEFT JOIN restaurant_pro_plans p ON p.id = v.id ${tail}`;
      try {
        return await executePrivateSql(`SELECT ${verifiedColumns},p.id AS pro_id,p.cover_photo_url,p.menu_photo_url ${proListings}`, args);
      } catch (error) {
        if (error instanceof Error && error.message === 'TURSO_MENU_NOT_MIGRATED') {
          return await executePrivateSql(`SELECT ${verifiedColumns},p.id AS pro_id,p.cover_photo_url ${proListings}`, args);
        }
        if (!(error instanceof Error) || error.message !== 'TURSO_COVER_NOT_MIGRATED') throw error;
        return await executePrivateSql(`SELECT ${verifiedColumns},p.id AS pro_id ${proListings}`, args);
      }
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'TURSO_PRO_PLANS_NOT_MIGRATED') throw error;
      return await executePrivateSql(`SELECT ${verifiedColumns} ${verifiedListings} ${tail}`, args);
    }
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'TURSO_VERIFIED_CONTACTS_NOT_MIGRATED') throw error;
    return executePrivateSql(`SELECT ${columns} FROM restaurant_listings l ${tail}`, args);
  }
}

export async function getPublishedRestaurants(): Promise<Restaurant[]> {
  return sqlRows(await readListings()).map(publicRestaurant);
}

export async function getRestaurantDirectory() {
  try { return { restaurants: [...await getPublishedRestaurants(), ...initialRestaurants], unavailable: false }; }
  catch { return { restaurants: initialRestaurants, unavailable: true }; }
}

export async function getPublishedRestaurant(id: string) {
  const result = await readListings(id);
  const row = sqlRows(result)[0];
  return row ? publicRestaurant(row) : null;
}
