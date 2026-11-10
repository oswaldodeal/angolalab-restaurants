import Link from 'next/link';
import { getRestaurantDirectory } from '@/lib/restaurant-data';
import { CITIES, COUNTRIES } from '@/lib/store';

const categories = [
  { id: 'hotels', en: 'Hotels', pt: 'Hotéis' },
  { id: 'parks', en: 'Parks', pt: 'Parques' },
  { id: 'restaurants', en: 'Restaurants', pt: 'Restaurantes' },
  { id: 'arts', en: 'Arts and culture', pt: 'Artes e cultura' },
  { id: 'events', en: 'Events', pt: 'Eventos' },
  { id: 'businesses', en: 'Businesses', pt: 'Empresas' },
  { id: 'colleges', en: 'Colleges and universities', pt: 'Faculdades e universidades' },
  { id: 'hospitals', en: 'Hospitals', pt: 'Hospitais' },
];

export default async function FindMe({ searchParams }: PageProps<'/findme'>) {
  const params = await searchParams;
  const language = params.lang === 'pt' ? 'pt' : 'en';
  const pt = language === 'pt';
  const city = CITIES.find(item => item.id === params.city);
  const country = COUNTRIES.find(item => item.id === city?.country);
  const location = city && country ? `${city[language]}, ${country[language]}` : '';

  const selected = categories.find(category => category.id === params.category);
  const directory = selected?.id === 'restaurants' ? await getRestaurantDirectory() : null;
  const restaurants = directory?.restaurants.filter(restaurant =>
    restaurant.status === 'verified' && restaurant.profilePlan === 'pro' && restaurant.ownerId !== 'demo' &&
    (!city || (restaurant.city === city.id && restaurant.country === city.country))
  ) ?? [];
  const restaurantPath = pt ? '/pt/restaurantes' : '/en/restaurants';

  return (
    <main className="min-h-screen bg-[#f3f2ef] text-[#242424]">
      <section className="page-rail py-12">
        <h1 className="text-4xl font-semibold">{pt ? 'MeAcha' : 'FindMe'}</h1>
        <p className="mt-3 text-[#555]">
          {location
            ? (pt ? `Escolha o que procura em ${location}.` : `Choose what to explore in ${location}.`)
            : (pt ? 'Escolha o que procura.' : 'Choose what you want to explore.')}
        </p>
        <p className="mt-2 text-sm text-[#555]">{pt ? 'O MeAcha apresenta perfis Pro Verificados do AngolaLab.' : 'FindMe features AngolaLab Pro Verified profiles.'}</p>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => {
            const query = new URLSearchParams({ lang: language, category: category.id });
            if (city) query.set('city', city.id);
            const active = selected?.id === category.id;
            return (
              <li key={category.id}>
                <Link href={`/findme?${query}#findme-results`} aria-current={active ? 'true' : undefined}
                  className={`block rounded-xl border bg-white p-5 font-semibold hover:border-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4 ${active ? 'border-emerald-700 text-emerald-700' : 'border-[#ded8c5]'}`}>
                  {category[language]}
                </Link>
              </li>
            );
          })}
        </ul>
        {selected && (
          <section id="findme-results" className="mt-8 scroll-mt-28 rounded-xl border border-[#ded8c5] bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-semibold">{selected[language]}</h2>
            {directory?.unavailable ? (
              <p role="status" className="mt-3 text-[#555]">{pt ? 'Os registos estão temporariamente indisponíveis.' : 'Listings are temporarily unavailable.'}</p>
            ) : restaurants.length > 0 ? (
              <ul className="mt-4 divide-y divide-[#e9e5db]">
                {restaurants.map(restaurant => (
                  <li key={restaurant.id} className="py-3">
                    <Link href={`${restaurantPath}/${encodeURIComponent(restaurant.id)}`} className="font-semibold text-emerald-700 underline underline-offset-4">
                      {restaurant.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#555]">
                      {CITIES.find(item => item.id === restaurant.city)?.[language] ?? restaurant.city}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[#555]">{pt ? 'Ainda não há perfis Pro Verificados no AngolaLab para esta seleção.' : 'There are no Pro Verified AngolaLab profiles for this selection yet.'}</p>
            )}
            {selected.id === 'restaurants' && city && (
              <Link href={`/findme?lang=${language}&category=restaurants#findme-results`} className="mt-4 inline-block font-semibold text-emerald-700 underline underline-offset-4">
                {pt ? 'Ver restaurantes em todas as cidades' : 'Show restaurants in all cities'}
              </Link>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
