import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AngolaLab — Rede de Restaurantes',
  description: 'Explore restaurantes, registos Básicos e perfis de demonstração na rede AngolaLab.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      {/* Body = clean white → Hero controls its own grey background ✅ */}
      <body id="top" className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Header />
        
        
        
        <main className="flex-grow lab-dark-section">
  {children}
</main>
        
        <Footer />
      </body>
    </html>
  );
}
