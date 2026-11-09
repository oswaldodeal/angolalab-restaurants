import Link from 'next/link';
import { CITIES, COUNTRIES } from '@/lib/store';

const categories = [
  { en: 'Hotels', pt: 'Hotéis' },
  { en: 'Parks', pt: 'Parques' },
  { en: 'Restaurants', pt: 'Restaurantes' },
  { en: 'Arts and culture', pt: 'Artes e cultura' },
  { en: 'Events', pt: 'Eventos', web: true },
  { en: 'Businesses', pt: 'Empresas' },
  { en: 'Colleges and universities', pt: 'Faculdades e universidades' },
  { en: 'Hospitals', pt: 'Hospitais' },
];

export default async function FindMe({ searchParams }: PageProps<'/findme'>) {
  const params = await searchParams;
  const language = params.lang === 'pt' ? 'pt' : 'en';
  const pt = language === 'pt';
  const city = CITIES.find(item => item.id === params.city);
  const country = COUNTRIES.find(item => item.id === city?.country);
  const location = city && country ? `${city[language]}, ${country[language]}` : '';

  return (
    <main className="min-h-screen bg-[#f3f2ef] text-[#242424]">
      <section className="page-rail py-12">
        <h1 className="text-4xl font-semibold">FindMe</h1>
        <p className="mt-3 text-[#555]">
          {location
            ? (pt ? `Escolha o que procura em ${location}.` : `Choose what to explore in ${location}.`)
            : (pt ? 'Escolha o que procura.' : 'Choose what you want to explore.')}
        </p>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => {
            const query = [category[language], location].filter(Boolean).join(' ');
            const href = category.web
              ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            return (
              <li key={category.en}>
                <a href={href} className="block rounded-xl border border-[#ded8c5] bg-white p-5 hover:border-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4">
                  <span className="block font-semibold">{category[language]}</span>
                  <span className="mt-1 block text-sm text-emerald-700">{category.web ? 'Google Search ↗' : 'Google Maps ↗'}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <Link href={pt ? '/pt/restaurantes?verified=1' : '/en/restaurants?verified=1'} className="mt-7 inline-block font-semibold text-emerald-700 underline underline-offset-4">
          {pt ? 'Restaurantes verificados no AngolaLab' : 'Verified restaurants on AngolaLab'}
        </Link>
      </section>
    </main>
  );
}
