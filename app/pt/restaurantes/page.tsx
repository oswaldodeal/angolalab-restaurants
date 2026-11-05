import RestaurantDirectory from '@/components/RestaurantDirectory';
import { getRestaurantDirectory } from '@/lib/restaurant-data';
export const dynamic = 'force-dynamic';
export default async function RestaurantsListPage() {
  const { restaurants, unavailable } = await getRestaurantDirectory();
  return <RestaurantDirectory language="pt" records={restaurants} unavailable={unavailable} />;
}
