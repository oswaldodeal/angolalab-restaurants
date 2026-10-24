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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">{t.home.browseRestaurants}</h1>
        <p className="text-slate-600 mb-8">
          {isPt ? 'Explore restaurantes por país e cidade.' : 'Explore restaurants by country and city.'}
        </p>

        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            {isPt ? 'País' : 'Country'}
            <select
              value={country}
              onChange={(event) => { setCountry(event.target.value); setCity(''); }}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white min-w-40"
            >
              <option value="">{isPt ? 'Todos os países' : 'All countries'}</option>
              {COUNTRIES.map((item) => (
                <option key={item.id} value={item.id}>{item[language]}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            {isPt ? 'Cidade' : 'City'}
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white min-w-40"
            >
              <option value="">{isPt ? 'Todas as cidades' : 'All cities'}</option>
              {availableCities.map((item) => (
                <option key={item.id} value={item.id}>{item[language]}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            {isPt ? 'Tipo de cozinha' : 'Cuisine'}
            <select
              value={cuisine}
              onChange={(event) => setCuisine(event.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white min-w-40"
            >
              <option value="">{isPt ? 'Todos os tipos' : 'All cuisines'}</option>
              {CUISINES.map((item) => (
                <option key={item.id} value={item.id}>{item[language]}</option>
              ))}
            </select>
          </label>

          <Link
            href={isPt ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}
            className="ml-auto bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100"
          >
            + {t.home.addRestaurant}
          </Link>
        </div>

        <p className="text-sm text-slate-600 mb-5" aria-live="polite">
          {isPt ? `${restaurants.length} restaurante(s) encontrado(s)` : `${restaurants.length} restaurant(s) found`}
        </p>

        {restaurants.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-semibold mb-2">{isPt ? 'Ainda não há restaurantes nesta seleção.' : 'No restaurants match this selection yet.'}</p>
            <p className="text-slate-600 text-sm">{isPt ? 'Experimente outro país, cidade ou tipo de cozinha.' : 'Try another country, city or cuisine.'}</p>
            <button
              type="button"
              onClick={() => { setCountry(''); setCity(''); setCuisine(''); }}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            >
              {isPt ? 'Limpar filtros' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => {
              const cuisineLabel = CUISINES.find((item) => item.id === restaurant.cuisine)?.[language] ?? restaurant.cuisine;
              const cityLabel = CITIES.find((item) => item.id === restaurant.city)?.[language] ?? restaurant.city;
              const countryLabel = COUNTRIES.find((item) => item.id === restaurant.country)?.[language] ?? restaurant.country;
              return (
                <article key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="h-40 bg-emerald-50 flex items-center justify-center text-4xl" aria-hidden="true">🍽️</div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-1">{restaurant.name}</h2>
                    <p className="text-slate-500 text-sm mb-3">{cuisineLabel} · {cityLabel}, {countryLabel}</p>
                    <p className="text-slate-600 text-sm mb-4">{restaurant.neighbourhood}, {restaurant.address}</p>
                    <p className={`text-sm font-medium mb-3 ${restaurant.status === 'verified' ? 'text-emerald-600' : restaurant.status === 'basic' ? 'text-amber-600' : 'text-slate-400'}`}>
                      {restaurant.status === 'verified' ? t.restaurant.statusVerified : restaurant.status === 'basic' ? t.restaurant.statusBasic : t.restaurant.statusPending}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <a href={getGoogleMapsUrl(restaurant)} target="_blank" rel="noopener noreferrer" className="text-sm bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">
                        🗺️ {t.restaurant.viewMap}
                      </a>
                      {restaurant.status === 'verified' ? (
                        <Link href={isPt ? `/pt/restaurantes/${restaurant.id}` : `/en/restaurants/${restaurant.id}`} className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                          📖 {t.restaurant.viewMenu}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400 px-3 py-1.5">⏳ {t.restaurant.menuComing}</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
