import { restaurantReferral } from '@/lib/restaurant-referral';
import PilotAccountPage from '@/components/PilotAccountPage';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ restaurant?: string | string[] }> }) {
  const restaurantId = restaurantReferral((await searchParams).restaurant);
  return <PilotAccountPage restaurantId={restaurantId} language="en" mode="sign-in" />;
}
