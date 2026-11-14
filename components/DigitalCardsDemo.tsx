'use client';

import Link from 'next/link';
import { useState } from 'react';

type Language = 'en' | 'pt';
type CardType = 'personal' | 'business';

export default function DigitalCardsDemo({ language }: { language: Language }) {
  const pt = language === 'pt';
  const [selected, setSelected] = useState<CardType>('personal');
  const [linkConsent, setLinkConsent] = useState(false);
  const [businessApproval, setBusinessApproval] = useState(false);
  const linked = linkConsent && businessApproval;
  const isPersonal = selected === 'personal';

  function saveContact() {
    // Fictional example only. Neither form entries nor private user data are exported.
    const fields = isPersonal
      ? ['N:Exemplo;Ana;;;', 'FN:Ana Exemplo', 'TEL;TYPE=CELL,VOICE:+1-202-555-0147',
          ...(linked ? ['ORG:Restaurante Exemplo'] : [])]
      : ['N:;Restaurante Exemplo;;;', 'FN:Restaurante Exemplo', 'ORG:Restaurante Exemplo',
          'TEL;TYPE=WORK,VOICE:+1-202-555-0147'];
    const vcard = ['BEGIN:VCARD', 'VERSION:3.0', ...fields,
      'NOTE:Fictional AngolaLab research contact - not a real person or business',
      'END:VCARD', ''].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = isPersonal ? 'ana-exemplo-demo.vcf' : 'restaurante-exemplo-demo.vcf';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-12 text-[#252525]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#927018]">{pt ? 'AngolaLab · Laboratório digital' : 'AngolaLab · Digital laboratory'}</p>
        <h1 className="mt-3 text-3xl font-bold">{pt ? 'Cartões Digitais' : 'Digital Cards'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555]">
          {pt ? 'Cartões pessoais gratuitos para todos. Cartões de negócio incluídos nos perfis empresariais verificados. Esta página é apenas uma demonstração com identidades fictícias.'
            : 'Free personal cards for everyone. Business cards included with verified business profiles. This page is a demonstration using fictional identities only.'}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" aria-pressed={isPersonal} onClick={() => setSelected('personal')}
            className={`rounded-xl border p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${isPersonal ? 'border-[#b18a23] bg-[#fff8e5]' : 'border-[#ddd] bg-white'}`}>
            <span className="block text-lg font-bold">{pt ? '👤 Cartão Pessoal' : '👤 Personal Card'}</span>
            <span className="mt-1 block text-xs text-[#555]">{pt ? 'Grátis · Partilha por opção do titular' : 'Free · Sharing controlled by the owner'}</span>
          </button>
          <button type="button" aria-pressed={!isPersonal} onClick={() => setSelected('business')}
            className={`rounded-xl border p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${!isPersonal ? 'border-[#b18a23] bg-[#fff8e5]' : 'border-[#ddd] bg-white'}`}>
            <span className="block text-lg font-bold">{pt ? '🏢 Cartão Empresarial' : '🏢 Business Card'}</span>
            <span className="mt-1 block text-xs text-[#555]">{pt ? 'Incluído após verificação do negócio' : 'Included after business verification'}</span>
          </button>
        </div>
        <section className="mt-6 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-8" aria-label={pt ? 'Pré-visualização de cartão fictício' : 'Fictional card preview'}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94711b]">{pt ? 'Pré-visualização · Não publicado' : 'Preview · Not published'}</p>
          <div className="mx-auto mt-5 max-w-sm rounded-[1.6rem] border-[5px] border-[#333] p-5 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8dab3] text-2xl font-bold">{isPersonal ? 'A' : 'R'}</div>
            <h2 className="mt-4 text-xl font-bold">{isPersonal ? 'Ana Exemplo' : 'Restaurante Exemplo'}</h2>
            <p className="mt-1 text-sm text-[#555]">{isPersonal ? (pt ? 'Pessoa · Exemplo fictício' : 'Individual · Fictional example') : (pt ? 'Restaurante · Exemplo fictício' : 'Restaurant · Fictional example')}</p>
            {linked && <button type="button" onClick={() => setSelected(isPersonal ? 'business' : 'personal')}
              className="mt-4 w-full rounded-lg border border-[#c6aa64] bg-[#fff8e6] px-3 py-3 text-sm font-semibold text-[#6d510c] focus-visible:outline-2">
              {isPersonal ? (pt ? 'Ver organização: Restaurante Exemplo →' : 'View organisation: Restaurante Exemplo →')
                : (pt ? 'Ver contacto associado: Ana Exemplo →' : 'View associated contact: Ana Exemplo →')}
            </button>}
            <button type="button" onClick={saveContact} className="mt-4 w-full rounded-lg bg-[#252a32] px-4 py-3 text-sm font-semibold text-white focus-visible:outline-2">
              {pt ? 'Guardar contacto fictício (.vcf)' : 'Save fictional contact (.vcf)'}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-[#666]">{pt ? 'Os contactos contêm apenas nomes fictícios e um número reservado para testes. Não existe publicação, QR ou partilha real.' : 'Contacts contain fictional names and a reserved test number only. No live publishing, QR or sharing exists.'}</p>
        </section>
        <section className="mt-6 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-8">
          <h2 className="text-lg font-bold">{pt ? 'Ligação entre pessoa e negócio · Simulação' : 'Personal–business connection · Simulation'}</h2>
          <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'Uma ligação só deve ficar visível quando a pessoa concorda e o negócio autoriza a associação. Estes controlos simulam ambas as decisões, sem verificar identidades reais.' : 'A connection should become visible only after the person consents and the business authorises the affiliation. These controls simulate both decisions without verifying real identities.'}</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={linkConsent} onChange={(e) => setLinkConsent(e.target.checked)} className="mt-1 accent-[#987515]" />
              <span>{pt ? 'Simular consentimento de Ana para mostrar a ligação' : 'Simulate Ana consenting to show the connection'}</span></label>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={businessApproval} onChange={(e) => setBusinessApproval(e.target.checked)} className="mt-1 accent-[#987515]" />
              <span>{pt ? 'Simular autorização do Restaurante Exemplo' : 'Simulate authorisation from Restaurante Exemplo'}</span></label>
          </div>
          <p className="mt-4 rounded-lg bg-[#f7f4eb] p-3 text-sm" role="status">{linked
            ? (pt ? 'Ligação de exemplo ativa nesta página. Use o botão no cartão para alternar.' : 'Sample connection active on this page. Use the card button to switch.')
            : (pt ? 'Ligação não apresentada. São necessárias as duas autorizações simuladas.' : 'Connection hidden. Both simulated approvals are required.')}</p>
        </section>
        <section className="mt-6 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-8">
          <h2 className="text-lg font-bold">{pt ? 'Conheça os Perfis Profissionais' : 'Explore Professional Profiles'}</h2>
          <p className="mt-2 text-sm leading-6 text-[#555]">
            {pt ? 'Veja como as pessoas poderão apresentar competências, idiomas e interesses para encontrar colaboradores.' : 'See how people could share skills, languages and interests to find collaborators.'}
          </p>
          <Link href={pt ? '/pt/profissionais' : '/en/professionals'} className="mt-4 inline-flex rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#424850]">
            {pt ? 'Ver perfil profissional fictício →' : 'View fictional professional profile →'}
          </Link>
        </section>
        <p className="mt-6 text-sm text-[#555]">{pt ? 'O serviço pessoal será independente do registo de restaurantes.' : 'The personal service will be independent of restaurant registration.'} <Link className="font-semibold text-[#806016] underline" href={pt ? '/pt/restaurantes' : '/en/restaurants'}>{pt ? 'Explorar restaurantes' : 'Explore restaurants'}</Link></p>
      </div>
    </main>
  );
}
