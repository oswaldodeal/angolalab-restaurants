'use client';

import { useId, useState, type ReactNode } from 'react';

export default function FeaturedMenuCategories({ language, children }: { language: 'pt' | 'en'; children: ReactNode }) {
  const [selected, setSelected] = useState('all');
  const panelId = useId();
  const pt = language === 'pt';
  const categories = [
    { id: 'all', label: pt ? 'Todos' : 'All' },
    { id: 'mains', label: pt ? 'Pratos principais' : 'Main courses' },
    { id: 'drinks', label: pt ? 'Bebidas' : 'Drinks' },
    { id: 'desserts', label: pt ? 'Sobremesas' : 'Desserts' },
  ];

  return (
    <>
      <div role="group" aria-label={pt ? 'Categorias da ementa' : 'Menu categories'} className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-b border-[#e9e5db]">
        {categories.map(category => (
          <button key={category.id} type="button" aria-pressed={selected === category.id} aria-controls={panelId}
            onClick={() => setSelected(category.id)}
            className={`min-h-11 border-b-2 px-1 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${selected === category.id ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-[#555] hover:text-emerald-800'}`}>
            {category.label}
          </button>
        ))}
      </div>
      <div id={panelId}>
        {selected === 'all' || selected === 'mains' ? children : (
          <p role="status" className="mt-5 rounded-lg bg-white p-4 text-sm text-[#555]">
            {pt ? 'A ementa completa está disponível em perfis Verificados.' : 'The full menu is available on Verified profiles.'}
          </p>
        )}
      </div>
    </>
  );
}
