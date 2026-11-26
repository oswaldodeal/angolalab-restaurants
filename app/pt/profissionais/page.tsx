import RestaurantRegistrationEntry from '@/components/RestaurantRegistrationEntry';
import { restaurantReferral } from '@/lib/restaurant-referral';
import FppCommunity from '@/components/FppCommunity';

export default async function PortugueseProfessionalsPage({ searchParams }: { searchParams: Promise<{ restaurant?: string | string[] }> }) {
  const id = restaurantReferral((await searchParams).restaurant);
  return <>{id && <RestaurantRegistrationEntry language="pt" id={id} />}<FppCommunity language="pt" restaurantId={id} /></>;
}
