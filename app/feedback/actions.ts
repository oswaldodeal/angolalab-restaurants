'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { preparePilotFeedback } from '@/lib/pilot-feedback';
import { executePrivateSql } from '@/lib/turso';

export async function sendPilotFeedback(_previous: string, form: FormData) {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const body = String(form.get('body') ?? '').trim();
  if (!body || body.length > 2000) return 'invalid';
  try {
    await preparePilotFeedback();
    const now = new Date();
    const result = await executePrivateSql(`INSERT INTO pilot_feedback(user_id,body,submitted_at)
      SELECT ?,?,? WHERE NOT EXISTS (
        SELECT 1 FROM pilot_feedback WHERE user_id=? AND submitted_at>?
      )`, [userId,body,now.toISOString(),userId,new Date(now.getTime()-60_000).toISOString()]);
    if (!Number(result.affected_row_count)) return 'wait';
    revalidatePath('/staff/review');
    return 'sent';
  } catch { return 'unavailable'; }
}
