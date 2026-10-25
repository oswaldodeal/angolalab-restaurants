import Link from 'next/link';

export default function OwnerDashboardDemo({ language }: { language: 'pt' | 'en' }) {
  const pt = language === 'pt';
  const back = pt ? '/pt/restaurantes/rest-002' : '/en/restaurants/rest-002';
  const cards = [
    { label: pt ? 'Fotografia principal' : 'Main restaurant photograph', value: '1 / 1', detail: pt ? 'Incluída no Perfil Básico' : 'Included in Basic Profile' },
    { label: pt ? 'Fotografias das refeições' : 'Meal photographs', value: '2 / 2', detail: pt ? 'Pequeno-almoço e almoço' : 'Breakfast and lunch' },
  ];
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#242424]">
      <div className="mx-auto max-w-5xl border-x border-[#e9e5db] bg-white px-5 py-10 sm:px-10 lg:px-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#987515]">
          {pt ? 'AngolaLab · Demonstração da área do proprietário' : 'AngolaLab · Owner area demonstration'}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {pt ? 'Painel do proprietário' : 'Owner dashboard'}
        </h1>
        <p className="mt-3 text-[#555]">{pt ? 'Perfil Básico · Restaurante de demonstração' : 'Basic Profile · Demonstration restaurant'}</p>
        <div className="mt-7 h-[2px] bg-[#D2AC37]" />
        <div role="note" className="mt-7 border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-5 py-4 text-sm leading-relaxed">
          {pt
            ? 'Pré-visualização de design. Esta página não é uma conta privada, não permite carregar imagens e não contém dados reais de proprietários.'
            : 'Design preview only. This page is not a private account, cannot upload images and contains no real owner information.'}
        </div>
        <section className="mt-8">
          <h2 className="text-xl font-semibold">{pt ? 'Limites do Perfil Básico' : 'Basic Profile allowances'}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div key={card.label} className="rounded-xl border border-[#e9e5db] p-6">
                <h3 className="font-semibold">{card.label}</h3>
                <p className="mt-4 text-3xl font-semibold text-[#866415]">{card.value}</p>
                <p className="mt-2 text-sm text-[#555]">{card.detail}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-7 rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-6">
          <h2 className="text-lg font-semibold">{pt ? 'Mais fotografias' : 'More photographs'}</h2>
          <p className="mt-3 text-[#555]">{pt ? 'Verifique a sua empresa para adicionar mais imagens.' : 'Verify your business to add more images.'}</p>
          <p className="mt-3 text-sm text-[#866415]">{pt ? 'A verificação depende da análise de evidências e não é garantida pelo pagamento.' : 'Verification depends on evidence review and is not guaranteed by payment.'}</p>
          <button type="button" disabled className="mt-5 cursor-not-allowed rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white opacity-60">
            {pt ? 'Carregar mais imagens · Em desenvolvimento' : 'Upload more images · In development'}
          </button>
        </section>
        <Link href={back} className="mt-8 inline-block font-semibold text-[#876613] hover:underline">
          ← {pt ? 'Ver perfil de demonstração' : 'View demonstration profile'}
        </Link>
      </div>
    </main>
  );
}
