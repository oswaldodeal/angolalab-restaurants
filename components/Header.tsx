'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const lang = path.startsWith('/en') ? 'en' : 'pt';

  return (
    <header className="relative z-50 w-full bg-white">
      <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 sm:px-8 lg:px-12 py-3">
        <Link href={`/${lang}`} className="inline-flex shrink-0 items-center text-xl font-bold" aria-label="AngolaLab home">
          <span className="text-emerald-600">Angola</span><span className="text-amber-500">Lab</span>
        </Link>
        <nav aria-label="Main navigation" className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-3 text-sm sm:gap-x-6">
          {lang === 'pt' ? (
            <>
              <Link href="/pt/restaurantes" className="text-slate-600 hover:text-slate-900">Restaurantes</Link>
              <Link href="/pt" className="text-slate-700 font-medium">PT</Link>
              <Link href="/en" className="text-slate-600 hover:text-slate-900">EN</Link>
              <Link href="/pt/entrar" className="text-slate-600 hover:text-slate-900">Entrar</Link>
              <Link href="/pt/registar" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Criar Conta</Link>
            </>
          ) : (
            <>
              <Link href="/en/restaurants" className="text-slate-600 hover:text-slate-900">Restaurants</Link>
              <Link href="/pt" className="text-slate-600 hover:text-slate-900">PT</Link>
              <Link href="/en" className="text-slate-700 font-medium">EN</Link>
              <Link href="/en/signin" className="text-slate-600 hover:text-slate-900">Sign In</Link>
              <Link href="/en/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
