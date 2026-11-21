'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { staffAuthorized } from '@/lib/staff-auth';
import { mutateMenuItem } from '@/lib/menu-mutations';

function refreshMenu() {
  revalidatePath('/staff/review');
  revalidatePath('/en/account');
  revalidatePath('/pt/conta');
  revalidatePath('/en/restaurants', 'layout');
  revalidatePath('/pt/restaurantes', 'layout');
}
export async function saveMenuItem(form: FormData) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const result = await mutateMenuItem(form, null);
  refreshMenu();
  redirect('/staff/review?result=' + result);
}
export async function saveStaffMenuItem(_previous: string, form: FormData): Promise<string> {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const result = await mutateMenuItem(form, null);
  refreshMenu();
  return result;
}
