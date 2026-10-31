'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { BUSINESS_TYPES } from '@/lib/business-types';

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const lang = path.startsWith('/en') ? 'en' : 'pt';
  const exploreRef = useRef<HTMLDetailsElement>(null);
  const languageRef = useRef<HTMLDetailsElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const languagePath = (target: 'pt' | 'en') => {
    const suffix = path.startsWith('/en/professionals') || path.startsWith('/pt/profissionais') ? (target === 'pt' ? '/profissionais' : '/professionals')
      : path.startsWith('/en/cards') || path.startsWith('/pt/cartoes') ? (target === 'pt' ? '/cartoes' : '/cards')
      : path.startsWith('/en/restaurants/submit') || path.startsWith('/pt/restaurantes/registar') ? (target === 'pt' ? '/restaurantes/registar' : '/restaurants/submit')
      : path.startsWith('/en/restaurants') || path.startsWith('/pt/restaurantes') ? (target === 'pt' ? '/restaurantes' : '/restaurants')
      : path.startsWith('/en/about') || path.startsWith('/pt/sobre') ? (target === 'pt' ? '/sobre' : '/about')
      : path.startsWith('/en/signin') || path.startsWith('/pt/entrar') ? (target === 'pt' ? '/entrar' : '/signin')
      : path.startsWith('/en/signup') || path.startsWith('/pt/registar') ? (target === 'pt' ? '/registar' : '/signup')
      : path.startsWith('/en/menu-editor') || path.startsWith('/pt/editor-ementa') ? (target === 'pt' ? '/editor-ementa' : '/menu-editor')
      : path.startsWith('/en/owner/demo') || path.startsWith('/pt/proprietario/demo') ? (target === 'pt' ? '/proprietario/demo' : '/owner/demo')
      : '';
    return `/${target}${suffix}`;
  };

  // Dismiss the menu when the visitor clicks elsewhere or presses Escape.
  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      for (const menu of [exploreRef.current, languageRef.current, mobileRef.current]) {
        if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        for (const menu of [exploreRef.current, languageRef.current]) {
          if (menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
        }
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
    if (languageRef.current) languageRef.current.open = false;
    if (mobileRef.current) mobileRef.current.open = false;
  }, [path]);

  const switchLanguage = (event: React.MouseEvent<HTMLAnchorElement>, target: 'pt' | 'en') => {
    if (languageRef.current) languageRef.current.open = false;
    if (path !== '/en' && path !== '/pt') return;
    const details = document.getElementById('home-digital-connections-details') as HTMLDetailsElement | null;
    const rect = document.getElementById('home-digital-cards')?.getBoundingClientRect();
    const viewingConnections = !!rect && rect.top < window.innerHeight && rect.bottom > 0;
    if (!viewingConnections && !details?.open) return;
    event.preventDefault();
    router.push(`/${target}${details?.open ? '?connections=open' : ''}#home-digital-cards`);
  };

  const navLinkClass = 'rounded-md text-[#F2C94C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]';

  const languageMenu = (
    <details ref={languageRef} className="group relative">
      <summary aria-label={lang === 'pt' ? 'Escolher idioma' : 'Choose language'} className="flex cursor-pointer list-none items-center gap-1 rounded-md px-1 py-2 text-[#F2C94C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">🌐</span> {lang.toUpperCase()} <span aria-hidden="true" className="text-xs group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute right-0 top-full z-[70] mt-2 min-w-40 rounded-xl border border-[#e4d5a6] bg-white p-2 text-sm text-[#242424] shadow-xl">
        <Link href={languagePath('pt')} hrefLang="pt" lang="pt" aria-current={lang === 'pt' ? 'page' : undefined}
          onClick={(event) => switchLanguage(event, 'pt')}
          className="block rounded-lg px-3 py-2.5 hover:bg-[#fbf7ed] focus-visible:outline-2 focus-visible:outline-[#b18a23]">
          🇵🇹 Português {lang === 'pt' ? '✓' : ''}
        </Link>
        <Link href={languagePath('en')} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'page' : undefined}
          onClick={(event) => switchLanguage(event, 'en')}
          className="block rounded-lg px-3 py-2.5 hover:bg-[#fbf7ed] focus-visible:outline-2 focus-visible:outline-[#b18a23]">
          🇬🇧 English {lang === 'en' ? '✓' : ''}
        </Link>
      </div>
    </details>
  );

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
        <div className="my-2 border-t border-[#e9e5db]" />
        <Link
          href={lang === 'pt' ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}
          onClick={() => { if (exploreRef.current) exploreRef.current.open = false; }}
          className="block rounded-lg bg-[#fff8e6] px-3 py-3 font-semibold text-[#76570f] hover:bg-[#f9edcb] focus-visible:outline-2 focus-visible:outline-[#b18a23]"
        >
          {lang === 'pt' ? '🧱 Demonstração de Perfis Adaptáveis' : '🧱 Adaptive Profile Demo'}
          <span className="mt-1 block text-xs font-normal text-[#6e675a]">
            {lang === 'pt' ? 'Pré-visualizar seis tipos de negócio' : 'Preview six business types'}
          </span>
        </Link>
      </div>
    </details>
  );

  return (
<header className="sticky top-0 z-50 w-full max-w-full bg-[#22262D] shadow-sm">   
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
       <Link
  href={`/${lang}`}
  className="inline-flex min-w-0 shrink-0 items-center gap-2 rounded-md text-lg font-bold sm:gap-3 sm:text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]"
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
        <nav aria-label="Main navigation" className="hidden min-w-0 items-center justify-end gap-x-4 text-sm lg:ml-auto lg:flex xl:gap-x-6">
          {lang === 'pt' ? (
            <>
              {exploreMenu}
              <Link href="/pt/cartoes" className={navLinkClass}>Cartões Digitais</Link>
              <Link href="/pt/sobre" className={navLinkClass}>Sobre Nós</Link>
              {languageMenu}
              <Link href="/pt/entrar" className={navLinkClass}>Entrar</Link>
              <Link href="/pt/registar" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Criar Conta</Link>
            </>
          ) : (
            <>
              {exploreMenu}
              <Link href="/en/cards" className={navLinkClass}>Digital Cards</Link>
              <Link href="/en/about" className={navLinkClass}>About Us</Link>
              {languageMenu}
              <Link href="/en/signin" className={navLinkClass}>Sign In</Link>
              <Link href="/en/signup" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Create Account</Link>
            </>
          )}
        </nav>
        <details ref={mobileRef} className="group relative ml-auto lg:hidden">
          <summary aria-label={lang === 'pt' ? 'Abrir menu de navegação' : 'Open navigation menu'}
            className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-[#b28b29] px-3 py-2 text-sm font-semibold text-[#F2C94C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="text-lg">☰</span>
            {lang === 'pt' ? 'Menu' : 'Menu'}
            <span aria-hidden="true" className="text-xs group-open:rotate-180">▾</span>
          </summary>
          <nav aria-label={lang === 'pt' ? 'Navegação móvel' : 'Mobile navigation'}
            className="absolute right-0 top-full z-[80] mt-3 w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-[#b28b29] bg-[#22262D] p-3 text-sm shadow-2xl">
            <div className="flex flex-col gap-1">
              <Link href={`/${lang}`} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Início' : 'Home'}</Link>
              <Link href={lang === 'pt' ? '/pt/restaurantes' : '/en/restaurants'} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Restaurantes' : 'Restaurants'}</Link>
              <Link href={lang === 'pt' ? '/pt/cartoes' : '/en/cards'} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Cartões Digitais' : 'Digital Cards'}</Link>
              <Link href={lang === 'pt' ? '/pt/sobre' : '/en/about'} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Sobre Nós' : 'About Us'}</Link>
              <div className="my-1 border-t border-[#585047]" />
              <p className="px-3 pt-2 text-xs font-semibold text-[#d8c68d]">{lang === 'pt' ? 'Idioma' : 'Language'}</p>
              <div className="flex flex-wrap gap-2 px-3 py-2">
                <Link href={languagePath('pt')} hrefLang="pt" lang="pt" onClick={event => switchLanguage(event, 'pt')}
                  aria-current={lang === 'pt' ? 'page' : undefined} className="rounded-lg border border-[#73633a] px-3 py-2 text-[#F2C94C]">PT {lang === 'pt' ? '✓' : ''}</Link>
                <Link href={languagePath('en')} hrefLang="en" lang="en" onClick={event => switchLanguage(event, 'en')}
                  aria-current={lang === 'en' ? 'page' : undefined} className="rounded-lg border border-[#73633a] px-3 py-2 text-[#F2C94C]">EN {lang === 'en' ? '✓' : ''}</Link>
              </div>
              <div className="my-1 border-t border-[#585047]" />
              <Link href={lang === 'pt' ? '/pt/entrar' : '/en/signin'} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Entrar' : 'Sign In'}</Link>
              <Link href={lang === 'pt' ? '/pt/registar' : '/en/signup'} className="rounded-lg bg-emerald-600 px-3 py-3 text-center font-semibold text-white hover:bg-emerald-700">{lang === 'pt' ? 'Criar Conta' : 'Create Account'}</Link>
            </div>
          </nav>
        </details>
      </div>
      <div className="w-full h-0.5 bg-[#F2C94C]" />
    </header>
  );
}
