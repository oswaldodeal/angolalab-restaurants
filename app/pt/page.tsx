import Link from 'next/link'

export default function PortugueseHomePage() {
  return (
    <main>
      {/* HERO — No header above! Layout already has the header ✅ */}
      <section className="w-full bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Comida autêntica, perto de si
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Restaurantes verificados, ementas reais, locais de confiança. Grátis para listar, grátis para descobrir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pt/restaurantes" className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700">
              Ver Restaurantes
            </Link>
            <Link href="/pt/restaurantes/registar" className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-50">
              + Adicionar Restaurante — Grátis
            </Link>
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
