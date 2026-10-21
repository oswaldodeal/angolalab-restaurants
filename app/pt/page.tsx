import Link from 'next/link'

export default function PortugueseHomePage() {
  return (
    <main>
      {/* HERO — No header above! Layout already has the header ✅ */}
    <section className="w-full bg-slate-50 py-10 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        Authentic food, near you
      </h1>

      <p className="text-slate-600 text-sm md:text-base mb-6 max-w-2xl">
        Verified restaurants, real menu, trusted locations. Free to list, free to discover.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/pt/restaurantes"
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          Browse Restaurants
        </Link>

        <Link
          href="/pt/restaurantes/registar"
          className="border border-emerald-600 text-emerald-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
        >
          Add Your Restaurant — Free
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Grátis para Todos</h3>
            <p className="text-slate-600">Qualquer restaurante em Angola pode publicar sem custos.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Verificado pela nossa equipa</h3>
            <p className="text-slate-600">Confirmamos cada estabelecimento. Só locais reais.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Direções no Google Maps</h3>
            <p className="text-slate-600">Coordenadas exatas — nunca se perde.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
