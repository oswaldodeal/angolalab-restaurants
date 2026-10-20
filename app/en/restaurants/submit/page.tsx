'use client';
import { useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { CUISINES, CITIES } from '@/lib/store';

const t = translations.en;

export default function SubmitRestaurantPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-3">Submitted!</h2>
          <p className="text-slate-600 mb-6">{t.submit.successMessage}</p>
          <Link
            href="/en/restaurants"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            {t.home.browseRestaurants}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/en/restaurants" className="text-emerald-600 mb-6 inline-block">
          ← {t.common.backHome}
        </Link>

        <h1 className="text-3xl font-bold mb-2">{t.submit.title}</h1>
        <p className="text-slate-600 mb-8">{t.submit.subtitle}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-8"
        >
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-5">👤 {t.submit.ownerSection}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.fullName} *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.email} *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.phone} *</label>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    required
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+244 9XX XXX XXX"
                  />
                  <button
                    type="button"
                    className="bg-slate-100 px-4 py-2.5 rounded-lg hover:bg-slate-200 whitespace-nowrap"
                  >
                    {t.submit.sendCode}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Verification Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.password} *</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">🪪 {t.submit.idPhoto} *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">{t.submit.idNote}</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-5">🍽️ {t.submit.restaurantSection}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.name} *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Restaurant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.cuisineType} *</label>
                <select
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t.submit.selectCuisine}</option>
                  {CUISINES.map(c => (
                    <option key={c.id} value={c.id}>{c.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <select
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t.submit.selectCity}</option>
                  {CITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.fullAddress} *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Street, neighbourhood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.submit.openingHours}</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Mon–Sat: 08:00 – 22:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">📖 {t.submit.menuUpload}</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">📷 {t.submit.restaurantPhotos}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            ✅ {t.submit.submitButton}
          </button>
        </form>
      </div>
    </main>
  );
}
