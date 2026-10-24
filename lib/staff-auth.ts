import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const STAFF_COOKIE = 'angolalab_staff_review';
const MAX_AGE = 60 * 60 * 8;

function secret() {
  const value = process.env.STAFF_REVIEW_PASSWORD;
  return value && value.length >= 16 ? value : null;
}

function signature(timestamp: string, password: string) {
  return createHmac('sha256', password).update('staff-review-v1:' + timestamp).digest('hex');
}

export function validPassword(input: string) {
  const password = secret();
  if (!password || input.length !== password.length) return false;
  return timingSafeEqual(Buffer.from(input), Buffer.from(password));
}

export function makeSession() {
  const password = secret();
  if (!password) throw new Error('STAFF_NOT_CONFIGURED');
  const timestamp = String(Math.floor(Date.now() / 1000));
  return timestamp + '.' + signature(timestamp, password);
}

export async function staffAuthorized() {
  const password = secret();
  if (!password) return false;
  const value = (await cookies()).get(STAFF_COOKIE)?.value ?? '';
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(value);
  if (!match) return false;
  const issued = Number(match[1]);
  const now = Math.floor(Date.now() / 1000);
  if (issued > now || now - issued > MAX_AGE) return false;
  const expected = Buffer.from(signature(match[1], password), 'hex');
  const received = Buffer.from(match[2], 'hex');
  return timingSafeEqual(expected, received);
}
