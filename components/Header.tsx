'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { BUSINESS_TYPES } from '@/lib/business-types';

export default function Header() {
  const path = usePathname();
  const lang = path.startsWith('/en') ? 'en' : 'pt';
  const exploreRef = useRef<HTMLDetailsElement>(null);

  // Dismiss the menu when the visitor clicks elsewhere or presses Escape.
  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      const menu = exploreRef.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && exploreRef.current?.open) {
        exploreRef.current.open = false;
        exploreRef.current.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close Explore after navigating, including browser back/forward.
  useEffect(() => {
    if (exploreRef.current) exploreRef.current.open = false;
  }, [path]);

  const navLinkClass = 'rounded-md text-[#F2C94C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]';

  const exploreMenu = (
    <details ref={exploreRef} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-1 py-2 text-[#F2C94C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2C94C] [&::-webkit-details-marker]:hidden">
        {lang === 'pt' ? 'Explorar' : 'Explore'}
        <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute left-0 top-full z-[60] mt-2 w-60 rounded-xl border border-[#e4d5a6] bg-white p-2 text-sm text-[#242424] shadow-xl sm:left-auto sm:right-0">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#987515]">
          {lang === 'pt' ? 'Tipos de negócio' : 'Business types'}
        </p>
        {BUSINESS_TYPES.map((type) => type.id === 'restaurant' ? (
          <Link
            key={type.id}
            href={lang === 'pt' ? '/pt/restaurantes' : '/en/restaurants'}
            onClick={() => { if (exploreRef.current) exploreRef.current.open = false; }}
            className="block rounded-lg px-3 py-2.5 font-medium hover:bg-[#fbf7ed] focus-visible:outline-2 focus-visible:outline-[#b18a23]"
          >
            {type[lang]}
          </Link>
        ) : (
          <div key={type.id} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[#666]">
            <span>{type[lang]}</span>
            <span className="text-[10px] text-[#876613]">{lang === 'pt' ? 'Em breve' : 'Planned'}</span>
          </div>
        ))}
      </div>
    </details>
  );

  return (
<header className="sticky top-0 z-50 w-full bg-[#22262D] shadow-sm">   
      <div className="w-full flex flex-col items-start gap-y-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6 sm:px-8 lg:px-12">
       <Link
  href={`/${lang}`}
  className="inline-flex shrink-0 items-center gap-3 rounded-md text-xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]"
  aria-label="AngolaLab home"
>
  <Image
    src="/angolalab-icon-gold3.png"
    alt=""
    width={36}
    height={36}
    className="rounded-full"
    priority
  />

  <span>
    <span className="text-emerald-600">Angola</span>
    <span className="text-[#F2C94C]">Lab</span>
  </span>
</Link>
        <nav aria-label="Main navigation" className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-2 text-[clamp(0.68rem,2.9vw,0.875rem)] sm:ml-auto sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-x-6 sm:text-sm">
          {lang === 'pt' ? (
            <>
              {exploreMenu}
              <Link href="/pt/sobre" className={navLinkClass}>Sobre Nós</Link>
              <Link href="/pt" className={navLinkClass}>PT</Link>
              <Link href="/en" className={navLinkClass}>EN</Link>
              <Link href="/pt/entrar" className={navLinkClass}>Entrar</Link>
              <Link href="/pt/registar" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Criar Conta</Link>
            </>
          ) : (
            <>
              {exploreMenu}
              <Link href="/en/about" className={navLinkClass}>About Us</Link>
              <Link href="/pt" className={navLinkClass}>PT</Link>
              <Link href="/en" className={navLinkClass}>EN</Link>
              <Link href="/en/signin" className={navLinkClass}>Sign In</Link>
              <Link href="/en/signup" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Create Account</Link>
            </>
          )}
        </nav>
      </div>
      <div className="w-full h-0.5 bg-[#F2C94C]" />
    </header>
  );
}
