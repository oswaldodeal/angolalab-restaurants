'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const lang = path.startsWith('/en') ? 'en' : 'pt';

  return (
<header className="sticky top-0 z-50 w-full bg-[#22262D] shadow-sm">   
      <div className="w-full flex flex-col items-start gap-y-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6 sm:px-8 lg:px-12">
       <Link
  href={`/${lang}`}
  className="inline-flex shrink-0 items-center gap-3 text-xl font-bold"
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
        <nav aria-label="Main navigation" className="flex w-full flex-nowrap items-center justify-between gap-x-1 text-[clamp(0.68rem,2.9vw,0.875rem)] sm:ml-auto sm:w-auto sm:justify-end sm:gap-x-6 sm:text-sm">
          {lang === 'pt' ? (
            <>
              <Link href="/pt/restaurantes" className="text-[#F2C94C] hover:text-white">Restaurantes</Link>
              <Link href="/pt" className="text-[#F2C94C] hover:text-white">PT</Link>
              <Link href="/en" className="text-[#F2C94C] hover:text-white">EN</Link>
              <Link href="/pt/entrar" className="text-[#F2C94C] hover:text-white">Entrar</Link>
              <Link href="/pt/registar" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Criar Conta</Link>
            </>
          ) : (
            <>
              <Link href="/en/restaurants" className="text-[#F2C94C] hover:text-white">Restaurants</Link>
              <Link href="/pt" className="text-[#F2C94C] hover:text-white">PT</Link>
              <Link href="/en" className="text-[#F2C94C] hover:text-white">EN</Link>
              <Link href="/en/signin" className="text-[#F2C94C] hover:text-white">Sign In</Link>
              <Link href="/en/signup" className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C94C] sm:px-4">Create Account</Link>
            </>
          )}
        </nav>
      </div>
      <div className="w-full h-0.5 bg-[#F2C94C]" />
    </header>
  );
}
