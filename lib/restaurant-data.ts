import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { restaurantSchema } from '@/lib/restaurant-schema';
import { initialRestaurants, readMenuPhotos, type Restaurant, type SavedMenuItem } from '@/lib/store';

let preparation: Promise<void> | undefined;
// Used by intake/staff only. Public reads never migrate or publish records.
export async function prepareRestaurantDatabase() {
  if (!preparation) preparation = (async () => {
    for (const statement of restaurantSchema) await executePrivateSql(statement);
    const menuColumns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_menu_items)'));
    if (!menuColumns.some(column => column.name === 'availability')) {
      try { await executePrivateSql("ALTER TABLE restaurant_menu_items ADD COLUMN availability TEXT NOT NULL DEFAULT 'available' CHECK(availability IN ('available','unavailable'))"); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    const detailsColumns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_profile_details)'));
    for (const name of ['description_en','opening_hours_en']) {
      if (detailsColumns.some(column => column.name === name)) continue;
      try { await executePrivateSql(`ALTER TABLE restaurant_profile_details ADD COLUMN ${name} TEXT`); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
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
  const [listings, details] = await Promise.all([readListings(), readProfileDetails()]);
  const byId = new Map(details.map(item => [item.restaurant_id,item]));
  return sqlRows(listings).map(row => withProfileDetails(publicRestaurant(row), byId.get(row.id)));
}

export async function getRestaurantDirectory() {
  try { return { restaurants: [...await getPublishedRestaurants(), ...initialRestaurants], unavailable: false }; }
  catch { return { restaurants: initialRestaurants, unavailable: true }; }
}

export async function getPublishedRestaurant(id: string, language: 'pt' | 'en' = 'pt') {
  const [result, details] = await Promise.all([readListings(id), readProfileDetails(id)]);
  const row = sqlRows(result)[0];
  if (!row) return null;
  const restaurant = withProfileDetails(publicRestaurant(row),details[0],language);
  restaurant.menuItems = (await getSavedMenu(id, restaurant.status === 'verified')).map(item => ({ ...item, photo: item.photo && restaurant.menuPhotos.includes(item.photo) ? item.photo : null }));
  return restaurant;
}

export async function getSavedMenu(id: string, verified: boolean): Promise<SavedMenuItem[]> {
  const tail = `FROM restaurant_menu_items m JOIN restaurant_listings l ON l.id=m.restaurant_id
    WHERE m.restaurant_id=? ${verified ? '' : "AND m.category='mains'"} ORDER BY m.rowid LIMIT ${verified ? 60 : 2}`;
  const fields = 'm.id,m.name,m.category,m.price,m.photo,m.updated_at';
  try {
    let rows;
    try { rows = sqlRows(await executePrivateSql(`SELECT ${fields},m.availability ${tail}`,[id])); }
    catch (error) {
      if (!(error instanceof Error) || error.message !== 'TURSO_AVAILABILITY_NOT_MIGRATED') throw error;
      rows = sqlRows(await executePrivateSql(`SELECT ${fields} ${tail}`,[id]));
    }
    return rows.map(row => ({...row,availability:row.availability === 'unavailable' ? 'unavailable' : 'available'})) as unknown as SavedMenuItem[];
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_ITEMS_NOT_MIGRATED') return [];
    throw error;
  }
}

export async function readProfileDetails(id?: string) {
  const tail = `FROM restaurant_profile_details d JOIN restaurant_listings l ON l.id=d.restaurant_id ${id ? 'WHERE d.restaurant_id=?' : ''}`;
  const args = id ? [id] : [];
  try {
    try { return sqlRows(await executePrivateSql(`SELECT d.restaurant_id,d.description,d.opening_hours,d.description_en,d.opening_hours_en,d.version ${tail}`,args)); }
    catch (error) {
      if (!(error instanceof Error) || error.message !== 'TURSO_TRANSLATIONS_NOT_MIGRATED') throw error;
      return sqlRows(await executePrivateSql(`SELECT d.restaurant_id,d.description,d.opening_hours,d.version ${tail}`,args));
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_DETAILS_NOT_MIGRATED') return [];
    throw error;
  }
}
function withProfileDetails(restaurant: Restaurant, details?: Record<string,string | null>, language: 'pt' | 'en' = 'pt'): Restaurant {
  return details ? {...restaurant,
    description: (language === 'en' && details.description_en?.trim() ? details.description_en : details.description) ?? '',
    hours: (language === 'en' && details.opening_hours_en?.trim() ? details.opening_hours_en : details.opening_hours) ?? '',
  } : restaurant;
}
