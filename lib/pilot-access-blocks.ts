import 'server-only';
import { currentUser } from '@clerk/nextjs/server';
import { executePrivateSql, sqlRows } from '@/lib/turso';

export function normalizeContact(kind: string, input: string) {
  const value = input.trim();
  if (kind === 'phone') {
    const phone = value.replace(/[\s().-]/g, '');
    return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
  }
  return kind === 'email' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? value.toLowerCase() : null;
}

export async function preparePilotAccessBlocks() {
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS pilot_access_blocks (
    contact TEXT PRIMARY KEY NOT NULL, blocked INTEGER NOT NULL CHECK(blocked IN (0,1)),
    reason TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);
}

export async function verifiedContactKeys(userId: string) {
  const user = await currentUser();
  if (user?.id !== userId) throw new Error('PILOT_IDENTITY_UNAVAILABLE');
  const contacts = [
    ...user.phoneNumbers.map(entry => ({ kind: 'phone', value: entry.phoneNumber, verification: entry.verification })),
    ...user.emailAddresses.map(entry => ({ kind: 'email', value: entry.emailAddress, verification: entry.verification })),
  ];
  const keys = contacts.flatMap(({kind, value, verification}) => {
    const normalized = verification?.status === 'verified' && normalizeContact(kind, value);
    return normalized ? [normalized] : [];
  });
  await preparePilotAccessBlocks();
  return JSON.stringify(keys);
}

// Use the same check inside protected writes so a concurrent block takes effect immediately.
export const pilotContactBlocked = `EXISTS (
  SELECT 1 FROM pilot_access_blocks WHERE blocked=1 AND contact IN (SELECT value FROM json_each(?))
)`;

export async function isPilotContactBlocked(keys: string) {
  return sqlRows(await executePrivateSql(`SELECT ${pilotContactBlocked} AS blocked`, [keys]))[0]?.blocked === '1';
}
