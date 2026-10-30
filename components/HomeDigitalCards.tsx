'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomeDigitalCards({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <section className="bg-[#f3f2ef] px-5 py-12 text-[#252525] sm:py-16" aria-labelledby="home-digital-cards">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">
            {pt ? 'AngolaLab · Conexões digitais' : 'AngolaLab · Digital connections'}
          </p>
          <h2 id="home-digital-cards" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            {pt ? 'Partilhe os seus contactos sem os escrever.' : 'Share contact details without typing.'}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#555]">
            {pt
              ? 'Crie um cartão digital pessoal gratuito. Partilhe o seu número com amigos, colegas e empresas. Os cartões empresariais estão disponíveis para negócios verificados.'
              : 'Create a free personal digital card. Share your phone number with friends, colleagues and businesses. Business cards are available with verified business profiles.'}
          </p>
          <Link href={pt ? '/pt/cartoes' : '/en/cards'}
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#252a32] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#987515]">
            {pt ? 'Explorar Cartões Digitais →' : 'Explore Digital Cards →'}
          </Link>
          <p className="mt-3 text-xs text-[#666]">
            {pt ? 'Demonstração com identidades fictícias. Sem publicação ou QR ativo.' : 'Fictional demonstration. No live publishing or QR sharing.'}
          </p>
        </div>
        {imageAvailable && (
          <Link
            href={pt ? '/pt/cartoes' : '/en/cards'}
            aria-label={pt ? 'Abrir AngolaLab · Laboratório digital' : 'Open AngolaLab · Digital laboratory'}
            className="group block min-w-0 overflow-hidden rounded-2xl border border-[#ded6c5] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.09)] transition-shadow hover:shadow-[0_24px_55px_rgba(0,0,0,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#987515]"
          >
            {/* Approved illustration: public/angolalab-digital.png */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/angolalab-digital.png"
              alt={pt
                ? 'Graduada e profissional a partilhar cartões de contacto digitais através de telemóveis, imagem ilustrativa'
                : 'Graduate and business professional exchanging digital contact cards using their phones, illustrative image'}
              loading="lazy"
              className="block h-auto w-full object-contain transition-transform duration-200 group-hover:scale-[1.015]"
              onError={() => setImageAvailable(false)}
            />
          </Link>
        )}
      </div>
    </section>
  );
}
