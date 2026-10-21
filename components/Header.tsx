'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const lang = path.startsWith('/en') ? 'en' : 'pt';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO — Left side, fixed position like OpenTable ✅ */}
        <Link href={`/${lang}`} className="flex items-center gap-0">
          <span className="text-xl font-bold text-emerald-600">Angola</span>
          <span className="text-xl font-bold text-amber-500">Lab</span>
        </Link>

        {/* NAVIGATION — Right side ✅ */}
        <nav className="flex items-center gap-6 text-sm">
          {lang === 'pt' ? (
            <>
              <Link href="/pt/restaurantes" className="text-slate-600 hover:text-slate-900">Restaurantes</Link>
              <Link href="/pt" className="text-slate-700 font-medium">PT</Link>
              <Link href="/en" className="text-slate-600 hover:text-slate-900">EN</Link>
              <Link href="/pt/entrar" className="text-slate-600 hover:text-slate-900">Entrar</Link>
              <Link href="/pt/registar" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Criar Conta</Link>
            </>
          ) : (
            <>
              <Link href="/en/restaurants" className="text-slate-600 hover:text-slate-900">Restaurants</Link>
              <Link href="/pt" className="text-slate-600 hover:text-slate-900">PT</Link>
              <Link href="/en" className="text-slate-700 font-medium">EN</Link>
              <Link href="/en/signin" className="text-slate-600 hover:text-slate-900">Sign In</Link>
              <Link href="/en/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
