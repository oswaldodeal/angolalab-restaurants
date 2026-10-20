import Link from 'next/link';
import { translations } from '@/lib/translations';
import { initialRestaurants, CUISINES, CITIES, getGoogleMapsUrl } from '@/lib/store';

const t = translations.en;

export default function RestaurantsListPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/en" className="text-2xl font-bold text-emerald-700">
            AngolaLab 🍽️
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/en/restaurants" className="text-emerald-600 font-medium">
              {t.nav.restaurants}
            </Link>
            <Link href="/pt" className="text-sm text-slate-500 hover:text-emerald-600">
              PT
            </Link>
            <Link href="/en/signin" className="text-slate-600 hover:text-emerald-600">
              {t.nav.signIn}
            </Link>
            <Link
              href="/en/signup"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              {t.nav.signUp}
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">{t.home.browseRestaurants}</h1>
        <p className="text-slate-600 mb-8">Discover verified restaurants across Angola</p>

        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white">
            <option value="">All Cities</option>
            {CITIES.map(city => (
              <option key={city.id} value={city.id}>{city.en}</option>
            ))}
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white">
            <option value="">All Cuisines</option>
            {CUISINES.map(cuisine => (
              <option key={cuisine.id} value={cuisine.id}>{cuisine.en}</option>
            ))}
          </select>
          <Link
            href="/en/restaurants/submit"
            className="ml-auto bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100"
          >
            + {t.home.addRestaurant}
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialRestaurants.map(restaurant => {
            const cuisineLabel = CUISINES.find(c => c.id === restaurant.cuisine)?.en || restaurant.cuisine;
            const cityLabel = CITIES.find(c => c.id === restaurant.city)?.en || restaurant.city;
            const mapsUrl = getGoogleMapsUrl(restaurant);

            return (
              <div key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-40 bg-emerald-50 flex items-center justify-center text-4xl">
                  🍽️
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{cuisineLabel} · {cityLabel}</p>
                  <p className="text-slate-600 text-sm mb-4">{restaurant.neighbourhood}, {restaurant.address}</p>

                  <p className={`text-sm font-medium mb-3 ${
                    restaurant.status === 'verified' ? 'text-emerald-600' :
                    restaurant.status === 'basic' ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {restaurant.status === 'verified' && t.restaurant.statusVerified}
                    {restaurant.status === 'basic' && t.restaurant.statusBasic}
                    {restaurant.status === 'pending' && t.restaurant.statusPending}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                    >
                      🗺️ {t.restaurant.viewMap}
                    </a>
                    {restaurant.status === 'verified' ? (
                      <Link
                        href={`/en/restaurants/${restaurant.id}`}
                        className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                      >
                        📖 {t.restaurant.viewMenu}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400 px-3 py-1.5">
                        ⏳ {t.restaurant.menuComing}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-10 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2 text-white font-semibold">AngolaLab</p>
          <p className="text-sm">© 2026 AngolaLab — {t.footer.allRights}</p>
        </div>
      </footer>
    </main>
  );
}
