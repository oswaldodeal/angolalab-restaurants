'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidateFpp } from '@/lib/fpp-revalidation';
import { photoUpload } from '@/lib/photo-upload';
import { accountsConfigured } from '@/lib/account-auth';
import { readVisitorSettings } from '@/lib/fpp-visitor-settings';
import { storeFppVisitorSettings } from '@/lib/fpp-visitor-storage';
import { verifiedContactKeys } from '@/lib/pilot-access-blocks';

export async function saveFppVisitorSettings(_previous: string | null, form: FormData): Promise<string> {
  if (!accountsConfigured()) return 'unavailable';
  const { userId } = await auth();
  if (!userId) return 'unavailable';
  const settings = readVisitorSettings(form);
  if (!settings || form.get('adult') !== 'on') return 'invalid';

  let photo: string | null;
  try {
    const upload = await photoUpload(form);
    photo = upload || (form.get('removePhoto') === 'on' ? '' : null);
  } catch {
    return 'invalid-photo';
  }

  try {
    const contacts = await verifiedContactKeys(userId);
    if (!(await storeFppVisitorSettings(userId, settings, contacts, photo))) return 'unavailable';
  } catch {
    return 'unavailable';
  }
  revalidateFpp();
  return 'saved';
}
