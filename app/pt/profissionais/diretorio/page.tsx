import FppDirectory from '@/components/FppDirectory';
import { accountsConfigured } from '@/lib/account-auth';
import { getFppDirectory } from '@/lib/fpp-community';

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const profiles = accountsConfigured() ? await getFppDirectory().catch(() => null) : null;
  return <FppDirectory language="pt" profiles={profiles} />;
}
