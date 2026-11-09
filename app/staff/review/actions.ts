'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { staffAuthorized, STAFF_COOKIE } from '@/lib/staff-auth';
import { executePrivateSql } from '@/lib/turso';
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
