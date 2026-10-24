import { notFound } from 'next/navigation';
import RestaurantResearchProfile from '@/components/RestaurantResearchProfile';
import { initialRestaurants } from '@/lib/store';

type Props = { params: Promise<{ id: string }> };

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = initialRestaurants.find((item) => item.id === id);
  if (!restaurant) notFound();
  return <RestaurantResearchProfile restaurant={restaurant} language="en" />;
}
