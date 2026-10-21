import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AngolaLab — Restaurantes Verificados',
  description: 'Descubra restaurantes verificados em Angola',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      {/* Body = clean white → Hero controls its own grey background ✅ */}
      <body className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Header />
        
        {/* Gold line — stays fixed under header ✅ */}
        <div className="w-full h-0.5 bg-amber-500"></div>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
