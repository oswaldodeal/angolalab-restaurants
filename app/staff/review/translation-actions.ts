'use server';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { staffAuthorized } from '@/lib/staff-auth';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { executePrivateSql } from '@/lib/turso';

export async function saveReviewedTranslation(_previous: string, form: FormData): Promise<string> {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  const version = String(form.get('version') ?? '');
  const descriptionEn = String(form.get('descriptionEn') ?? '').trim();
  const hoursEn = String(form.get('hoursEn') ?? '').trim();
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || version.length > 100 || descriptionEn.length > 2000 || hoursEn.length > 300 || form.get('reviewed') !== 'on') return 'invalid-translation';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const values = [descriptionEn,hoursEn,randomUUID(),new Date().toISOString(),'shared-pilot-staff'];
    const changed = version
      ? await executePrivateSql(`UPDATE restaurant_profile_details SET description_en=?,opening_hours_en=?,version=?,updated_at=?,updated_by=?
          WHERE restaurant_id=? AND version=? AND EXISTS (SELECT 1 FROM restaurant_listings WHERE id=?)`,[...values,id,version,id])
      : await executePrivateSql(`INSERT INTO restaurant_profile_details (restaurant_id,description,opening_hours,description_en,opening_hours_en,version,updated_at,updated_by)
          SELECT l.id,'',COALESCE(l.opening_hours,''),?,?,?,?,? FROM restaurant_listings l WHERE l.id=?
          AND NOT EXISTS (SELECT 1 FROM restaurant_profile_details d WHERE d.restaurant_id=l.id)`,[...values,id]);
    if (Number(changed.affected_row_count) === 1) result = 'translation-saved';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review'); revalidatePath('/en/account'); revalidatePath('/pt/conta');
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout'); revalidatePath('/findme');
  return result;
}
