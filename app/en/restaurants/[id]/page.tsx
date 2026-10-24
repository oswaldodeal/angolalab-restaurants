import Link from 'next/link';
import { notFound } from 'next/navigation';
import { translations } from '@/lib/translations';
import { initialRestaurants, CUISINES, CITIES, getGoogleMapsUrl } from '@/lib/store';

const t = translations.en;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;

  const restaurant = initialRestaurants.find(
    (r) => r.id === id
  );

  if (!restaurant) notFound();

  const cuisineLabel = CUISINES.find(c => c.id === restaurant.cuisine)?.en || restaurant.cuisine;
  const cityLabel = CITIES.find(c => c.id === restaurant.city)?.en || restaurant.city;
  const mapsUrl = getGoogleMapsUrl(restaurant);
  const isVerified = restaurant.status === 'verified';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          <Link href="/pt" className="text-sm text-slate-500 hover:text-emerald-600">
            PT
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-slate-600 mb-4">{cuisineLabel} · {cityLabel} · {restaurant.neighbourhood}</p>
          <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            restaurant.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
            restaurant.status === 'basic' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {restaurant.status === 'verified' && t.restaurant.statusVerified}
            {restaurant.status === 'basic' && t.restaurant.statusBasic}
            {restaurant.status === 'pending' && t.restaurant.statusPending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="font-semibold mb-3">📍 {t.restaurant.address}</h2>
          <p className="text-slate-600 mb-4">{restaurant.address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700"
          >
            🗺️ {t.restaurant.viewMap}
          </a>
        </div>

        {isVerified && (
          <>
            {restaurant.hours && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h2 className="font-semibold mb-3">⏰ {t.restaurant.hours}</h2>
                <p className="text-slate-600">{restaurant.hours}</p>
              </div>
            )}

            {restaurant.phone && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h2 className="font-semibold mb-3">📞 {t.restaurant.phone}</h2>
                <a href={`tel:${restaurant.phone}`} className="text-emerald-600 hover:underline">
                  {restaurant.phone}
                </a>
              </div>
            )}

            {restaurant.description && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h2 className="font-semibold mb-3">ℹ️ About</h2>
                <p className="text-slate-600">{restaurant.description}</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="font-semibold mb-3">📖 {t.restaurant.viewMenu}</h2>
              <p className="text-slate-500 italic">Menu will appear here once fully verified.</p>
            </div>
          </>
        )}

        {!isVerified && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
            <p className="text-amber-700">⏳ {t.restaurant.menuComing}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
          <h2 className="font-semibold mb-4">💬 {t.restaurant.commentsTitle}</h2>
          <p className="text-slate-500 mb-3">{t.restaurant.commentsOnlyVerified}</p>
          <Link
            href="/en/signin"
            className="inline-block bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
          >
            🔐 {t.restaurant.signInToComment}
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-10 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-2 text-white font-semibold">AngolaLab</p>
          <p className="text-sm">© 2026 AngolaLab — {t.footer.allRights}</p>
        </div>
      </footer>
    </main>
  );
}
