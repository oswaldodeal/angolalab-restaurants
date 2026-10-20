'use client';
import { useState } from 'react';
import Link from 'next/link';
import { initialRestaurants, Restaurant } from '@/lib/store';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  // Simple check — we'll upgrade to real auth later
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password — try again');
    }
  };

  const toggleVerify = (id: string) => {
    setRestaurants(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: r.status === 'verified' ? 'basic' : 'verified',
              verifiedAt: r.status === 'verified' ? undefined : new Date().toISOString(),
            }
          : r
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">🔐 Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700"
            >
              Sign In to Dashboard
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            ← <Link href="/" className="text-emerald-600">Back to site</Link>
          </p>
        </div>
      </main>
    );
  }

  const pending = restaurants.filter(r => r.status === 'pending');
  const basic = restaurants.filter(r => r.status === 'basic');
  const verified = restaurants.filter(r => r.status === 'verified');

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🛡️ Admin Dashboard</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/pt" className="text-slate-300 hover:text-white">PT Site</Link>
            <Link href="/en" className="text-slate-300 hover:text-white">EN Site</Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-red-400 hover:text-white"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
            <p className="text-sm text-amber-700">Under Review</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <p className="text-2xl font-bold text-slate-600">{basic.length}</p>
            <p className="text-sm text-slate-500">Basic Listings</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
            <p className="text-2xl font-bold text-emerald-600">{verified.length}</p>
            <p className="text-sm text-emerald-700">Verified ✅</p>
          </div>
        </div>

        {/* All Listings */}
        <h2 className="text-xl font-semibold mb-4">All Listings</h2>
        <div className="space-y-4">
          {restaurants.map(r => (
            <ListingCard
              key={r.id}
              restaurant={r}
              onToggleVerify={() => toggleVerify(r.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ListingCard({ restaurant, onToggleVerify }: { restaurant: Restaurant; onToggleVerify: () => void }) {
  const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    basic: 'bg-slate-100 text-slate-600',
    verified: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <p className="text-sm text-slate-500">{restaurant.address} · {restaurant.city}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[restaurant.status]}`}>
            {restaurant.status === 'pending' && '⏳ Under Review'}
            {restaurant.status === 'basic' && '📋 Basic Listing'}
            {restaurant.status === 'verified' && '✅ Verified'}
          </span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onToggleVerify}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              restaurant.status === 'verified'
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {restaurant.status === 'verified' ? 'Unverify' : '✓ Verify'}
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200">
            📍 Add GPS
          </button>
        </div>
      </div>
    </div>
  );
}
