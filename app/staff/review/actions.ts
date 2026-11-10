'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { staffAuthorized, STAFF_COOKIE } from '@/lib/staff-auth';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { MENU_PHOTO_LIMIT, readMenuPhotos, SAMPLE_MENU_PHOTO, SAMPLE_RESTAURANT_COVER } from '@/lib/store';
import { prepareRestaurantDatabase } from '@/lib/restaurant-data';

export async function reviewRestaurant(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  const decision = String(form.get('decision') ?? '');
  const note = String(form.get('note') ?? '').trim();
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !['approved','rejected','withdrawn'].includes(decision)
    || note.length < 20 || note.length > 2000
    || (decision === 'approved' && form.get('publicationConsent') !== 'on')) {
    redirect('/staff/review?result=invalid');
  }
  let result = 'saved';
  try {
    await prepareRestaurantDatabase();
    // One SQLite statement: triggers publish/remove + audit atomically. A repeated review is a no-op.
    const updated = await executePrivateSql(`UPDATE restaurant_intake
      SET status=?,review_note=?,reviewed_by=?,reviewed_at=? WHERE id=? AND status=?`,
      [decision, note, 'shared-pilot-staff', new Date().toISOString(), id,
        decision === 'withdrawn' ? 'approved' : 'pending']);
    if (Number(updated.affected_row_count) !== 1) result = 'stale';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}

export async function signOutStaff() {
  (await cookies()).set(STAFF_COOKIE, '', { path: '/staff', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0 });
  redirect('/staff/review/login');
}

export async function publishVerifiedContacts(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  const address = String(form.get('publicAddress') ?? '').trim();
  const phone = String(form.get('publicPhone') ?? '').trim();
  const note = String(form.get('evidenceNote') ?? '').trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)
    || address.length < 5 || address.length > 300
    || !/^\+?[\d() .-]+$/.test(phone) || phone.length > 35 || digits.length < 7 || digits.length > 15
    || note.length < 20 || note.length > 2000
    || form.get('verifiedConsent') !== 'on') {
    redirect('/staff/review?result=invalid-verification');
  }
  let result = 'verified';
  try {
    await prepareRestaurantDatabase();
    const updated = await executePrivateSql(`INSERT INTO restaurant_verified_contacts
      (id,public_address,public_phone,note,reviewer,verified_at)
      SELECT l.id,?,?,?,?,? FROM restaurant_listings l
      JOIN restaurant_intake i ON i.id = l.id
      WHERE l.id = ? AND i.status = 'approved'
      AND NOT EXISTS (SELECT 1 FROM restaurant_verified_contacts v WHERE v.id = l.id)`,
    [address, phone, note, 'shared-pilot-staff', new Date().toISOString(), id]);
    if (Number(updated.affected_row_count) !== 1) result = 'stale';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}

async function uploadedPhoto(form: FormData, invalidResult: string) {
  const file = form.get('photoFile');
  if (typeof file !== 'object' || !file || !file.size) return '';
  if (file.size > 250 * 1024) redirect('/staff/review?result=' + invalidResult);
  const bytes = Buffer.from(await file.arrayBuffer());
  const jpeg = file.type === 'image/jpeg' && bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  const png = file.type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = file.type === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (!jpeg && !png && !webp) redirect('/staff/review?result=' + invalidResult);
  return `data:${file.type};base64,${bytes.toString('base64')}`;
}

export async function enableProPlan(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)) redirect('/staff/review?result=invalid');
  const upload = form.get('sampleCover') === 'yes' ? '' : await uploadedPhoto(form, 'invalid-upload');
  const coverPhotoUrl = upload || (form.get('sampleCover') === 'yes' ? SAMPLE_RESTAURANT_COVER : String(form.get('coverPhotoUrl') ?? '').trim());
  if (!upload && coverPhotoUrl && coverPhotoUrl !== SAMPLE_RESTAURANT_COVER) {
    try {
      const url = new URL(coverPhotoUrl);
      if (url.protocol !== 'https:' || url.username || url.password || coverPhotoUrl.length > 2000) throw new Error();
    } catch {
      redirect('/staff/review?result=invalid-cover');
    }
  }
  let result = 'saved';
  try {
    await prepareRestaurantDatabase();
    const updated = await executePrivateSql(`INSERT INTO restaurant_pro_plans (id,activated_at,cover_photo_url)
      SELECT v.id,?,? FROM restaurant_verified_contacts v
      JOIN restaurant_listings l ON l.id = v.id
      JOIN restaurant_intake i ON i.id = v.id
      WHERE v.id = ? AND i.status = 'approved' ON CONFLICT(id) DO UPDATE SET cover_photo_url = excluded.cover_photo_url,
      menu_photo_url = COALESCE(restaurant_pro_plans.menu_photo_url,
        CASE WHEN restaurant_pro_plans.cover_photo_url = ? THEN ? END)
      WHERE excluded.cover_photo_url IS NOT NULL`,
    [new Date().toISOString(), coverPhotoUrl || null, id, SAMPLE_RESTAURANT_COVER, SAMPLE_MENU_PHOTO]);
    if (Number(updated.affected_row_count) !== 1) result = 'stale';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}

export async function removeCoverPhoto(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  const expectedCover = String(form.get('expectedCover') ?? '');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !expectedCover || expectedCover.length > 350000) {
    redirect('/staff/review?result=stale');
  }

  let result = 'cover-removed';
  try {
    await prepareRestaurantDatabase();
    const updated = await executePrivateSql(
      `UPDATE restaurant_pro_plans SET cover_photo_url = NULL,
        menu_photo_url = COALESCE(menu_photo_url, CASE WHEN cover_photo_url = ? THEN ? END)
        WHERE id = ? AND cover_photo_url = ?`,
      [SAMPLE_RESTAURANT_COVER, SAMPLE_MENU_PHOTO, id, expectedCover],
    );
    if (Number(updated.affected_row_count) !== 1) result = 'stale';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}

export async function updateMenuPhoto(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = String(form.get('id') ?? '');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)) redirect('/staff/review?result=stale');

  const expected = String(form.get('expectedMenu') ?? '');
  const remove = form.get('removeMenu') === 'yes';
  const photo = remove ? '' : form.get('sampleMenu') === 'yes' ? SAMPLE_MENU_PHOTO : await uploadedPhoto(form, 'invalid-upload');
  if ((!remove && !photo) || expected.length > 350000) redirect('/staff/review?result=invalid-upload');

  let result = 'stale';
  try {
    await prepareRestaurantDatabase();
    const [row] = sqlRows(await executePrivateSql(
      'SELECT menu_photo_url,cover_photo_url FROM restaurant_pro_plans WHERE id = ?', [id],
    ));
    if (row) {
      const photos = readMenuPhotos(row.menu_photo_url, row.cover_photo_url);
      if (!remove && photos.includes(photo)) {
        result = 'menu-duplicate';
      } else if (!remove && photos.length >= MENU_PHOTO_LIMIT) {
        result = 'menu-limit';
      } else if (!remove || photos.includes(expected)) {
        const next = remove ? photos.filter(item => item !== expected) : [...photos, photo];
        const updated = await executePrivateSql(`UPDATE restaurant_pro_plans SET menu_photo_url = ?
          WHERE id = ? AND menu_photo_url IS ? AND (menu_photo_url IS NOT NULL OR cover_photo_url IS ?)`,
        [JSON.stringify(next), id, row.menu_photo_url, row.cover_photo_url]);
        if (Number(updated.affected_row_count) === 1) result = remove ? 'menu-removed' : 'menu-saved';
      }
    }
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}
