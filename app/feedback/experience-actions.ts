'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { staffAuthorized } from '@/lib/staff-auth';
import { prepareRestaurantOrders } from '@/lib/restaurant-orders';
import { experienceCriteria } from '@/lib/experience-criteria';
import { executePrivateSql } from '@/lib/turso';

const orderIdPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;

export async function submitExperience(_previous: string, form: FormData) {
  const { userId } = await auth();
  if (!userId) return 'unavailable';
  const id = String(form.get('orderId') ?? '');
  const comment = String(form.get('comment') ?? '').trim();
  const ratings = Object.fromEntries(experienceCriteria.map(({key}) => [key, String(form.get(key) ?? '')]));
  const values = Object.values(ratings);
  if (!orderIdPattern.test(id) || comment.length > 2000 ||
      values.some(value => !/^(?:[1-5]|na)$/.test(value)) || values.every(value => value === 'na')) return 'invalid';
  try {
    await prepareRestaurantOrders();
    const result = await executePrivateSql(`INSERT INTO restaurant_experience_surveys (order_id,ratings,comment,submitted_at)
      SELECT id,?,?,? FROM restaurant_orders WHERE id=? AND customer_id=? AND status='completed'
      ON CONFLICT(order_id) DO NOTHING`, [JSON.stringify(ratings), comment, new Date().toISOString(), id, userId]);
    if (Number(result.affected_row_count) !== 1) return 'unavailable';
    for (const path of ['/en/account', '/pt/conta', '/staff/review']) revalidatePath(path);
    return 'sent';
  } catch { return 'unavailable'; }
}

export async function reviewExperience(_previous: string, form: FormData) {
  if (!(await staffAuthorized())) return 'unavailable';
  const id = String(form.get('orderId') ?? '');
  const expected = String(form.get('reviewedAt') ?? '');
  const analysis = String(form.get('analysis') ?? '').trim();
  const visit = String(form.get('visit') ?? '').trim();
  if (!orderIdPattern.test(id) || !analysis || analysis.length > 2000 || visit.length > 2000 ||
      (visit && form.get('visitPermission') !== 'on')) return 'invalid';
  try {
    await prepareRestaurantOrders();
    const result = await executePrivateSql(`UPDATE restaurant_experience_surveys SET analysis=?,visit_analysis=?,reviewed_at=?
      WHERE order_id=? AND COALESCE(reviewed_at,'')=?`, [analysis, visit || null, new Date().toISOString(), id, expected]);
    if (Number(result.affected_row_count) !== 1) return 'unavailable';
    revalidatePath('/staff/review');
    return 'saved';
  } catch { return 'unavailable'; }
}
