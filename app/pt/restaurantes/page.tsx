import RestaurantDirectory from '@/components/RestaurantDirectory';
import { getRestaurantDirectory } from '@/lib/restaurant-data';
export const dynamic = 'force-dynamic';
export default async function RestaurantsListPage({ searchParams }: PageProps<'/pt/restaurantes'>) {
  const { restaurants, unavailable } = await getRestaurantDirectory();
  const verifiedOnly = (await searchParams).verified === '1';
  return <RestaurantDirectory language="pt" records={restaurants} unavailable={unavailable} verifiedOnly={verifiedOnly} />;
}
