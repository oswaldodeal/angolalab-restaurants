import Link from 'next/link';
import { translations } from '@/lib/translations';

const t = translations.pt;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/pt" className="text-2xl font-bold text-emerald-700">
            AngolaLab 🍽️
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/pt/restaurantes" className="text-slate-600 hover:text-emerald-600">
              {t.nav.restaurants}
            </Link>
            <Link href="/en" className="text-sm text-slate-500 hover:text-emerald-600">
              EN
            </Link>
            <Link href="/pt/entrar" className="text-slate-600 hover:text-emerald-600">
              {t.nav.signIn}
            </Link>
            <Link
              href="/pt/registar"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {t.nav.signUp}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.home.title}</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          {t.home.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pt/restaurantes"
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            🍽️ {t.home.browseRestaurants}
          </Link>
          <Link
            href="/pt/restaurantes/registar"
            className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-50 transition-colors"
          >
            + {t.home.addRestaurant}
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-semibold mb-3">🆓 {t.home.featureFreeTitle}</h3>
            <p className="text-slate-600">{t.home.featureFreeDesc}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-semibold mb-3">🛡️ {t.home.featureVerifiedTitle}</h3>
            <p className="text-slate-600">{t.home.featureVerifiedDesc}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-semibold mb-3">🗺️ {t.home.featureMapTitle}</h3>
            <p className="text-slate-600">{t.home.featureMapDesc}</p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-slate-900 text-slate-300 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2 text-white font-semibold">AngolaLab</p>
          <p className="text-sm">© 2026 AngolaLab — {t.footer.allRights}</p>
        </div>
      </footer>
    </main>
  );
}
