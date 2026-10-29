'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomeDigitalCards({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [imageAvailable, setImageAvailable] = useState(true);
  const personal = type === 'personal';
  return (
    <section className="bg-[#f3f2ef] px-5 py-14 text-[#252525]" aria-labelledby="home-digital-cards">
      <div className="mx-auto grid max-w-5xl items-center gap-9 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">{pt ? 'AngolaLab · Conexões digitais' : 'AngolaLab · Digital connections'}</p>
          <h2 id="home-digital-cards" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{pt ? 'Um contacto. Uma ligação.' : 'One contact. One connection.'}</h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#555]">
            {pt ? 'Cartões pessoais gratuitos para todos. Cartões empresariais incluídos nos perfis de negócio verificados. Descubra como podem ligar-se com autorização.'
              : 'Free personal cards for everyone. Business cards included with verified business profiles. Explore how they can connect with permission.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label={pt ? 'Escolher cartão de exemplo' : 'Choose sample card'}>
            <button type="button" aria-pressed={personal} onClick={() => setType('personal')}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#987515] ${personal ? 'border-[#987515] bg-[#fff0bd] text-[#59430a]' : 'border-[#ccc] bg-white text-[#444] hover:bg-[#f9f4e8]'}`}>
              {pt ? '👤 Pessoal · Grátis' : '👤 Personal · Free'}
            </button>
            <button type="button" aria-pressed={!personal} onClick={() => setType('business')}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#987515] ${!personal ? 'border-[#987515] bg-[#fff0bd] text-[#59430a]' : 'border-[#ccc] bg-white text-[#444] hover:bg-[#f9f4e8]'}`}>
              {pt ? '🏢 Negócio · Verificado' : '🏢 Business · Verified'}
            </button>
          </div>
          <Link href={pt ? '/pt/cartoes' : '/en/cards'}
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#252a32] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#987515]">
            {pt ? 'Explorar Cartões Digitais →' : 'Explore Digital Cards →'}
          </Link>
          <p className="mt-3 text-xs text-[#666]">{pt ? 'Demonstração com identidades fictícias. Sem publicação ou QR ativo.' : 'Fictional demonstration. No live publishing or QR sharing.'}</p>
        </div>
        <div className="space-y-5">
          {imageAvailable && (
            <div className="overflow-hidden rounded-2xl border border-[#ded6c5] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.09)]">
              {/* Upload the approved image to public/images/digital-cards-networking.webp before this renders. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/digital-cards-networking.webp" alt={pt ? 'Graduada e profissional a partilhar cartões de contacto digitais através de telemóveis, imagem ilustrativa' : 'Graduate and business professional exchanging digital contact cards using their phones, illustrative image'} loading="lazy" className="h-auto w-full object-cover" onError={() => setImageAvailable(false)} />
            </div>
          )}
        <div className="relative mx-auto w-full max-w-sm rounded-[1.75rem] border border-[#ded6c5] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.09)]">
          <div className="absolute -right-2 -top-3 rounded-full bg-[#d9c17e] px-4 py-1.5 text-xs font-bold text-[#45350a] shadow-sm">{pt ? 'PRÉ-VISUALIZAÇÃO' : 'PREVIEW'}</div>
          <div className="rounded-[1.2rem] bg-gradient-to-br from-[#f9f4e7] to-[#ede6d3] p-7 text-center transition-colors duration-300">
            <div key={type} className="transition-opacity duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#6c5419] shadow-sm">{personal ? 'A' : 'R'}</div>
              <p className="mt-5 text-xl font-bold">{personal ? 'Ana Exemplo' : 'Restaurante Exemplo'}</p>
              <p className="mt-2 text-sm text-[#555]">{personal ? (pt ? 'Cartão pessoal · Gratuito' : 'Personal card · Free') : (pt ? 'Cartão empresarial · Verificação necessária' : 'Business card · Verification required')}</p>
              <div className="mt-6 rounded-lg border border-[#d8c99e] bg-white/80 px-4 py-3 text-xs font-medium text-[#705719]">
                {personal ? (pt ? 'Pode ligar-se a um negócio autorizado ↗' : 'Can connect to an authorised business ↗') : (pt ? 'Pode ligar-se a contactos autorizados ↗' : 'Can connect to authorised contacts ↗')}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[#666]">{pt ? 'Escolha um tipo de cartão para experimentar.' : 'Choose a card type to preview it.'}</p>
        </div>
        </div>
      </div>
    </section>
  );
}
