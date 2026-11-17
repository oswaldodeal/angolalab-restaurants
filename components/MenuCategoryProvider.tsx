'use client';
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import type { SavedMenuItem } from '@/lib/store';

const MenuCategoryContext = createContext<{ category: string; setCategory: Dispatch<SetStateAction<string>> } | null>(null);
export function MenuCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState('all');
  return <MenuCategoryContext.Provider value={{ category, setCategory }}>{children}</MenuCategoryContext.Provider>;
}
export function useMenuCategory() {
  const shared = useContext(MenuCategoryContext);
  const [category, setCategory] = useState('all');
  return shared ?? { category, setCategory };
}
export function TextRestaurantMenu({ items, country, language }: { items: SavedMenuItem[]; country: string; language: 'pt' | 'en' }) {
  const { category } = useMenuCategory();
  const pt = language === 'pt';
  const visible = items.filter(item => !item.photo && (category === 'all' || item.category === category));
  const menuCurrency = country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA';
  const textMenuCategories = [['mains', pt ? 'Pratos principais' : 'Main courses'], ['drinks', pt ? 'Bebidas' : 'Drinks'], ['desserts', pt ? 'Sobremesas' : 'Desserts']];
  return (              <section className="rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-6">
                <h2 className="text-lg font-semibold">{pt ? 'Ementa · Comida e bebidas' : 'Menu · Food & drinks'}</h2>
                {visible.length === 0 && <p className="mt-4 text-sm text-[#555]">{pt ? 'Não há itens sem fotografia nesta categoria.' : 'No items without photos in this category.'}</p>}
                <div className="divide-y divide-[#e9e5db]">
                  {textMenuCategories.map(([key,label]) => {
                    const entries = visible.filter(item => item.category === key);
                    if (!entries.length) return null;
                    return <section key={key} className="mt-4 pt-4">
                      <h3 className="font-semibold">{label}</h3>
                      <ul className="mt-3 space-y-4">
                        {entries.map(item => <li key={item.id}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                            <span className="min-w-0 break-words font-medium">{!pt && item.nameEn ? item.nameEn : item.name}</span>
                            <span className="shrink-0 text-emerald-800">{new Intl.NumberFormat(pt ? 'pt-PT' : 'en-GB', { style: 'currency', currency: menuCurrency }).format(Number(item.price))}</span>
                          </div>
                          {item.referenceCode && <p className="mt-1 text-xs text-[#555]"><code>{item.referenceCode}</code></p>}
                          {item.availability === 'unavailable' && <p className="mt-1 text-xs text-[#555]">{pt ? 'Indisponível' : 'Unavailable'}</p>}
                        </li>)}
                      </ul>
                    </section>;
                  })}
                </div>
              </section>
);
}
