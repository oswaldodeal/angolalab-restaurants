'use client';

import { useRef, useState } from 'react';
import type { MenuCategory, MenuItem } from '@/components/RestaurantMenuPreview';

const startingMenu: MenuCategory[] = [
  { id: 'category-1', name: 'House Specialities', kind: 'food', items: [
    { id: 'item-1', name: 'House stew with rice', price: 14.5, description: 'Illustrative main course' },
    { id: 'item-2', name: 'Grilled vegetable plate', price: 11.95 },
  ] },
  { id: 'category-2', name: 'Drinks', kind: 'drinks', items: [
    { id: 'item-3', name: 'Fresh juice', price: 3.25 },
  ] },
];

type FeaturedMeal = { id: 'breakfast' | 'lunch'; name: string; price: number; availability: string };
const initialFeaturedMeals: FeaturedMeal[] = [
  { id: 'breakfast', name: 'Breakfast', price: 8.5, availability: 'Weekdays' },
  { id: 'lunch', name: 'Lunch', price: 12, availability: 'Weekends' },
];

const inputClass = 'w-full rounded-lg border border-[#ded8c9] bg-white px-3 py-2 text-sm text-[#242424] focus:outline-none focus:ring-2 focus:ring-[#c9a43b]';
const buttonClass = 'rounded-lg border border-[#c9ae6d] bg-white px-3 py-2 text-sm font-semibold text-[#75570d] hover:bg-[#fbf7ed]';

export default function RestaurantMenuEditorDemo({ language }: { language: 'pt' | 'en' }) {
  const pt = language === 'pt';
  const [tier, setTier] = useState<'basic' | 'verified'>('basic');
  const [country, setCountry] = useState<'GB' | 'AO'>('GB');
  const [categories, setCategories] = useState<MenuCategory[]>(() => structuredClone(startingMenu));
  const [featuredMeals, setFeaturedMeals] = useState<FeaturedMeal[]>(() => structuredClone(initialFeaturedMeals));
  const [newCategory, setNewCategory] = useState('');
  const [newKind, setNewKind] = useState<'food' | 'drinks'>('food');
  const [firstItemName, setFirstItemName] = useState('');
  const [firstItemPrice, setFirstItemPrice] = useState('');
  const counter = useRef(10);
  const canEdit = tier === 'verified';
  const currency = country === 'GB' ? 'GBP' : 'AOA';
  const money = (value: number) => new Intl.NumberFormat(pt ? 'pt-PT' : 'en-GB', {
    style: 'currency', currency,
  }).format(Number.isFinite(value) ? value : 0);
  const nextId = () => String(++counter.current);
  const updateFeaturedMeal = (id: FeaturedMeal['id'], patch: Partial<FeaturedMeal>) => {
    setFeaturedMeals((previous) => previous.map((meal) => meal.id === id ? { ...meal, ...patch } : meal));
  };
  const updateCategory = (id: string, patch: Partial<MenuCategory>) => {
    setCategories((previous) => previous.map((category) => category.id === id ? { ...category, ...patch } : category));
  };
  const updateItem = (categoryId: string, itemId: string, patch: Partial<MenuItem>) => {
    setCategories((previous) => previous.map((category) => category.id === categoryId
      ? { ...category, items: category.items.map((item) => item.id === itemId ? { ...item, ...patch } : item) }
      : category));
  };
  const addCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!canEdit || !name) return;
    const itemName = firstItemName.trim();
    const price = firstItemPrice.trim() === '' ? 0 : Number(firstItemPrice);
    if (itemName && (!Number.isFinite(price) || price < 0 || price > 99999999)) return;
    const items: MenuItem[] = itemName ? [{ id: 'item-' + nextId(), name: itemName.slice(0, 100), price }] : [];
    setCategories((previous) => [...previous, { id: 'category-' + nextId(), name: name.slice(0, 70), kind: newKind, items }]);
    setNewCategory('');
    setFirstItemName('');
    setFirstItemPrice('');
  };
  const addItem = (categoryId: string) => {
    if (!canEdit) return;
    setCategories((previous) => previous.map((category) => category.id === categoryId
      ? { ...category, items: [...category.items, { id: 'item-' + nextId(), name: '', price: 0 }] }
      : category));
  };

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-10 text-[#242424] sm:px-8">
      <div className="mx-auto max-w-6xl rounded-xl border border-[#e9e5db] bg-white p-5 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#987515]">AngolaLab · {pt ? 'Laboratório do proprietário' : 'Owner laboratory'}</p>
        <h1 className="mt-3 text-3xl font-semibold">{pt ? 'Brick 008 · Editor de ementa' : 'Brick 008 · Restaurant Menu Editor'}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#555]">
{pt ? 'No perfil Básico, edite duas refeições em destaque. No perfil Verificado, experimente categorias e ementas completas. Tudo é fictício; as alterações desaparecem ao atualizar a página.' : 'Basic owners can edit two featured meals. Verified owners can explore categories and full menus. Everything is fictional and resets on refresh.'}
        </p>
        <div className="mt-6 border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-4 py-3 text-sm">
          <strong>{pt ? 'Demonstração apenas.' : 'Demonstration only.'}</strong>{' '}
          {pt ? 'Não existe início de sessão, gravação, publicação ou verificação real nesta página.' : 'There is no sign-in, saving, publishing or real verification on this page.'}
        </div>
        <div className="mt-6 grid gap-4 rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {pt ? 'Simular tipo de perfil' : 'Simulate profile tier'}
            <select value={tier} onChange={(event) => setTier(event.target.value as 'basic' | 'verified')} className={inputClass + ' mt-2'}>
              <option value="basic">{pt ? 'Básico · Acesso limitado' : 'Basic · Limited access'}</option>
              <option value="verified">{pt ? 'Verificado · Editor de demonstração' : 'Verified · Demo editor'}</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            {pt ? 'Mercado e moeda' : 'Market and currency'}
            <select value={country} onChange={(event) => setCountry(event.target.value as 'GB' | 'AO')} className={inputClass + ' mt-2'}>
              <option value="GB">Manchester · GBP (£)</option>
              <option value="AO">Luanda · AOA (Kz)</option>
            </select>
          </label>
        </div>

        {!canEdit ? (
          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <section aria-label={pt ? 'Editar refeições em destaque' : 'Edit featured meals'}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{pt ? 'As minhas duas refeições em destaque' : 'My two featured meals'}</h2>
                <span className="rounded-lg border border-[#c9ae6d] bg-[#fff5d9] px-3 py-1.5 text-xs font-semibold text-[#75570d]">2 / 2 · Basic</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#555]">
                {pt ? 'Pode atualizar o nome, o preço e a disponibilidade de cada refeição. Para substituir uma refeição, altere os dados no respetivo espaço. Não é necessário verificar a empresa para manter estas duas refeições atualizadas.' : 'Edit each meal name, price and availability. To replace a meal, change its details in the same slot. Business verification is not required to maintain these two meals.'}
              </p>
              <div className="mt-5 space-y-4">
                {featuredMeals.map((meal, index) => (
                  <section key={meal.id} className="rounded-xl border border-[#e9e5db] bg-white p-5">
                    <h3 className="font-semibold">{pt ? 'Refeição em destaque' : 'Featured meal'} {index + 1}</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                      <label className="text-xs font-semibold text-[#555]">
                        {pt ? 'Nome da refeição' : 'Meal name'}
                        <input required maxLength={100} value={meal.name} onChange={(event) => updateFeaturedMeal(meal.id, { name: event.target.value })} className={inputClass + ' mt-1'} />
                      </label>
                      <label className="text-xs font-semibold text-[#555]">
                        {pt ? 'Preço' : 'Price'} ({currency})
                        <input type="number" min="0" max="99999999" step="any" value={meal.price} onChange={(event) => {
                          const price = Number(event.target.value);
                          if (Number.isFinite(price)) updateFeaturedMeal(meal.id, { price: Math.min(99999999, Math.max(0, price)) });
                        }} className={inputClass + ' mt-1'} />
                      </label>
                    </div>
                    <label className="mt-3 block text-xs font-semibold text-[#555]">
                      {pt ? 'Disponibilidade (opcional)' : 'Availability (optional)'}
                      <input maxLength={100} value={meal.availability} onChange={(event) => updateFeaturedMeal(meal.id, { availability: event.target.value })} placeholder={pt ? 'Ex.: Dias úteis' : 'e.g. Weekdays'} className={inputClass + ' mt-1'} />
                    </label>
                  </section>
                ))}
              </div>
              <button type="button" onClick={() => setFeaturedMeals(structuredClone(initialFeaturedMeals))} className={buttonClass + ' mt-4'}>
                {pt ? 'Repor refeições de exemplo' : 'Reset example meals'}
              </button>
              <div className="mt-6 rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-5">
                <h3 className="font-semibold text-[#75570d]">🔒 {pt ? 'Ementa completa · Perfis Verificados' : 'Full menu · Verified profiles'}</h3>
                <p className="mt-2 text-sm text-[#555]">
                  {pt ? 'O perfil Básico mantém as duas refeições em destaque e a pré-visualização da ementa acordada no Brick 007. As categorias personalizadas e a ementa completa são funcionalidades Verificadas. A verificação depende de evidências e não é garantida pelo pagamento.' : 'Basic retains two featured meals and the Brick 007 menu preview. Custom categories and full menus belong to Verified profiles. Verification is evidence-based and is not guaranteed by payment.'}
                </p>
                <button type="button" onClick={() => setTier('verified')} className={buttonClass + ' mt-4'}>
                  {pt ? 'Experimentar editor Verificado (demonstração)' : 'Try Verified editor (demo)'}
                </button>
              </div>
            </section>
            <aside aria-label={pt ? 'Pré-visualização das refeições' : 'Featured meals preview'} className="self-start rounded-xl border border-[#e9e5db] bg-[#fffdf9] p-5 lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{pt ? 'Pré-visualização · Básico' : 'Preview · Basic'}</h2>
                <span className="rounded-md bg-[#fff5d9] px-2 py-1 text-xs font-semibold text-[#75570d]">DEMO</span>
              </div>
              <p className="mt-2 text-xs text-[#777]">{pt ? 'Não publicado · Apenas nesta página' : 'Not published · This page only'}</p>
              <div className="mt-5 space-y-4">
                {featuredMeals.map((meal) => (
                  <article key={meal.id} className="rounded-lg border border-[#e9e5db] bg-white p-4">
                    <h3 className="font-semibold">{meal.name.trim() || (pt ? 'Refeição sem nome' : 'Unnamed meal')}</h3>
                    <p className="mt-2 text-sm text-[#555]">{pt ? 'Preço' : 'Price'}: <strong>{money(meal.price)}</strong></p>
                    {meal.availability.trim() && <p className="mt-1 text-sm text-[#555]">{pt ? 'Disponibilidade' : 'Availability'}: {meal.availability}</p>}
                  </article>
                ))}
              </div>
              <p className="mt-5 border-t border-[#e9e5db] pt-4 text-xs text-[#777]">
                {pt ? 'Esta pré-visualização mostra apenas as duas refeições em destaque. O perfil público de demonstração não é alterado.' : 'This preview shows only the two featured meals. The demonstration public profile is not changed.'}
              </p>
            </aside>
          </div>
        ) : (
          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <section aria-label={pt ? 'Editar ementa' : 'Edit menu'}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{pt ? 'Editar categorias e itens' : 'Edit categories and items'}</h2>
                <button type="button" onClick={() => { setCategories(structuredClone(startingMenu)); setNewCategory(''); setFirstItemName(''); setFirstItemPrice(''); }} className={buttonClass}>
                  {pt ? 'Repor exemplo' : 'Reset example'}
                </button>
              </div>
              <div className="mt-5 space-y-5">
                {categories.map((category) => (
                  <section key={category.id} className="rounded-xl border border-[#e9e5db] p-4">
                    <div className="flex flex-wrap items-end gap-3">
                      <label className="min-w-[180px] flex-1 text-xs font-semibold text-[#555]">
                        {pt ? 'Nome da categoria' : 'Category name'}
                        <input value={category.name} maxLength={70} onChange={(event) => updateCategory(category.id, { name: event.target.value })} className={inputClass + ' mt-1'} />
                      </label>
                      <label className="text-xs font-semibold text-[#555]">
                        {pt ? 'Tipo' : 'Type'}
                        <select value={category.kind} onChange={(event) => updateCategory(category.id, { kind: event.target.value as 'food' | 'drinks' })} className={inputClass + ' mt-1'}>
                          <option value="food">{pt ? 'Comida' : 'Food'}</option>
                          <option value="drinks">{pt ? 'Bebidas' : 'Drinks'}</option>
                        </select>
                      </label>
                      <button type="button" onClick={() => setCategories((previous) => previous.filter((entry) => entry.id !== category.id))} className={buttonClass} aria-label={(pt ? 'Remover categoria ' : 'Remove category ') + category.name}>
                        {pt ? 'Remover' : 'Remove'}
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {category.items.map((item) => (
                        <div key={item.id} className="rounded-lg border border-[#eee9df] bg-[#fafafa] p-3">
                          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
                            <label className="text-xs font-semibold text-[#555]">
                              {pt ? 'Nome do item' : 'Item name'}
                              <input value={item.name} maxLength={100} onChange={(event) => updateItem(category.id, item.id, { name: event.target.value })} placeholder={pt ? 'Ex.: Prato do dia' : 'e.g. Daily special'} className={inputClass + ' mt-1'} />
                            </label>
                            <label className="text-xs font-semibold text-[#555]">
                              {pt ? 'Preço' : 'Price'} ({currency})
                              <input type="number" min="0" max="99999999" step={country === 'GB' ? '0.01' : '1'} value={item.price} onChange={(event) => {
                                const number = Number(event.target.value);
                                updateItem(category.id, item.id, { price: Number.isFinite(number) ? Math.min(99999999, Math.max(0, number)) : 0 });
                              }} className={inputClass + ' mt-1'} />
                            </label>
                          </div>
                          <label className="mt-3 block text-xs font-semibold text-[#555]">
                            {pt ? 'Descrição (opcional)' : 'Description (optional)'}
                            <input value={item.description ?? ''} maxLength={180} onChange={(event) => updateItem(category.id, item.id, { description: event.target.value })} className={inputClass + ' mt-1'} />
                          </label>
                          <button type="button" onClick={() => updateCategory(category.id, { items: category.items.filter((entry) => entry.id !== item.id) })} className="mt-2 text-xs font-semibold text-[#875f18] underline">
                            {pt ? 'Remover item' : 'Remove item'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addItem(category.id)} className={buttonClass + ' mt-4'}>
                      + {pt ? 'Adicionar item' : 'Add item'}
                    </button>
                  </section>
                ))}
              </div>
              <form onSubmit={addCategory} className="mt-5 rounded-xl border border-dashed border-[#c9ae6d] p-4">
                <h3 className="font-semibold">{pt ? 'Criar categoria personalizada' : 'Create a custom category'}</h3>
                <p className="mt-2 text-xs text-[#665e4f]">{pt ? 'Escolha qualquer nome de categoria. O preço pertence ao prato ou bebida, não à categoria. Pode adicionar o primeiro item já aqui.' : 'Choose any category name. Prices belong to dishes or drinks, not to the category. You can add the first item here.'}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_130px]">
                  <label className="text-xs font-semibold text-[#555]">
                    {pt ? 'Nome' : 'Name'}
                    <input required maxLength={70} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder={pt ? 'Ex.: Sobremesas' : 'e.g. Desserts'} className={inputClass + ' mt-1'} />
                  </label>
                  <label className="text-xs font-semibold text-[#555]">
                    {pt ? 'Tipo' : 'Type'}
                    <select value={newKind} onChange={(event) => setNewKind(event.target.value as 'food' | 'drinks')} className={inputClass + ' mt-1'}>
                      <option value="food">{pt ? 'Comida' : 'Food'}</option>
                      <option value="drinks">{pt ? 'Bebidas' : 'Drinks'}</option>
                    </select>
                  </label>
                </div>
                <div className="mt-4 grid gap-3 rounded-lg bg-[#fffaf0] p-3 sm:grid-cols-[minmax(0,1fr)_130px]">
                  <label className="text-xs font-semibold text-[#555]">
                    {pt ? 'Primeiro prato ou bebida (opcional)' : 'First dish or drink (optional)'}
                    <input value={firstItemName} maxLength={100} onChange={(event) => setFirstItemName(event.target.value)} placeholder={pt ? 'Ex.: Mufete' : 'e.g. Grilled fish'} className={inputClass + ' mt-1'} />
                  </label>
                  <label className="text-xs font-semibold text-[#555]">
                    {pt ? 'Preço do item' : 'Item price'} ({currency})
                    <input type="number" min="0" max="99999999" step="any" value={firstItemPrice} onChange={(event) => setFirstItemPrice(event.target.value)} placeholder={country === 'GB' ? '12.50' : '5500'} className={inputClass + ' mt-1'} />
                  </label>
                </div>
                <button type="submit" className="mt-3 rounded-lg bg-[#252a32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3d434d]">
                  + {pt ? 'Adicionar categoria' : 'Add category'}
                </button>
              </form>
            </section>
            <aside aria-label={pt ? 'Pré-visualização ao vivo' : 'Live preview'} className="self-start rounded-xl border border-[#e9e5db] bg-[#fffdf9] p-5 lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{pt ? 'Pré-visualização' : 'Live preview'}</h2>
                <span className="rounded-md bg-[#fff5d9] px-2 py-1 text-xs font-semibold text-[#75570d]">DEMO</span>
              </div>
              <p className="mt-2 text-xs text-[#777]">{pt ? 'Não publicado · Apenas nesta página' : 'Not published · This page only'}</p>
              {categories.length === 0 && <p className="mt-6 text-sm text-[#777]">{pt ? 'Adicione uma categoria para começar.' : 'Add a category to begin.'}</p>}
              {categories.map((category) => (
                <div key={category.id} className="mt-6 border-t border-[#e9e5db] pt-4">
                  <h3 className="font-semibold">{category.kind === 'food' ? (pt ? 'Comida · ' : 'Food · ') : (pt ? 'Bebidas · ' : 'Drinks · ')}{category.name.trim() || (pt ? 'Categoria sem nome' : 'Unnamed category')}</h3>
                  {category.items.filter((item) => item.name.trim()).map((item) => (
                    <div key={item.id} className="mt-3">
                      <div className="flex justify-between gap-3 text-sm"><span>{item.name}</span><span className="shrink-0 tabular-nums">{money(item.price)}</span></div>
                      {item.description && <p className="mt-1 text-xs text-[#777]">{item.description}</p>}
                    </div>
                  ))}
                </div>
              ))}
              <p className="mt-6 border-t border-[#e9e5db] pt-4 text-xs text-[#777]">
                {pt ? 'Os preços e alergénios devem ser confirmados pelo restaurante. Este editor é um protótipo de investigação.' : 'Prices and allergens must be confirmed by the restaurant. This editor is a research prototype.'}
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
