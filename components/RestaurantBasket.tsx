'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { registrationPilotId, withRestaurantReferral } from '@/lib/restaurant-referral';

type Basket = Record<string, number>;
type Item = { reference: string; name: string; price: string };
const key = `angolalab:restaurant-basket:${registrationPilotId}`;

export function readRestaurantBasket(): Basket {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([reference, quantity]) =>
      /^AL-\d{6,12}$/.test(reference) && Number.isInteger(quantity) && quantity >= 1 && quantity <= 10).slice(0, 20));
  } catch { return {}; }
}

export function saveRestaurantBasket(basket: Basket) {
  try {
    sessionStorage.setItem(key, JSON.stringify(basket));
    return true;
  } catch { return false; }
}

const BasketContext = createContext<{ basket: Basket; add: (reference: string) => void } | null>(null);

export function RestaurantBasketProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [basket, setBasket] = useState<Basket>({});
  useEffect(() => { if (enabled) setBasket(readRestaurantBasket()); }, [enabled]);
  function add(reference: string) {
    const current = readRestaurantBasket();
    if (!current[reference] && Object.keys(current).length >= 20) return;
    const next = { ...current, [reference]: Math.min((current[reference] ?? 0) + 1, 10) };
    if (saveRestaurantBasket(next)) setBasket(next);
  }
  return <BasketContext.Provider value={enabled ? {basket, add} : null}>{children}</BasketContext.Provider>;
}

export function useRestaurantBasket() {
  return useContext(BasketContext);
}

export function RestaurantBasketSummary({ language, items }: { language: 'en' | 'pt'; items: Item[] }) {
  const basket = useRestaurantBasket()?.basket ?? {};
  const pt = language === 'pt';
  const selected = items.filter(item => basket[item.reference]);
  const count = selected.reduce((total, item) => total + basket[item.reference], 0);
  return <section className="mt-4 rounded-lg border border-[#ded8c5] bg-[#fffdf8] p-3 text-sm">
    <h3 className="font-semibold" aria-live="polite">{pt ? 'Cesto' : 'Basket'} ({count})</h3>
    {count ? <>
      <ul className="mt-2">{selected.map(item => <li key={item.reference}>{basket[item.reference]} × {item.name}</li>)}</ul>
      <a href={`${withRestaurantReferral(pt ? '/pt/conta' : '/en/account', registrationPilotId)}#my-orders`}
        className="mt-3 inline-flex rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50">
        {pt ? 'Continuar para os meus pedidos' : 'Continue to My orders'}
      </a>
    </> : <p className="mt-1">{pt ? 'Toca na fotografia ou escolhe Adicionar.' : 'Tap a photo or choose Add to basket.'}</p>}
  </section>;
}
