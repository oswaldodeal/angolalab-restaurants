import HomeDigitalCards from '@/components/HomeDigitalCards';
import Link from "next/link";

export default function EnglishHomePage() {
  return (
    <>
      {/* HERO */}
      <section className="lab-dark-section w-full px-6 py-12 md:py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Authentic food, near you
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-slate-300">
            Verified restaurants, real menus, trusted locations.
            Free to list, free to discover.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/en/restaurants"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-center text-lg font-medium text-white hover:bg-emerald-700"
            >
              Browse Restaurants
            </Link>

            <Link
              href="/en/restaurants/submit"
              className="rounded-lg border-2 border-emerald-400 px-8 py-3 text-center text-lg font-medium text-white hover:bg-white/10"
            >
              + Add Your Restaurant — Free
            </Link>
          </div>
        </div>
      </section>

      <HomeDigitalCards language="en" />

      {/* INFORMATION CARDS */}
      <section className="lab-dark-section px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Free for Everyone
            </h3>
            <p className="text-slate-600">
              Any restaurant in Angola can create a free listing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Verified by Our Team
            </h3>
            <p className="text-slate-600">
              We review businesses before awarding verification status.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Google Maps Directions
            </h3>
            <p className="text-slate-600">
              Find restaurant locations and directions.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}