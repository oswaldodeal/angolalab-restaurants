'use server';

import { randomUUID } from 'node:crypto';
import { requestFppAccess, submitFppPost } from '@/lib/fpp-community';
import { isFppPostType } from '@/lib/fpp-posts';
import { revalidateFpp } from '@/lib/fpp-revalidation';
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

export async function requestProfessionalProfileAccess() {
  if (!accountsConfigured()) return 'unavailable';
  const { userId } = await auth();
  if (!userId) return 'unavailable';

  try {
    const contacts = await verifiedContactKeys(userId);
    if (!(await requestFppAccess(userId, randomUUID(), contacts))) return 'not-eligible';
  } catch {
    return 'unavailable';
  }
  revalidateFpp();
  return 'requested';
}

export async function shareFppPost(_previous: string | null, formData: FormData) {
  if (!accountsConfigured()) return 'unavailable';
  const { userId } = await auth();
  if (!userId) return 'unavailable';
  const kind = formData.get('kind');
  const rawTitle = formData.get('title');
  const rawBody = formData.get('body');
  if (!isFppPostType(kind) || typeof rawTitle !== 'string' || typeof rawBody !== 'string' || formData.get('consent') !== 'on') return 'invalid';
  const title = rawTitle.trim();
  const body = rawBody.trim();
  if (title.length < 3 || title.length > 120 || body.length < 10 || body.length > 3000) return 'invalid';

  try {
    const contacts = await verifiedContactKeys(userId);
    if (!(await submitFppPost(userId, randomUUID(), { kind, title, body }, contacts))) return 'not-eligible';
  } catch {
    return 'unavailable';
  }
  revalidateFpp();
  return 'submitted';
}
