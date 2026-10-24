import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
<p className="text-xl font-bold mb-3">
  <span className="text-emerald-400">Angola</span>
  <span className="text-[#F2C94C]">Lab</span>
</p>
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
