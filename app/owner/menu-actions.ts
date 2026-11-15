'use server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { mutateMenuItem } from '@/lib/menu-mutations';

export async function saveOwnerMenuItem(_previous: string, form: FormData): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'signed-out';
  const result = await mutateMenuItem(form, userId);
  revalidatePath('/en/account');
  revalidatePath('/pt/conta');
  revalidatePath('/staff/review');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
  return result;
}
