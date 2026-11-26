'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { accountsConfigured } from '@/lib/account-auth';
import { verifiedContactKeys } from '@/lib/pilot-access-blocks';
import { saveProfessionalProfile } from '@/lib/professional-profile';
import { professionalProfileFields, type ProfessionalProfile, type ProfessionalProfileResult } from '@/lib/professional-profile-fields';

export async function submitProfessionalProfile(_previous: ProfessionalProfileResult | null, formData: FormData): Promise<ProfessionalProfileResult> {
  if (!accountsConfigured()) return 'unavailable';
  const { userId } = await auth();
  if (!userId) return 'unavailable';

  const profile = {} as ProfessionalProfile;
  for (const field of professionalProfileFields) {
    const entry = formData.get(field.key);
    if (entry !== null && typeof entry !== 'string') return 'invalid';
    const value = entry?.trim() ?? '';
    if (value.length > field.maxLength || ('required' in field && !value)) return 'invalid';
    profile[field.key] = value;
  }

  try {
    const contactKeys = await verifiedContactKeys(userId);
    if (!(await saveProfessionalProfile(userId, profile, contactKeys))) return 'blocked';
  } catch {
    return 'unavailable';
  }
  revalidatePath('/en/account');
  revalidatePath('/pt/conta');
  return 'saved';
}
