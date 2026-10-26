import type { Restaurant } from '@/lib/store';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  dietaryLabels?: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  kind: 'food' | 'drinks';
  items: MenuItem[];
};

// Categories are restaurant-defined, not restricted to a fixed list.
// These are fictional research examples only; no live owner editing or data persistence.
const manchesterMenu: MenuCategory[] = [
  {
    id: 'specialities', name: 'House Specialities', kind: 'food',
    items: [
      { id: 'dish-1', name: 'House stew with rice', price: 14.5, description: 'Illustrative main course' },
      { id: 'dish-2', name: 'Grilled vegetable plate', price: 11.95, description: 'Illustrative main course' },
      { id: 'dish-3', name: 'Chef’s seasonal dish', price: 16.0, description: 'Illustrative special' },
    ],
  },
  {
    id: 'hot-drinks', name: 'Hot Drinks', kind: 'drinks',
    items: [
      { id: 'drink-1', name: 'Espresso', price: 2.5 },
      { id: 'drink-2', name: 'Tea', price: 2.75 },
    ],
  },
  {
    id: 'cold-drinks', name: 'Cold Drinks', kind: 'drinks',
    items: [
      { id: 'drink-3', name: 'Orange juice', price: 3.25 },
      { id: 'drink-4', name: 'Still water', price: 1.95 },
    ],
  },
];

const luandaMenu: MenuCategory[] = [
  {
    id: 'pratos', name: 'Pratos da casa', kind: 'food',
    items: [
      { id: 'ao-1', name: 'Prato tradicional da casa', price: 5500 },
      { id: 'ao-2', name: 'Peixe grelhado com acompanhamento', price: 6200 },
    ],
  },
  {
    id: 'bebidas', name: 'Bebidas sem álcool', kind: 'drinks',
    items: [
      { id: 'ao-3', name: 'Sumo natural', price: 1200 },
      { id: 'ao-4', name: 'Água', price: 700 },
    ],
  },
];

export default function RestaurantMenuPreview({
  restaurant, language,
}: {
  restaurant: Restaurant;
  language: 'pt' | 'en';
}) {
  const pt = language === 'pt';
  const isDemo = restaurant.ownerId === 'demo';
  const isBasic = restaurant.status !== 'verified';
  // No fictional menu should appear on real restaurant profiles.
  if (!isDemo) return null;
  const categories = restaurant.country === 'GB' ? manchesterMenu : luandaMenu;
  const currency = restaurant.country === 'GB' ? 'GBP' : 'AOA';
  const formatPrice = (value: number) =>
    new Intl.NumberFormat(pt ? 'pt-PT' : 'en-GB', { style: 'currency', currency }).format(value);

  return (
    <section className="mt-7 rounded-xl border border-[#e9e5db] bg-[#fffdf9] p-5 sm:p-7" aria-label={pt ? 'Pré-visualização da ementa' : 'Menu preview'}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{pt ? 'Ementa · Comida e bebidas' : 'Menu · Food & drinks'}</h3>
          <p className="mt-2 text-sm text-[#655b48]">
            {pt ? 'Exemplo fictício de categorias e preços. Não representa uma ementa real.' : 'Fictional example of categories and prices. Not a real restaurant menu.'}
          </p>
        </div>
        <span className="rounded-md border border-[#dec68b] bg-[#fff5d9] px-3 py-1.5 text-xs font-semibold text-[#75570d]">
          {pt ? 'Apenas demonstração' : 'Demo only'}
        </span>
      </div>
      <div className="relative mt-6">
        <div className={isBasic ? 'max-h-64 overflow-hidden' : ''}>
          <div className="space-y-6">
            {categories.map((category) => (
              <section key={category.id} className="border-t border-[#e9e5db] pt-5">
                <h4 className="font-semibold text-[#292929]">
                  {category.kind === 'drinks' ? (pt ? 'Bebidas · ' : 'Drinks · ') : (pt ? 'Comida · ' : 'Food · ')}
                  {category.name}
                </h4>
                <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <div key={item.id} className="min-w-0">
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="shrink-0 tabular-nums">{formatPrice(item.price)}</span>
                      </div>
                      {item.description && <p className="mt-1 text-xs text-[#666]">{item.description}</p>}
                      {item.dietaryLabels?.length ? <p className="mt-1 text-xs text-[#666]">{item.dietaryLabels.join(' · ')}</p> : null}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        {isBasic && (
          <div className="relative -mt-20 flex min-h-44 flex-col items-center justify-end bg-gradient-to-b from-transparent via-[#fffdf9]/95 to-[#fffdf9] px-3 pb-2 text-center">
            <p className="font-semibold text-[#5d4716]">🔒 {pt ? 'Ementa completa disponível nos perfis Verificados' : 'Full menu available on Verified profiles'}</p>
            <p className="mt-2 max-w-md text-sm text-[#665e4f]">
              {pt ? 'O perfil Básico mantém duas refeições em destaque. A ementa completa e as bebidas exigem a verificação da empresa.' : 'Basic profiles show two featured meals. Full food and drinks menus require business verification.'}
            </p>
            <span className="mt-3 rounded-lg border border-[#c9ae6d] bg-white px-4 py-2 text-sm font-semibold text-[#75570d]">
              {pt ? 'Funcionalidade futura · Sem acesso nesta demonstração' : 'Planned feature · Not available in this demo'}
            </span>
          </div>
        )}
      </div>
      <p className="mt-5 border-t border-[#e9e5db] pt-4 text-xs leading-relaxed text-[#777]">
        {pt ? 'Os proprietários poderão criar as suas próprias categorias e itens numa versão futura. Os preços e alergénios deverão ser confirmados diretamente com o restaurante.' : 'Owners will be able to create their own categories and items in a future release. Confirm prices and allergens directly with the restaurant.'}
      </p>
    </section>
  );
}
