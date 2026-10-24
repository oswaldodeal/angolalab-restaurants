'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const lang = path.startsWith('/en') ? 'en' : 'pt';

  return (
<header className="sticky top-0 z-50 w-full bg-[#22262D] shadow-sm">   
      <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 sm:px-8 lg:px-12 py-3">
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
        <nav aria-label="Main navigation" className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-3 text-sm sm:gap-x-6">
          {lang === 'pt' ? (
            <>
              <Link href="/pt/restaurantes" className="text-[#F2C94C] hover:text-white">Restaurantes</Link>
              <Link href="/pt" className="text-[#F2C94C] hover:text-white">PT</Link>
              <Link href="/en" className="text-[#F2C94C] hover:text-white">EN</Link>
              <Link href="/pt/entrar" className="text-[#F2C94C] hover:text-white">Entrar</Link>
              <Link href="/pt/registar" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Criar Conta</Link>
            </>
          ) : (
            <>
              <Link href="/en/restaurants" className="text-[#F2C94C] hover:text-white">Restaurants</Link>
              <Link href="/pt" className="text-[#F2C94C] hover:text-white">PT</Link>
              <Link href="/en" className="text-[#F2C94C] hover:text-white">EN</Link>
              <Link href="/en/signin" className="text-[#F2C94C] hover:text-white">Sign In</Link>
              <Link href="/en/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Create Account</Link>
            </>
          )}
        </nav>
      </div>
      <div className="w-full h-0.5 bg-[#F2C94C]" />
    </header>
  );
}
