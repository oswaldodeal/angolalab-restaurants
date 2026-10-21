import Link from 'next/link';
import { translations } from '@/lib/translations';

const t = translations.en;

export default function HomePage() {
  return (
    <main>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.home.title}</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          {t.home.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/en/restaurants"
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            🍽️ {t.home.browseRestaurants}
          </Link>
          <Link
            href="/en/restaurants/submit"
            className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-50 transition-colors"
          >
            + {t.home.addRestaurant}
          </Link>
        </div>
      </section>

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

      <footer className="bg-slate-900 text-slate-300 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2 text-white font-semibold">AngolaLab</p>
          <p className="text-sm">© 2026 AngolaLab — {t.footer.allRights}</p>
        </div>
      </footer>
    </main>
  );
}
