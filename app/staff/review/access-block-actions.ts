'use server';

import { revalidatePath } from 'next/cache';
import { normalizeContact, preparePilotAccessBlocks } from '@/lib/pilot-access-blocks';
import { staffAuthorized } from '@/lib/staff-auth';
import { executePrivateSql } from '@/lib/turso';

export async function changePilotAccessBlock(_previous: string, form: FormData) {
  if (!(await staffAuthorized())) return 'unauthorized';
  const contact = normalizeContact(String(form.get('kind') ?? ''), String(form.get('contact') ?? ''));
  const decision = form.get('decision');
  const reason = String(form.get('reason') ?? '').trim();
  if (!contact || (decision !== 'block' && decision !== 'unblock') || !reason || reason.length > 1000) return 'invalid';
  try {
    await preparePilotAccessBlocks();
    if (decision === 'block') {
      await executePrivateSql(`INSERT INTO pilot_access_blocks(contact,blocked,reason,updated_at) VALUES (?,1,?,?)
        ON CONFLICT(contact) DO UPDATE SET blocked=1,reason=excluded.reason,updated_at=excluded.updated_at`,
      [contact, reason, new Date().toISOString()]);
    } else {
      const result = await executePrivateSql(
        'UPDATE pilot_access_blocks SET blocked=0,reason=?,updated_at=? WHERE contact=? AND blocked=1',
        [reason, new Date().toISOString(), contact],
      );
      if (Number(result.affected_row_count) !== 1) return 'not-blocked';
    }
    revalidatePath('/en/account');
    revalidatePath('/pt/conta');
    return decision === 'block' ? 'blocked' : 'unblocked';
  } catch { return 'unavailable'; }
}
