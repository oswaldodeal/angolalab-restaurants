'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const homeHref = pathname?.startsWith('/en') ? '/en' : '/pt';

  return (
    <footer className="bg-slate-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
<Link href={homeHref} className="mb-3 inline-block text-xl font-bold hover:opacity-80 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2C94C]" aria-label="AngolaLab — Home">
  <span className="text-emerald-400">Angola</span>
  <span className="text-[#F2C94C]">Lab</span>
</Link>
            <p className="text-slate-400 text-sm">
              Descubra negócios verificados em Angola.<br />
              Grátis para listar, grátis para descobrir.
            </p>
          </div>

          {/* Quick Links — PT */}
          <div>
            <h4 className="font-semibold mb-3">Portugal / Angola</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/pt/restaurantes" className="hover:text-white">Restaurantes</Link></li>
              <li><Link href="/pt/restaurantes/registar" className="hover:text-white">Adicionar Negócio</Link></li>
              <li><Link href="/pt/entrar" className="hover:text-white">Entrar</Link></li>
            </ul>
          </div>

          {/* Quick Links — EN */}
          <div>
            <h4 className="font-semibold mb-3">English</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/en/restaurants" className="hover:text-white">Restaurants</Link></li>
              <li><Link href="/en/restaurants/submit" className="hover:text-white">Add Business</Link></li>
              <li><Link href="/en/signin" className="hover:text-white">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F2C94C] mt-8 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} AngolaLab — Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
