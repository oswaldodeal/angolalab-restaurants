'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

export default function Header() {
  const path = usePathname();
  return path === '/findme'
    ? <Suspense fallback={<HeaderNavigation path={path} lang="pt" />}><FindMeHeader path={path} /></Suspense>
    : <HeaderNavigation path={path} lang={path.startsWith('/en') ? 'en' : 'pt'} />;
}

function FindMeHeader({ path }: { path: string }) {
  const query = useSearchParams().toString();
  const lang = new URLSearchParams(query).get('lang') === 'pt' ? 'pt' : 'en';
  return <HeaderNavigation path={path} lang={lang} findMeQuery={query} />;
}

function HeaderNavigation({ path, lang, findMeQuery }: { path: string; lang: 'pt' | 'en'; findMeQuery?: string }) {
  const findMeHref = `/findme?lang=${lang}`;
  const isFindMe = path === '/findme';
  const visitorProfile = /^\/(?:en\/professionals\/profile|pt\/profissionais\/perfil)\/([a-f0-9-]{36})$/.exec(path);
  const communityPath = lang === 'pt' ? '/pt/profissionais' : '/en/professionals';
  const languageRef = useRef<HTMLDetailsElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const languagePath = (target: 'pt' | 'en') => {
    if (isFindMe) {
      const params = new URLSearchParams(findMeQuery);
      params.set('lang', target);
      return `/findme?${params}`;
    }
    // Keep the restaurant ID when changing language on a profile.
    const restaurantPath = path.match(/^\/(?:en\/restaurants|pt\/restaurantes)(\/.*)?$/);
    if (restaurantPath) {
      const currentSuffix = restaurantPath[1] ?? '';
      const suffix = currentSuffix === '/submit' || currentSuffix === '/registar'
        ? (target === 'pt' ? '/registar' : '/submit')
        : currentSuffix;
      return `/${target}/${target === 'pt' ? 'restaurantes' : 'restaurants'}${suffix}`;
    }
    if (visitorProfile) return target === 'pt'
      ? `/pt/profissionais/perfil/${visitorProfile[1]}`
      : `/en/professionals/profile/${visitorProfile[1]}`;
    const suffix = path.startsWith('/en/professionals') || path.startsWith('/pt/profissionais') ? (target === 'pt' ? '/profissionais' : '/professionals')
      : path.startsWith('/en/cards') || path.startsWith('/pt/cartoes') ? (target === 'pt' ? '/cartoes' : '/cards')
      : path.startsWith('/en/restaurants/submit') || path.startsWith('/pt/restaurantes/registar') ? (target === 'pt' ? '/restaurantes/registar' : '/restaurants/submit')
      : path.startsWith('/en/restaurants') || path.startsWith('/pt/restaurantes') ? (target === 'pt' ? '/restaurantes' : '/restaurants')
      : path.startsWith('/en/about') || path.startsWith('/pt/sobre') ? (target === 'pt' ? '/sobre' : '/about')
      : path === '/en/account' || path === '/pt/conta' ? (target === 'pt' ? '/conta' : '/account')
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
      for (const menu of [languageRef.current, mobileRef.current]) {
        if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        for (const menu of [languageRef.current]) {
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

  // Close menus after navigating, including browser back/forward.
  useEffect(() => {
    if (languageRef.current) languageRef.current.open = false;
    if (mobileRef.current) mobileRef.current.open = false;
  }, [path]);

  const switchLanguage = () => {
    // Language links navigate normally; do not force a jump to Digital Connections.
    if (languageRef.current) languageRef.current.open = false;
    if (mobileRef.current) mobileRef.current.open = false;
  };

  const navLinkClass = 'rounded-md text-[#F2C94C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]';
  const isHome = path === '/pt' || path === '/en';
  const isRestaurantDirectory = path === '/pt/restaurantes' || path === '/en/restaurants';
  const isRestaurantProfile = /^\/(?:en\/restaurants\/(?!submit$)|pt\/restaurantes\/(?!registar$))[^/]+$/.test(path);
  const headerWidth = isHome || isRestaurantDirectory || isRestaurantProfile
    ? 'page-rail' : 'w-full max-w-7xl px-4 sm:px-6 lg:pl-8 lg:pr-12';

  const languageOptionClass = (target: 'pt' | 'en') =>
    `flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] ${lang === target ? 'border-[#d4af37] bg-[#d4af37] text-[#171717]' : 'border-[#b28b29] text-[#F2C94C] hover:bg-white/10'}`;

  const languageMenu = (
    <details ref={languageRef} className="group relative">
      <summary aria-label={lang === 'pt' ? 'Escolher idioma' : 'Choose language'}
        className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-[#F2C94C] hover:text-white group-open:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true">🌐</span><span>{lang.toUpperCase()}</span><span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute right-0 top-full z-[70] mt-2 w-48 rounded-xl border border-[#b28b29] bg-[#22262D] p-3 text-sm shadow-2xl">
        <p className="mb-2 text-xs font-semibold text-[#d8c68d]">{lang === 'pt' ? 'Idioma' : 'Language'}</p>
        <div className="grid grid-cols-2 gap-2">
          <Link href={languagePath('pt')} hrefLang="pt" lang="pt" aria-label="Português" aria-current={lang === 'pt' ? 'page' : undefined}
            onClick={switchLanguage} className={languageOptionClass('pt')}>
            PT {lang === 'pt' ? '✓' : ''}
          </Link>
          <Link href={languagePath('en')} hrefLang="en" lang="en" aria-label="English" aria-current={lang === 'en' ? 'page' : undefined}
            onClick={switchLanguage} className={languageOptionClass('en')}>
            EN {lang === 'en' ? '✓' : ''}
          </Link>
        </div>
      </div>
    </details>
  );


  return (
<header className={`sticky top-0 z-50 w-full max-w-full bg-[#22262D] shadow-sm`}>   
      <div className={`mx-auto flex min-w-0 items-center justify-between gap-3 py-3 ${headerWidth}`}>
       <Link
  href={visitorProfile ? communityPath : `/${lang}`}
  className="inline-flex min-w-0 shrink-0 items-center gap-2 rounded-md text-lg font-bold sm:gap-3 sm:text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C]"
  aria-label={visitorProfile
    ? (lang === 'pt' ? 'Comunidade da AngolaLab' : 'AngolaLab Community')
    : (lang === 'pt' ? 'Página inicial da AngolaLab' : 'AngolaLab home')}
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
              <Link href="/pt/cartoes" className={navLinkClass}>Cartões Digitais</Link>
              <Link href={findMeHref} className={navLinkClass} aria-current={isFindMe ? 'page' : undefined}>MeAcha</Link>
              <Link href="/pt/sobre" className={navLinkClass}>Sobre Nós</Link>
              {languageMenu}
              <Link href="/pt/entrar" className={navLinkClass}>Entrar</Link>
              <Link href="/pt/registar" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Criar Conta</Link>
            </>
          ) : (
            <>
              <Link href="/en/cards" className={navLinkClass}>Digital Cards</Link>
              <Link href={findMeHref} className={navLinkClass} aria-current={isFindMe ? 'page' : undefined}>FindMe</Link>
              <Link href="/en/about" className={navLinkClass}>About Us</Link>
              {languageMenu}
              <Link href="/en/signin" className={navLinkClass}>Sign In</Link>
              <Link href="/en/signup" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Create Account</Link>
            </>
          )}
        </nav>
        <details ref={mobileRef} className="group relative ml-auto lg:hidden">
          <summary aria-label={lang === 'pt' ? 'Abrir menu de navegação' : 'Open navigation menu'}
            className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[#F2C94C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] [&::-webkit-details-marker]:hidden">
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
              <Link href={findMeHref} onClick={switchLanguage} aria-current={isFindMe ? 'page' : undefined} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'MeAcha' : 'FindMe'}</Link>
              <Link href={lang === 'pt' ? '/pt/sobre' : '/en/about'} className="rounded-lg px-3 py-3 text-[#F2C94C] hover:bg-white/10">{lang === 'pt' ? 'Sobre Nós' : 'About Us'}</Link>
              <div className="my-1 border-t border-[#585047]" />
              <p className="px-3 pt-2 text-xs font-semibold text-[#d8c68d]">{lang === 'pt' ? 'Idioma' : 'Language'}</p>
              <div className="grid grid-cols-2 gap-2 px-3 py-2">
                <Link href={languagePath('pt')} hrefLang="pt" lang="pt" onClick={switchLanguage}
                  aria-label="Português" aria-current={lang === 'pt' ? 'page' : undefined} className={languageOptionClass('pt')}>PT {lang === 'pt' ? '✓' : ''}</Link>
                <Link href={languagePath('en')} hrefLang="en" lang="en" onClick={switchLanguage}
                  aria-label="English" aria-current={lang === 'en' ? 'page' : undefined} className={languageOptionClass('en')}>EN {lang === 'en' ? '✓' : ''}</Link>
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
