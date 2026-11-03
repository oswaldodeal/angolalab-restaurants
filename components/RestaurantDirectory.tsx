'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CITIES, COUNTRIES, CUISINES, getGoogleMapsUrl, initialRestaurants } from '@/lib/store';
import { translations } from '@/lib/translations';
import { demoRestaurantPhoto } from '@/lib/demo-photos';
import { BUSINESS_TYPES } from '@/lib/business-types';

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
          <details className="group relative mt-5 inline-block text-sm">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-[#b18a23] bg-[#fffaf0] px-4 py-2.5 font-semibold text-[#75570d] hover:bg-[#f9edcb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b18a23] [&::-webkit-details-marker]:hidden">
              {isPt ? 'Explorar tipos de negócio' : 'Explore business types'}
              <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="absolute left-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw-3rem))] rounded-xl border border-[#e4d5a6] bg-white p-2 text-sm text-[#242424] shadow-xl">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#987515]">
                {isPt ? 'Tipos de negócio' : 'Business types'}
              </p>
              {BUSINESS_TYPES.map((type) => type.id === 'restaurant' ? (
                <Link key={type.id} href={isPt ? '/pt/restaurantes' : '/en/restaurants'}
                  aria-current="page"
                  className="block rounded-lg bg-[#fff8e6] px-3 py-2.5 font-semibold text-[#76570f] hover:bg-[#f9edcb] focus-visible:outline-2 focus-visible:outline-[#b18a23]">
                  {type[language]} ✓
                </Link>
              ) : (
                <div key={type.id} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[#666]">
                  <span>{type[language]}</span>
                  <span className="text-[10px] text-[#876613]">{isPt ? 'Em breve' : 'Planned'}</span>
                </div>
              ))}
              <div className="my-2 border-t border-[#e9e5db]" />
              <Link href={isPt ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}
                className="block rounded-lg bg-[#fff8e6] px-3 py-3 font-semibold text-[#76570f] hover:bg-[#f9edcb] focus-visible:outline-2 focus-visible:outline-[#b18a23]">
                {isPt ? '🧱 Demonstração de Perfis Adaptáveis' : '🧱 Adaptive Profile Demo'}
                <span className="mt-1 block text-xs font-normal text-[#6e675a]">
                  {isPt ? 'Pré-visualizar seis tipos de negócio' : 'Preview six business types'}
                </span>
              </Link>
            </div>
          </details>
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
                  <article key={restaurant.id} className="group overflow-hidden rounded-2xl border border-[#ded8c5] bg-white shadow-sm transition-shadow hover:shadow-lg">
                    <Link
                      href={isPt ? `/pt/restaurantes/${restaurant.id}` : `/en/restaurants/${restaurant.id}`}
                      className="block focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#D2AC37]"
                      aria-label={isPt ? `Abrir perfil de ${restaurant.name}` : `Open ${restaurant.name} profile`}
                    >
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#b58d44] via-[#61503b] to-[#242831]">
                        {demoRestaurantPhoto(restaurant.id) ? (
                          // Remote demo imagery: no claims of ownership or business identity.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={demoRestaurantPhoto(restaurant.id)!}
                            alt={isPt ? 'Fotografia ilustrativa de restaurante' : 'Illustrative restaurant photograph'}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                        <span className="absolute left-4 top-4 rounded-md bg-[#fff0b0] px-3 py-1 text-xs font-bold text-[#57410c]">
                          AngolaLab Test · {isPt ? 'Demonstração' : 'Demo'}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold leading-snug text-[#222] group-hover:text-[#987515]">{restaurant.name}</h3>
                        <p className="mt-2 text-sm text-[#555]">{cuisineLabel} · {cityLabel}, {countryLabel}</p>
                        <p className="mt-3 text-sm font-semibold text-[#987515]">{isPt ? 'Ver perfil do restaurante →' : 'View restaurant profile →'}</p>
                      </div>
                    </Link>
                    <div className="border-t border-[#ece8dc] px-5 py-4">
                      <p className="text-xs text-[#666]">{isPt ? 'Perfil de demonstração — não é um negócio verificado.' : 'Demonstration profile — not a verified business.'}</p>
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
