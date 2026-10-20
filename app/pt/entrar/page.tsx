'use client';
import { useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';

const t = translations.pt;

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-md mx-auto">
        <Link href="/pt" className="text-emerald-600 mb-6 inline-block">
          ← {t.common.backHome}
        </Link>

        <h1 className="text-3xl font-bold mb-2">{t.nav.signIn}</h1>
        <p className="text-slate-600 mb-8">Aceda à sua conta</p>

        <form className="bg-white p-8 rounded-2xl shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">{t.submit.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.submit.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="A sua palavra-passe"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 mt-2"
          >
            {t.nav.signIn}
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            Ainda não tem conta?{' '}
            <Link href="/pt/registar" className="text-emerald-600 hover:underline">
              {t.nav.signUp}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
