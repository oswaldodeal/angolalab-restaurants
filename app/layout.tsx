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
        {/* ONE Header → ALL pages ✅ */}
        <Header />
        
        {/* Page content → clean, no headers inside ✅ */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* ONE Footer → ALL pages ✅ */}
        <Footer />
      </body>
    </html>
  );
}
