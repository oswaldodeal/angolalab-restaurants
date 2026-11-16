import OwnerDetailsForm from '@/components/OwnerDetailsForm';
import OwnerCoverPhoto from '@/components/OwnerCoverPhoto';
import { createHash } from 'node:crypto';
import OwnerMenuPhotos from '@/components/OwnerMenuPhotos';
import Link from 'next/link';
import { getOwnedRestaurants } from '@/lib/restaurant-owners';
import { readMenuPhotos } from '@/lib/store';
import StaffMenuEditor from '@/components/StaffMenuEditor';

export default async function OwnerRestaurants({ userId, language }: { userId: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  let restaurants;
  try { restaurants = await getOwnedRestaurants(); }
  catch { return <p role="alert" className="mt-6 text-red-700">{pt ? 'Não foi possível carregar os seus restaurantes. Tente novamente.' : 'Unable to load your restaurants. Please try again.'}</p>; }
  return <section className="mt-6 border-t border-[#ded8c5] pt-6">
    <h2 className="text-xl font-semibold">{pt ? 'Os meus restaurantes' : 'My restaurants'}</h2>
    <details className="mt-3 text-sm"><summary className="cursor-pointer text-emerald-700">{pt ? 'ID da minha conta para ligação pela equipa' : 'My account ID for staff connection'}</summary>
      <code className="mt-2 block select-all break-all rounded bg-[#f4f3ef] p-3">{userId}</code>
    </details>
    {restaurants.length === 0 && <p className="mt-4 text-sm text-[#555]">{pt ? 'Ainda não há restaurantes ligados à sua conta. A equipa pode associar o ID acima após confirmar a sua autorização.' : 'No restaurants are connected to your account yet. Staff can link the account ID above after confirming your permission.'}</p>}
    <div className="mt-4 space-y-6">{restaurants.map(restaurant => <article key={restaurant.id} className="rounded-xl border border-[#ded8c5] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        <Link href={`${pt ? '/pt/restaurantes' : '/en/restaurants'}/${restaurant.id}`} className="font-semibold text-emerald-700 underline underline-offset-4">{pt ? 'Ver perfil' : 'View profile'}</Link>
      </div>
      <OwnerDetailsForm id={restaurant.id!} language={language} description={restaurant.description ?? ''} hours={restaurant.opening_hours ?? ''} version={restaurant.details_version ?? ''} />
      {restaurant.pro_id && <OwnerCoverPhoto id={restaurant.id!} language={language} src={restaurant.cover_photo_url} token={restaurant.cover_photo_url ? createHash('sha256').update(restaurant.cover_photo_url).digest('hex') : ''} />}
      {restaurant.pro_id && <OwnerMenuPhotos id={restaurant.id!} language={language} photos={readMenuPhotos(restaurant.menu_photo_url,restaurant.cover_photo_url).map(src => ({src, token: createHash('sha256').update(src).digest('hex')}))} />}
      <StaffMenuEditor id={restaurant.id!} country={restaurant.country!} verified={Boolean(restaurant.verified_at)} photos={readMenuPhotos(restaurant.menu_photo_url,restaurant.cover_photo_url)} owner language={language} />
    </article>)}</div>
  </section>;
}
