import Link from 'next/link';

export default function PortugueseHomePage() {
  return (
    <>
      {/* HERO — Light Grey, Fixed Position ✅ */}
      <section className="w-full bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comida autêntica, perto de si
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            Restaurantes verificados, ementas reais, locais de confiança. Grátis para listar, grátis para descobrir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pt/restaurantes"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700"
            >
              Ver Restaurantes
            </Link>
            <Link
              href="/pt/restaurantes/registar"
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-50"
            >
              + Adicionar Restaurante — Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Content Area — White Cards on Light Grey Body */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Grátis para Todos</h3>
            <p className="text-slate-600">Qualquer restaurante em Angola pode publicar sem custos.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Verificado pela nossa equipa</h3>
            <p className="text-slate-600">Confirmamos cada estabelecimento. Só locais reais.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Direções no Google Maps</h3>
            <p className="text-slate-600">Coordenadas exatas — nunca se perde.</p>
          </div>
        </div>
      </section>
    </>
  );
}
