import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AngolaLab — Restaurantes Verificados',
  description: 'Descubra restaurantes verificados em Angola',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-white text-slate-900">
        {/* Header — Always visible at top, sticky when scrolling */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo — shifted right, green + gold */}
            <Link href="/pt" className="flex items-center gap-0 ml-3">
              <span className="text-xl font-bold text-emerald-600">Angola</span>
              <span className="text-xl font-bold text-amber-500">LAB</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/pt/restaurantes" className="text-slate-600 hover:text-slate-900">Restaurantes</Link>
              <Link href="/pt" className="text-slate-600 hover:text-slate-900">PT</Link>
              <Link href="/en" className="text-slate-600 hover:text-slate-900">EN</Link>
              <Link href="/pt/entrar" className="text-slate-600 hover:text-slate-900">Entrar</Link>
              <Link href="/pt/registar" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Criar Conta</Link>
            </nav>
          </div>
        </header>

        {/* Main content — Hero always first, front & centre */}
        <main>{children}</main>
      </body>
    </html>
  )
}
