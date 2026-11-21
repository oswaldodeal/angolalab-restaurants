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

const BasketContext = createContext<{ basket: Basket; add: (reference: string) => void; update: (reference: string, quantity: number) => void } | null>(null);

export function RestaurantBasketProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [basket, setBasket] = useState<Basket>({});
  useEffect(() => { if (enabled) setBasket(readRestaurantBasket()); }, [enabled]);
  function add(reference: string) {
    const current = readRestaurantBasket();
    if (!current[reference] && Object.keys(current).length >= 20) return;
    const next = { ...current, [reference]: Math.min((current[reference] ?? 0) + 1, 10) };
    if (saveRestaurantBasket(next)) setBasket(next);
  }
  function update(reference: string, quantity: number) {
    const next = readRestaurantBasket();
    if (!next[reference] || !Number.isInteger(quantity) || quantity < 0 || quantity > 10) return;
    if (quantity === 0) delete next[reference];
    else next[reference] = quantity;
    if (saveRestaurantBasket(next)) setBasket(next);
  }
  return <BasketContext.Provider value={enabled ? {basket, add, update} : null}>{children}</BasketContext.Provider>;
}

export function useRestaurantBasket() {
  return useContext(BasketContext);
}

export function RestaurantBasketSummary({ language, items }: { language: 'en' | 'pt'; items: Item[] }) {
  const context = useRestaurantBasket();
  const basket = context?.basket ?? {};
  const [editing, setEditing] = useState<string | null>(null);
  const pt = language === 'pt';
  const selected = items.filter(item => basket[item.reference]);
  const count = selected.reduce((total, item) => total + basket[item.reference], 0);
  return <section className="mt-4 rounded-lg border border-[#ded8c5] bg-[#fffdf8] p-3 text-sm">
    <h3 className="font-semibold" aria-live="polite">{pt ? 'Cesto' : 'Basket'} ({count})</h3>
    {count ? <>
      <ul className="mt-2 divide-y divide-[#ded8c5]">{selected.map(item => <li key={item.reference} className="py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{basket[item.reference]} × {item.name}</span>
          <div className="flex gap-4">
            <button type="button" onClick={() => setEditing(editing === item.reference ? null : item.reference)}
              aria-expanded={editing === item.reference}
              aria-label={pt ? `Editar quantidade de ${item.name}` : `Edit quantity of ${item.name}`}
              className="min-h-11 font-semibold text-emerald-800 underline">{pt ? 'Editar' : 'Edit'}</button>
            <button type="button" onClick={() => {
              context?.update(item.reference, 0);
              if (editing === item.reference) setEditing(null);
            }} aria-label={pt ? `Remover ${item.name} do cesto` : `Remove ${item.name} from basket`}
              className="min-h-11 font-semibold text-red-800 underline">{pt ? 'Remover' : 'Remove'}</button>
          </div>
        </div>
        {editing === item.reference && <form className="mt-2 flex flex-wrap items-end gap-3" onSubmit={event => {
          event.preventDefault();
          const quantity = Number(new FormData(event.currentTarget).get('quantity'));
          context?.update(item.reference, quantity);
          setEditing(null);
        }}>
          <label>{pt ? 'Quantidade' : 'Quantity'}
            <input name="quantity" type="number" min={1} max={10} step={1} required defaultValue={basket[item.reference]}
              className="ml-2 min-h-11 w-20 rounded-lg border border-[#ded8c5] bg-white p-2"/>
          </label>
          <button className="min-h-11 font-semibold text-emerald-800 underline">{pt ? 'Guardar' : 'Save'}</button>
          <button type="button" onClick={() => setEditing(null)} className="min-h-11 underline">{pt ? 'Cancelar' : 'Cancel'}</button>
        </form>}
      </li>)}</ul>
      <a href={`${withRestaurantReferral(pt ? '/pt/conta' : '/en/account', registrationPilotId)}#my-orders`}
        className="mt-3 inline-flex rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50">
        {pt ? 'Continuar para os meus pedidos' : 'Continue to My orders'}
      </a>
    </> : <p className="mt-1">{pt ? 'Toca na fotografia ou escolhe Adicionar.' : 'Tap a photo or choose Add to basket.'}</p>}
  </section>;
}
