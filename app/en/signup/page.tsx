'use client';
import { useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';

const t = translations.en;

export default function SignUpPage() {
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-3">Account Created!</h2>
          <p className="text-slate-600 mb-6">Welcome to AngolaLab. Your account will be verified shortly.</p>
          <Link
            href="/en"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-md mx-auto">
        <Link href="/en" className="text-emerald-600 mb-6 inline-block">
          ← {t.common.backHome}
        </Link>

        <h1 className="text-3xl font-bold mb-2">{t.nav.signUp}</h1>
        <p className="text-slate-600 mb-8">Join the AngolaLab community</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep('success');
          }}
          className="bg-white p-8 rounded-2xl shadow-sm space-y-5"
        >
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
                className="bg-slate-100 px-4 py-2.5 rounded-lg hover:bg-slate-200 whitespace-nowrap text-sm"
              >
                {t.submit.sendCode}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Verification Code *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter code from SMS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.submit.password} *</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Create a secure password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">🪪 ID / Passport Photo *</label>
            <input
              type="file"
              accept="image/*,.pdf"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Stored securely — never shown publicly.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 mt-2"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/en/signin" className="text-emerald-600 hover:underline">
              {t.nav.signIn}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
