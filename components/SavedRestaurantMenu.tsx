'use client';
import { useState } from 'react';
import type { SavedMenuItem } from '@/lib/store';

export default function SavedRestaurantMenu({ items, country, language }: { items: SavedMenuItem[]; country: string; language: 'en' | 'pt' }) {
  const [category, setCategory] = useState('all');
  const pt = language === 'pt';
  const currency = country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA';
  const labels = [['all', pt ? 'Todos' : 'All'], ['mains', pt ? 'Pratos principais' : 'Main courses'], ['drinks', pt ? 'Bebidas' : 'Drinks'], ['desserts', pt ? 'Sobremesas' : 'Desserts']];
  const visible = items.filter(item => category === 'all' || item.category === category);
  return <div className="mt-5">
    <div role="group" aria-label={pt ? 'Categorias da ementa' : 'Menu categories'} className="flex flex-wrap gap-4 border-b border-[#e9e5db]">
      {labels.map(([key,label]) => <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(key)} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${category === key ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-[#555]'}`}>{label}</button>)}
    </div>
    <div className="mt-5 divide-y divide-[#e9e5db] rounded-xl border border-[#e9e5db] bg-white px-4 sm:px-6">
      {labels.slice(1).map(([key,label]) => {
        const entries = visible.filter(item => item.category === key);
        if (!entries.length) return null;
        return <section key={key} aria-label={label} className="py-5">
          <h3 className="mb-4 text-lg font-semibold">{label}</h3>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{entries.map(item => <article key={item.id} className={item.photo ? 'overflow-hidden rounded-xl border border-[#e9e5db] bg-white' : 'border-b border-[#e9e5db] py-3'}>
      {item.photo && <img src={item.photo} alt={language === 'en' && item.nameEn ? item.nameEn : item.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
      <div className={item.photo ? 'p-4' : ''}>
        <div className="flex items-start justify-between gap-4"><h4 className="min-w-0 break-words font-semibold">{language === 'en' && item.nameEn ? item.nameEn : item.name}</h4>
          <p className="shrink-0 font-semibold text-emerald-800">{new Intl.NumberFormat(pt ? 'pt-PT' : 'en-GB', { style: 'currency', currency }).format(Number(item.price))}</p>
        </div>
        {item.referenceCode && <p className="mt-2 text-sm text-[#555]">{pt ? 'Referência' : 'Reference'}: <code className="font-semibold tracking-wide text-[#242424]">{item.referenceCode}</code></p>}
        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${item.availability === 'unavailable' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>
          {item.availability === 'unavailable' ? (pt ? 'Indisponível' : 'Unavailable') : (pt ? 'Disponível' : 'Available')}
        </span>
        {item.photo?.startsWith('/demo/') && <p className="mt-1 text-xs text-[#555]">{pt ? 'Imagem ilustrativa' : 'Illustrative image'}</p>}
      </div>
    </article>)}</div>
        </section>;
      })}
    </div>
    {visible.length === 0 && <p className="mt-4 text-sm text-[#555]">{pt ? 'Ainda não há itens nesta categoria.' : 'No items in this category yet.'}</p>}
  </div>;
}
