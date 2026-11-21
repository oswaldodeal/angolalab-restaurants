import { readRestaurantMedia, withRestaurantMedia } from '@/lib/restaurant-media';
import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { restaurantSchema } from '@/lib/restaurant-schema';
import { initialRestaurants, readMenuPhotos, type Restaurant, type SavedMenuItem } from '@/lib/store';

let preparation: Promise<void> | undefined;
// Used by intake and authenticated staff/owner flows. Public listing reads never migrate or publish records.
export async function prepareRestaurantDatabase() {
  if (!preparation) preparation = (async () => {
    for (const statement of restaurantSchema) await executePrivateSql(statement);
    const verificationColumns=sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_verified_contacts)'));
    if (!verificationColumns.some(column=>column.name==='is_active')) {
      try { await executePrivateSql('ALTER TABLE restaurant_verified_contacts ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1))'); }
      catch(error) { if (!(error instanceof Error) || error.message!=='TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    const menuColumns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_menu_items)'));
    if (!menuColumns.some(column => column.name === 'availability')) {
      try { await executePrivateSql("ALTER TABLE restaurant_menu_items ADD COLUMN availability TEXT NOT NULL DEFAULT 'available' CHECK(availability IN ('available','unavailable'))"); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    if (!menuColumns.some(column => column.name === 'name_en')) {
      try { await executePrivateSql('ALTER TABLE restaurant_menu_items ADD COLUMN name_en TEXT'); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    const detailsColumns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_profile_details)'));
    for (const name of ['description_en','opening_hours_en']) {
      if (detailsColumns.some(column => column.name === name)) continue;
      try { await executePrivateSql(`ALTER TABLE restaurant_profile_details ADD COLUMN ${name} TEXT`); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    const columns = sqlRows(await executePrivateSql('PRAGMA table_info(restaurant_pro_plans)'));
    if (!columns.some(column => column.name === 'profile_tier')) {
      try { await executePrivateSql("ALTER TABLE restaurant_pro_plans ADD COLUMN profile_tier TEXT NOT NULL DEFAULT 'pro' CHECK(profile_tier IN ('verified','pro'))"); }
      catch (error) { if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error; }
    }
    await executePrivateSql(`CREATE TRIGGER IF NOT EXISTS restaurant_audit_profile_tier AFTER UPDATE OF profile_tier ON restaurant_pro_plans WHEN OLD.profile_tier<>NEW.profile_tier BEGIN INSERT INTO restaurant_review_history(submission_id,from_status,to_status,note,reviewer,reviewed_at) VALUES(NEW.id,OLD.profile_tier,NEW.profile_tier,'Staff changed website profile tier; business verification unchanged','shared-pilot-staff',strftime('%Y-%m-%dT%H:%M:%fZ','now')); END`);

    await executePrivateSql(`CREATE TRIGGER IF NOT EXISTS restaurant_pause_verification AFTER UPDATE OF is_active ON restaurant_verified_contacts WHEN OLD.is_active=1 AND NEW.is_active=0 BEGIN
      UPDATE restaurant_pro_plans SET profile_tier='verified' WHERE id=NEW.id;
      INSERT INTO restaurant_review_history(submission_id,from_status,to_status,note,reviewer,reviewed_at) VALUES(NEW.id,'verified','basic',json_object('reason','Staff returned listing to Basic; verification evidence and media retained privately','previous_verified_at',OLD.verified_at,'evidence',OLD.note),'shared-pilot-staff',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
    END`);
    await executePrivateSql(`CREATE TRIGGER IF NOT EXISTS restaurant_resume_verification AFTER UPDATE OF is_active ON restaurant_verified_contacts WHEN OLD.is_active=0 AND NEW.is_active=1 BEGIN INSERT INTO restaurant_review_history(submission_id,from_status,to_status,note,reviewer,reviewed_at) VALUES(NEW.id,'basic','verified',NEW.note,NEW.reviewer,NEW.verified_at); END`);
    for (const name of ['cover_photo_url', 'menu_photo_url']) {
      if (columns.some(column => column.name === name)) continue;
      try {
        await executePrivateSql(`ALTER TABLE restaurant_pro_plans ADD COLUMN ${name} TEXT`);
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'TURSO_COVER_ALREADY_MIGRATED') throw error;
      }
    }
    // Backfill legacy photo references once per listing. Existing media rows, including removals, win.
    await executePrivateSql(`INSERT OR IGNORE INTO restaurant_profile_media(id,cover_photo_url,menu_photo_url)
      SELECT p.id,p.cover_photo_url,COALESCE(p.menu_photo_url,CASE WHEN p.cover_photo_url='/demo/luanda-restaurant-cover.webp' THEN json_array('/demo/grilled-fish-with-funge.webp') ELSE '[]' END)
      FROM restaurant_pro_plans p JOIN restaurant_listings l ON l.id=p.id WHERE p.cover_photo_url IS NOT NULL OR p.menu_photo_url IS NOT NULL`);
  })().catch(error => { preparation = undefined; throw error; });
  return preparation;
}

export function publicRestaurant(row: Record<string, string | null>): Restaurant {
  // Only separately approved business contact fields can cross this boundary.
  const verified = Boolean(row.verification_active !== '0' && row.verified_at && row.public_address && row.public_phone);
  return {
    id: row.id!, ownerId: 'staff-reviewed', name: row.name!, country: row.country!,
    city: row.city!, cuisine: row.cuisine!, neighbourhood: '', address: verified ? row.public_address! : '',
    phone: verified ? row.public_phone! : undefined,
    lat: null, lng: null, hours: row.opening_hours ?? undefined,
    status: verified ? 'verified' : 'basic', profilePlan: verified ? (row.pro_id && row.profile_tier !== 'verified' ? 'pro' : 'verified') : 'basic',
    verifiedAt: verified ? row.verified_at! : undefined, submittedAt: row.published_at!,
    photos: verified && row.pro_id && row.cover_photo_url ? [row.cover_photo_url] : [], menuPhotos: verified && row.pro_id ? readMenuPhotos(row.menu_photo_url, row.cover_photo_url) : [], isPremium: false,
  };
}

async function readListings(id?: string, legacyActive = false): Promise<import('@/lib/turso').SqlResult> {
  const columns = 'l.id,l.name,l.country,l.city,l.cuisine,l.opening_hours,l.published_at';
  const tail = id === undefined ? 'ORDER BY l.published_at DESC' : 'WHERE l.id = ?';
  const args = id === undefined ? [] : [id];
  const verifiedListings = `FROM restaurant_listings l LEFT JOIN restaurant_verified_contacts v ON v.id = l.id`;
  const verifiedColumns = `${columns},v.public_address,v.public_phone,v.verified_at${legacyActive ? '' : ',v.is_active AS verification_active'}`;
  try {
    try {
      const proListings = `${verifiedListings} LEFT JOIN restaurant_pro_plans p ON p.id = v.id ${tail}`;
      try {
        try {
          return await executePrivateSql(`SELECT ${verifiedColumns},p.id AS pro_id,p.profile_tier,p.cover_photo_url,p.menu_photo_url ${proListings}`, args);
        } catch (error) {
          if (!(error instanceof Error) || error.message !== 'TURSO_PLAN_NOT_MIGRATED') throw error;
          return await executePrivateSql(`SELECT ${verifiedColumns},p.id AS pro_id,p.cover_photo_url,p.menu_photo_url ${proListings}`, args);
        }
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
    if (error instanceof Error && error.message === 'TURSO_VERIFICATION_ACTIVE_NOT_MIGRATED' && !legacyActive) return readListings(id,true);
    if (!(error instanceof Error) || error.message !== 'TURSO_VERIFIED_CONTACTS_NOT_MIGRATED') throw error;
    return executePrivateSql(`SELECT ${columns} FROM restaurant_listings l ${tail}`, args);
  }
}

export async function getPublishedRestaurants(): Promise<Restaurant[]> {
  const [listings, details, logos, media] = await Promise.all([readListings(), readProfileDetails(), readRestaurantLogos(), readRestaurantMedia()]);
  const mediaById = new Map(media.map(item=>[item.id,item]));
  const byId = new Map(details.map(item => [item.restaurant_id,item]));
  const logoById = new Map(logos.map(item => [item.restaurant_id,item.photo_url]));
  return sqlRows(listings).map(row => ({...withRestaurantMedia(withProfileDetails(publicRestaurant(row), byId.get(row.id)),mediaById.get(row.id)),logoUrl:logoById.get(row.id) ?? undefined}));
}

export async function getRestaurantDirectory() {
  try { return { restaurants: [...await getPublishedRestaurants(), ...initialRestaurants], unavailable: false }; }
  catch { return { restaurants: initialRestaurants, unavailable: true }; }
}

export async function getPublishedRestaurant(id: string, language: 'pt' | 'en' = 'pt') {
  const [result, details, logos, media] = await Promise.all([readListings(id), readProfileDetails(id), readRestaurantLogos(id), readRestaurantMedia(id)]);
  const row = sqlRows(result)[0];
  if (!row) return null;
  const restaurant = withRestaurantMedia(withProfileDetails(publicRestaurant(row),details[0],language),media[0]);
  restaurant.logoUrl = logos[0]?.photo_url ?? undefined;
  restaurant.menuItems = (await getSavedMenu(id, restaurant.status === 'verified')).map(item => ({ ...item, photo: item.photo && restaurant.menuPhotos.includes(item.photo) ? item.photo : null }));
  return restaurant;
}

export async function getSavedMenu(id: string, verified: boolean): Promise<SavedMenuItem[]> {
  const tail = `FROM restaurant_menu_items m JOIN restaurant_listings l ON l.id=m.restaurant_id
    WHERE m.restaurant_id=? ${verified ? '' : "AND m.category IN ('mains','drinks')"} ORDER BY m.rowid LIMIT ${verified ? 60 : 2}`;
  const fields = 'm.id,m.name,m.category,m.price,m.photo,m.updated_at';
  try {
    let rows;
    try { rows = sqlRows(await executePrivateSql(`SELECT ${fields},m.availability,m.name_en ${tail}`,[id])); }
    catch (error) {
      if (error instanceof Error && error.message === 'TURSO_MENU_NAMES_NOT_MIGRATED') {
        try { rows = sqlRows(await executePrivateSql(`SELECT ${fields},m.availability ${tail}`,[id])); }
        catch (legacyError) {
          if (!(legacyError instanceof Error) || legacyError.message !== 'TURSO_AVAILABILITY_NOT_MIGRATED') throw legacyError;
          rows = sqlRows(await executePrivateSql(`SELECT ${fields} ${tail}`,[id]));
        }
      } else {
        if (!(error instanceof Error) || error.message !== 'TURSO_AVAILABILITY_NOT_MIGRATED') throw error;
        rows = sqlRows(await executePrivateSql(`SELECT ${fields} ${tail}`,[id]));
      }
    }
    const references = rows.length ? await readMenuReferences(id) : [];
    const byItemId = new Map(references.map(reference => [reference.item_id,reference.number]));
    return rows.map(row => ({...row,referenceCode:byItemId.get(row.id) ? `AL-${byItemId.get(row.id)!.padStart(6,'0')}` : undefined,nameEn:row.name_en ?? '',availability:row.availability === 'unavailable' ? 'unavailable' : 'available'})) as unknown as SavedMenuItem[];
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

export async function readRestaurantLogos(id?: string) {
  try {
    return sqlRows(await executePrivateSql(`SELECT g.restaurant_id,g.photo_url FROM restaurant_logos g
      JOIN restaurant_listings l ON l.id=g.restaurant_id ${id ? 'WHERE g.restaurant_id=?' : ''}`,id ? [id] : []));
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_LOGOS_NOT_MIGRATED') return [];
    throw error;
  }
}

async function readMenuReferences(id: string) {
  try {
    return sqlRows(await executePrivateSql(`SELECT r.item_id,r.number FROM restaurant_menu_references r
      JOIN restaurant_menu_items m ON m.id=r.item_id JOIN restaurant_listings l ON l.id=m.restaurant_id WHERE l.id=?`,[id]));
  } catch (error) {
    if (error instanceof Error && error.message === 'TURSO_REFERENCES_NOT_MIGRATED') return [];
    throw error;
  }
}
