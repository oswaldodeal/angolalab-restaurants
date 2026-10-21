import Link from 'next/link';

export default function PortugueseHomePage() {
  return (
    <>
      <section className="relative w-full bg-slate-100 px-6 py-12 md:py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Comida autêntica, perto de si
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-600">
            Restaurantes verificados, ementas reais, locais de confiança. Grátis para listar, grátis para descobrir.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/pt/restaurantes" className="rounded-lg bg-emerald-600 px-8 py-3 text-center text-lg font-medium text-white hover:bg-emerald-700">
              Ver Restaurantes
            </Link>
            <Link href="/pt/restaurantes/registar" className="rounded-lg border-2 border-emerald-600 px-8 py-3 text-center text-lg font-medium text-emerald-600 hover:bg-emerald-50">
              + Adicionar Restaurante — Grátis
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Grátis para Todos</h3>
            <p className="text-slate-600">Qualquer restaurante em Angola pode publicar sem custos.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Verificado pela nossa equipa</h3>
            <p className="text-slate-600">Confirmamos cada estabelecimento. Só locais reais.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Direções no Google Maps</h3>
            <p className="text-slate-600">Coordenadas exatas — nunca se perde.</p>
          </div>
        </div>
      </section>
    </>
  );
}
