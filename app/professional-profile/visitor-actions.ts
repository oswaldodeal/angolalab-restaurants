'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
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

  try {
    const contacts = await verifiedContactKeys(userId);
    if (!(await storeFppVisitorSettings(userId, settings, contacts))) return 'unavailable';
  } catch {
    return 'unavailable';
  }
  revalidatePath('/en/account');
  revalidatePath('/pt/conta');
  return 'saved';
}
