import RestaurantRegistrationEntry from '@/components/RestaurantRegistrationEntry';
import { restaurantReferral } from '@/lib/restaurant-referral';
import FppCommunity from '@/components/FppCommunity';

export default async function EnglishProfessionalsPage({ searchParams }: { searchParams: Promise<{ restaurant?: string | string[] }> }) {
  const id = restaurantReferral((await searchParams).restaurant);
  return <>{id && <RestaurantRegistrationEntry language="en" id={id} />}<FppCommunity language="en" restaurantId={id} /></>;
}
