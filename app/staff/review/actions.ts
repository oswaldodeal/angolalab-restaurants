'use server';

import { photoUpload } from '@/lib/photo-upload';
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
    || form.get('verifiedConsent') !== 'on' || form.get('verificationIntent') !== 'verified') {
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
      AND NOT EXISTS (SELECT 1 FROM restaurant_verified_contacts v WHERE v.id = l.id AND v.is_active=1)
      ON CONFLICT(id) DO UPDATE SET public_address=excluded.public_address,public_phone=excluded.public_phone,note=excluded.note,reviewer=excluded.reviewer,verified_at=excluded.verified_at,is_active=1 WHERE restaurant_verified_contacts.is_active=0`,
    [address, phone, note, 'shared-pilot-staff', new Date().toISOString(), id]);
    if (Number(updated.affected_row_count) !== 1) result = 'stale';
  } catch { result = 'unavailable'; }
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  redirect('/staff/review?result=' + result);
}

async function uploadedPhoto(form: FormData, invalidResult: string) {
  try { return await photoUpload(form); }
  catch { redirect('/staff/review?result=' + invalidResult); }
}

export async function enableProPlan(form: FormData) {
  return saveProfileCover(form, 'pro');
}

export async function saveCoverPhoto(form: FormData) {
  return saveProfileCover(form, null);
}

async function saveProfileCover(form: FormData, requestedTier: string | null) {
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
    const updated = await executePrivateSql(`INSERT INTO restaurant_pro_plans (id,activated_at,cover_photo_url,profile_tier)
      SELECT v.id,?,?,COALESCE(?,'verified') FROM restaurant_verified_contacts v
      JOIN restaurant_listings l ON l.id = v.id
      JOIN restaurant_intake i ON i.id = v.id
      WHERE v.id = ? AND v.is_active=1 AND i.status = 'approved' ON CONFLICT(id) DO UPDATE SET profile_tier = COALESCE(?,restaurant_pro_plans.profile_tier), cover_photo_url = COALESCE(excluded.cover_photo_url,restaurant_pro_plans.cover_photo_url),
      menu_photo_url = COALESCE(restaurant_pro_plans.menu_photo_url,
        CASE WHEN restaurant_pro_plans.cover_photo_url = ? THEN ? END)
      WHERE excluded.cover_photo_url IS NOT NULL OR ? IS NOT NULL`,
    [new Date().toISOString(), coverPhotoUrl || null, requestedTier, id, requestedTier, SAMPLE_RESTAURANT_COVER, SAMPLE_MENU_PHOTO, requestedTier]);
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
    await executePrivateSql(`INSERT INTO restaurant_pro_plans(id,activated_at,profile_tier) SELECT v.id,?,'verified' FROM restaurant_verified_contacts v JOIN restaurant_listings l ON l.id=v.id WHERE v.id=? AND v.is_active=1 ON CONFLICT(id) DO NOTHING`,[new Date().toISOString(),id]);
    const [row] = sqlRows(await executePrivateSql(
      'SELECT menu_photo_url,cover_photo_url FROM restaurant_pro_plans WHERE id = ? AND EXISTS(SELECT 1 FROM restaurant_verified_contacts v WHERE v.id=restaurant_pro_plans.id AND v.is_active=1)', [id],
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
          WHERE id = ? AND menu_photo_url IS ? AND (menu_photo_url IS NOT NULL OR cover_photo_url IS ?) AND EXISTS(SELECT 1 FROM restaurant_verified_contacts v WHERE v.id=restaurant_pro_plans.id AND v.is_active=1)`,
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

export async function setProfileTier(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id=String(form.get('id')??''), tier=String(form.get('tier')??''), expected=String(form.get('expectedTier')??'');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !['verified','pro'].includes(tier) || !['none','verified','pro'].includes(expected) || form.get('confirmed')!=='on') redirect('/staff/review?result=invalid-tier');
  let result='stale';
  try {
    await prepareRestaurantDatabase();
    const changed=await executePrivateSql(`INSERT INTO restaurant_pro_plans(id,activated_at,profile_tier)
      SELECT v.id,?,? FROM restaurant_verified_contacts v JOIN restaurant_listings l ON l.id=v.id
      WHERE v.id=? AND v.is_active=1 AND COALESCE((SELECT p.profile_tier FROM restaurant_pro_plans p WHERE p.id=v.id),'none')=?
      ON CONFLICT(id) DO UPDATE SET profile_tier=excluded.profile_tier`,[new Date().toISOString(),tier,id,expected]);
    if (Number(changed.affected_row_count)===1) result='tier-saved';
  } catch {result='unavailable';}
  for (const path of ['/staff/review','/en/account','/pt/conta','/findme']) revalidatePath(path);
  revalidatePath('/en/restaurants','layout'); revalidatePath('/pt/restaurantes','layout');
  redirect('/staff/review?result='+result);
}

export async function returnToBasic(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id=String(form.get('id')??''), expected=String(form.get('expectedVerifiedAt')??'');
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !expected || expected.length>100 || form.get('confirmed')!=='on') redirect('/staff/review?result=invalid-basic');
  let result='stale';
  try {
    await prepareRestaurantDatabase();
    const changed=await executePrivateSql(`UPDATE restaurant_verified_contacts SET is_active=0 WHERE id=? AND verified_at=? AND is_active=1 AND EXISTS(SELECT 1 FROM restaurant_listings l WHERE l.id=restaurant_verified_contacts.id)`,[id,expected]);
    if(Number(changed.affected_row_count)===1) result='basic-restored';
  } catch { result='unavailable'; }
  for(const path of ['/staff/review','/en/account','/pt/conta','/findme']) revalidatePath(path);
  revalidatePath('/en/restaurants','layout');revalidatePath('/pt/restaurantes','layout');
  redirect('/staff/review?result='+result);
}
