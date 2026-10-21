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
      <body className="min-h-screen bg-white text-slate-900 flex flex-col">
        {/* HEADER — always first */}
        <Header />
        
        {/* ✨ GOLD LINE — directly under header, above everything else ✨ */}
        <div className="w-full h-0.5 bg-amber-500"></div>
        
        {/* PAGE CONTENT — hero starts here with light grey */}
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
