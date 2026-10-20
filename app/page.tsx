'use client';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    window.location.href = '/pt';
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <p>Redirecting… → <a href="/pt" className="text-emerald-400">Go to AngolaLab</a></p>
    </div>
  );
}
