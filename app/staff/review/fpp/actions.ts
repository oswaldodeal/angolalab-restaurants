'use server';

import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { reviewFppPost } from '@/lib/fpp-community';
import { revalidateFpp } from '@/lib/fpp-revalidation';

export async function decideFpp(formData: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = formData.get('id');
  const decision = formData.get('decision');
  let result = 'failed';

  if (typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id)) {
    try {
      if (formData.get('queue') !== 'requests' && (decision === 'published' || decision === 'declined' || decision === 'removed')) {
        result = await reviewFppPost(id, decision) ? 'saved' : 'stale';
      }
    } catch {
      result = 'failed';
    }
  }

  if (result === 'saved') revalidateFpp();
  redirect(`/staff/review/fpp?result=${result}`);
}
