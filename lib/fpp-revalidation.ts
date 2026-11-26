import 'server-only';
import { revalidatePath } from 'next/cache';

export function revalidateFpp() {
  for (const path of ['/en/account', '/pt/conta', '/en/professionals', '/pt/profissionais', '/staff/review/fpp']) {
    revalidatePath(path);
  }
}
