'use server';

import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { reviewFppPost, reviewFppRequest } from '@/lib/fpp-community';
import { revalidateFpp } from '@/lib/fpp-revalidation';

export async function decideFpp(formData: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const id = formData.get('id');
  const decision = formData.get('decision');
  const queue = formData.get('queue') === 'posts' ? 'posts' : 'requests';
  let result = 'failed';

  if (typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id)) {
    try {
      if (queue === 'requests' && (decision === 'approved' || decision === 'declined')) {
        result = await reviewFppRequest(id, decision) ? 'saved' : 'stale';
      } else if (queue === 'posts' && (decision === 'published' || decision === 'declined' || decision === 'removed')) {
        result = await reviewFppPost(id, decision) ? 'saved' : 'stale';
      }
    } catch {
      result = 'failed';
    }
  }

  if (result === 'saved') revalidateFpp();
  redirect(`/staff/review/fpp?queue=${queue}&result=${result}`);
}
