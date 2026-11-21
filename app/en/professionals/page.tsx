import RestaurantRegistrationEntry from '@/components/RestaurantRegistrationEntry';
import { restaurantReferral } from '@/lib/restaurant-referral';
import ProfessionalProfileDemo from '@/components/ProfessionalProfileDemo';

export default async function EnglishProfessionalsPage({ searchParams }: { searchParams: Promise<{ restaurant?: string | string[] }> }) {
  const id = restaurantReferral((await searchParams).restaurant);
  return <>{id && <RestaurantRegistrationEntry language="en" id={id} />}<ProfessionalProfileDemo language="en" /></>;
}
