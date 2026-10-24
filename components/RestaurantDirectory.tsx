'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CITIES, COUNTRIES, CUISINES, getGoogleMapsUrl, initialRestaurants } from '@/lib/store';
import { translations } from '@/lib/translations';

type Language = 'pt' | 'en';

export default function RestaurantDirectory({ language }: { language: Language }) {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [cuisine, setCuisine] = useState('');
  const t = translations[language];
  const isPt = language === 'pt';

  const availableCities = useMemo(
    () => CITIES.filter((item) => !country || item.country === country),
    [country]
  );
  const restaurants = useMemo(
    () => initialRestaurants.filter((item) =>
      (!country || item.country === country) &&
      (!city || item.city === city) &&
      (!cuisine || item.cuisine === cuisine)
    ),
    [country, city, cuisine]
  );

  return (
    <main className="min-h-screen bg-white text-[#222222]">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-9 border-b-[3px] border-[#D2AC37] pb-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#987515] sm:text-sm">
            {isPt ? 'AngolaLab · Rede de Restaurantes' : 'AngolaLab · Restaurant Network'}
          </p>
          <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t.home.browseRestaurants}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#535353] sm:text-lg">
            {isPt
              ? 'Explore restaurantes por país, cidade e tipo de cozinha.'
              : 'Explore restaurants by country, city and cuisine.'}
          </p>
        </div>

        <section aria-label={isPt ? 'Filtros de pesquisa' : 'Search filters'} className="mb-10 rounded-2xl border border-[#ded8c5] bg-white p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-semibold text-[#987515]">
            {isPt ? '01 · Descobrir restaurantes' : '01 · Discover restaurants'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
              {isPt ? 'País' : 'Country'}
              <select
                value={country}
                onChange={(event) => { setCountry(event.target.value); setCity(''); }}
                className="w-full rounded-lg border border-[#d9d5c9] bg-white px-4 py-3 text-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38b23]"
              >
                <option value="">{isPt ? 'Todos os países' : 'All countries'}</option>
                {COUNTRIES.map((item) => (
                  <option key={item.id} value={item.id}>{item[language]}</option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
              {isPt ? 'Cidade' : 'City'}
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-lg border border-[#d9d5c9] bg-white px-4 py-3 text-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38b23]"
              >
                <option value="">{isPt ? 'Todas as cidades' : 'All cities'}</option>
                {availableCities.map((item) => (
                  <option key={item.id} value={item.id}>{item[language]}</option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-sm font-medium">
              {isPt ? 'Tipo de cozinha' : 'Cuisine'}
              <select
                value={cuisine}
                onChange={(event) => setCuisine(event.target.value)}
                className="w-full rounded-lg border border-[#d9d5c9] bg-white px-4 py-3 text-[#222222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38b23]"
              >
                <option value="">{isPt ? 'Todos os tipos' : 'All cuisines'}</option>
                {CUISINES.map((item) => (
                  <option key={item.id} value={item.id}>{item[language]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#ece8dc] pt-5">
            <p className="text-sm text-[#555555]" aria-live="polite">
              {isPt ? `${restaurants.length} restaurante(s) encontrado(s)` : `${restaurants.length} restaurant(s) found`}
            </p>
            <Link
              href={isPt ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}
              className="inline-flex rounded-lg border border-[#b18a23] bg-[#fffaf0] px-5 py-3 text-sm font-semibold text-[#75570d] hover:bg-[#f9edcb]"
            >
              + {t.home.addRestaurant}
            </Link>
          </div>
        </section>

        <section aria-label={isPt ? 'Resultados de restaurantes' : 'Restaurant results'}>
          <h2 className="mb-6 text-xl font-semibold text-[#987515]">
            {isPt ? '02 · Perfis de restaurantes' : '02 · Restaurant profiles'}
          </h2>

          {restaurants.length === 0 ? (
            <div className="rounded-xl border border-[#ded8c5] bg-[#fffaf0] p-8 text-center">
              <p className="mb-2 font-semibold">
                {isPt ? 'Ainda não há restaurantes nesta seleção.' : 'No restaurants match this selection yet.'}
              </p>
              <p className="text-sm text-[#555555]">
                {isPt ? 'Experimente outro país, cidade ou tipo de cozinha.' : 'Try another country, city or cuisine.'}
              </p>
              <button
                type="button"
                onClick={() => { setCountry(''); setCity(''); setCuisine(''); }}
                className="mt-5 rounded-lg border border-[#b18a23] bg-white px-5 py-2.5 text-sm font-medium text-[#75570d] hover:bg-[#fff6df]"
              >
                {isPt ? 'Limpar filtros' : 'Clear filters'}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => {
                const cuisineLabel = CUISINES.find((item) => item.id === restaurant.cuisine)?.[language] ?? restaurant.cuisine;
                const cityLabel = CITIES.find((item) => item.id === restaurant.city)?.[language] ?? restaurant.city;
                const countryLabel = COUNTRIES.find((item) => item.id === restaurant.country)?.[language] ?? restaurant.country;
                return (
                  <article key={restaurant.id} className="overflow-hidden rounded-2xl border border-[#ded8c5] bg-white">
                    <div className="flex h-32 items-center justify-center border-b border-[#e8e1cf] bg-[#fbf8f0] text-4xl" aria-hidden="true">🍽️</div>
                    <div className="p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#987515]">
                        {cityLabel} · {countryLabel}
                      </p>
                      <h3 className="mb-2 text-xl font-semibold leading-snug">{restaurant.name}</h3>
                      <p className="mb-4 text-sm text-[#535353]">{cuisineLabel} · {restaurant.neighbourhood}</p>

                      <div className="mb-5 border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-4 py-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#987515]">
                          {isPt ? 'Estado do perfil' : 'Profile status'}
                        </p>
                        <p className="text-sm font-semibold text-[#292929]">
                          {restaurant.status === 'verified' ? t.restaurant.statusVerified : restaurant.status === 'basic' ? t.restaurant.statusBasic : t.restaurant.statusPending}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 border-t border-[#ece8dc] pt-4">
                        {restaurant.status === 'verified' && (
                          <a
                            href={getGoogleMapsUrl(restaurant)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-[#ded8c5] px-3 py-2 text-sm text-[#5d4a1a] hover:bg-[#fbf7ed]"
                          >
                            🗺️ {t.restaurant.viewMap}
                          </a>
                        )}
                        {restaurant.status === 'verified' ? (
                          <Link
                            href={isPt ? `/pt/restaurantes/${restaurant.id}` : `/en/restaurants/${restaurant.id}`}
                            className="rounded-lg bg-[#252a32] px-3 py-2 text-sm font-medium text-white hover:bg-[#414751]"
                          >
                            📖 {t.restaurant.viewMenu}
                          </Link>
                        ) : (
                          <span className="rounded-lg bg-[#f7f5ef] px-3 py-2 text-sm text-[#5d5d5d]">
                            ⏳ {t.restaurant.menuComing}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
