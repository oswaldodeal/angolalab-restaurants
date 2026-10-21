import Link from 'next/link'

export default function EnglishHomePage() {
  return (
    <main>
      {/* HERO — No header above! Layout already has the header ✅ */}
      <section className="w-full bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Authentic food, near you
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Verified restaurants, real menus, trusted locations. Free to list, free to discover.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/restaurants" className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700">
              Browse Restaurants
            </Link>
            <Link href="/en/restaurants/submit" className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-50">
              + Add Your Restaurant — Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Free Forever</h3>
            <p className="text-slate-600">Every restaurant in Angola can list at no cost.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Verified by Us</h3>
            <p className="text-slate-600">We check every listing. Only real businesses.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Google Maps Directions</h3>
            <p className="text-slate-600">Exact coordinates — never get lost.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
