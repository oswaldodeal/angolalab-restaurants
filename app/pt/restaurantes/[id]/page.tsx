import { notFound } from 'next/navigation';
import RestaurantResearchProfile from '@/components/RestaurantResearchProfile';
import { initialRestaurants } from '@/lib/store';
import { getPublishedRestaurant } from '@/lib/restaurant-data';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };
export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const demo = initialRestaurants.find(item => item.id === id);
  let restaurant = demo ?? null;
  if (!demo) {
    try { restaurant = await getPublishedRestaurant(id); }
    catch {
      return <main className="bg-white px-5 py-16 text-[#242424]"><h1 className="text-2xl font-semibold">Perfil temporariamente indisponível</h1><p className="mt-4">Tente novamente mais tarde.</p></main>;
    }
  }
  if (!restaurant) notFound();
  return <RestaurantResearchProfile restaurant={restaurant} language="pt" />;
}
