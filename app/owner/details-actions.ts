'use server';
import { randomUUID } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { executePrivateSql } from '@/lib/turso';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export async function saveOwnerDetails(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const id = String(form.get('id') ?? '');
  const version = String(form.get('version') ?? '');
  const description = String(form.get('description') ?? '').trim();
  const hours = String(form.get('hours') ?? '').trim();
  const descriptionEn = form.has('descriptionEn') ? String(form.get('descriptionEn') ?? '').trim() : null;
  const hoursEn = form.has('hoursEn') ? String(form.get('hoursEn') ?? '').trim() : null;
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || version.length > 100 || description.length > 2000 || hours.length > 300 || (descriptionEn?.length ?? 0) > 2000 || (hoursEn?.length ?? 0) > 300) return 'invalid-details';
  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const access = `EXISTS (SELECT 1 FROM restaurant_owners o JOIN restaurant_listings l ON l.id=o.restaurant_id WHERE o.restaurant_id=? AND o.clerk_user_id=?)`;
    const values = [description,hours,descriptionEn,hoursEn,randomUUID(),new Date().toISOString(),userId];
    const changed = version
      ? await executePrivateSql(`UPDATE restaurant_profile_details SET description=?,opening_hours=?,description_en=COALESCE(?,description_en),opening_hours_en=COALESCE(?,opening_hours_en),version=?,updated_at=?,updated_by=?
          WHERE restaurant_id=? AND version=? AND ${access}`, [...values,id,version,id,userId])
      : await executePrivateSql(`INSERT INTO restaurant_profile_details (description,opening_hours,description_en,opening_hours_en,version,updated_at,updated_by,restaurant_id)
          SELECT ?,?,?,?,?,?,?,? WHERE ${access} AND NOT EXISTS (SELECT 1 FROM restaurant_profile_details WHERE restaurant_id=?)`, [...values,id,id,userId,id]);
    if (Number(changed.affected_row_count) === 1) result = 'details-saved';
  } catch { result = 'unavailable'; }
  revalidatePath('/en/account'); revalidatePath('/pt/conta'); revalidatePath('/staff/review');
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout'); revalidatePath('/findme');
  return result;
}
