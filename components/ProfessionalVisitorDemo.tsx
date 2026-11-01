'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfessionalVisitorDemo({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [showIntro, setShowIntro] = useState(false);
  const [message, setMessage] = useState(pt
    ? 'Olá Waldo! Visitei o seu perfil e gostaria de saber mais sobre as suas competências em desenvolvimento web e investigação.'
    : 'Hello Waldo! I visited your profile and would like to know more about your Web Development and Research skills.');

  // This is a fixed fictional visitor-facing fixture, not an account or a public directory.
  // These fields match the currently permitted defaults in ProfessionalProfileDemo.
  const shared = [
    { label: pt ? 'Competências' : 'Skills', value: 'Web development, Website building' },
    { label: pt ? 'Idiomas' : 'Languages', value: 'English, Portuguese, Dutch' },
    { label: pt ? 'Interesses' : 'Interests', value: 'Reading, Writing, Technology' },
    { label: pt ? 'Publicação' : 'Publication', value: 'The Structure Beneath the Noise' },
  ];
  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">{pt ? 'AngolaLab · Conexões digitais' : 'AngolaLab · Digital Connections'}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{pt ? 'Perfil do visitante' : 'Visitor profile'}</h1>
        <p className="mt-3 text-sm leading-7 text-[#555]">{pt ? 'Demonstração fictícia, sem publicação ou contas reais. Mostra apenas os campos permitidos na configuração de exemplo.' : 'Fictional demonstration, not a published account. Only the sample profile’s permitted fields appear here.'}</p>

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-sm">
          <div className="h-3 bg-[#b6923b]" />
          <div className="p-6 sm:p-9">
            <div className="flex items-start gap-4">
              <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-3xl font-bold text-[#5f4a18]">W</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a20]">{pt ? 'Exemplo · Não publicado' : 'Example · Not published'}</p>
                <h2 className="mt-1 text-2xl font-bold">Waldo</h2>
                <p className="mt-1 text-[#555]">Web Developer</p>
                <p className="mt-2 text-xs text-[#666]">{pt ? 'Informação do perfil declarada pelo titular; não verificada.' : 'Profile information is self-reported; not verified.'}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {shared.map(item => (
                <div key={item.label} className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                  <h3 className="font-bold">{item.label}</h3>
                  <p className="mt-2 break-words text-sm leading-6 text-[#555]">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-[#e4d5a6] bg-[#fff9e9] p-5">
              <h3 className="font-bold">{pt ? 'Projetos e colaboração' : 'Projects and collaboration'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#555]">Education projects, technology and international collaboration</p>
            </div>
            <div className="mt-7 rounded-xl border border-[#dedbd3] p-5">
              <h3 className="text-lg font-bold">{pt ? 'Interessado em colaborar com Waldo?' : 'Interested in working with Waldo?'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'O modelo previsto permite iniciar uma conversa com um crédito. Respostas e mensagens seguintes serão gratuitas. O envio de mensagens e os pagamentos ainda não estão ativos.' : 'The planned model uses one credit to open a conversation. Replies and ongoing messages will be free. Messaging and payments are not active yet.'}</p>
              <button type="button" onClick={() => setShowIntro(p => !p)} className="mt-4 rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#424850]">{showIntro ? (pt ? 'Fechar exemplo' : 'Close example') : (pt ? 'Ver introdução de exemplo' : 'Preview introduction')}</button>
              {showIntro && (
                <div className="mt-4 space-y-3">
                  <label htmlFor="fpp-intro" className="block text-sm font-semibold">{pt ? 'Mensagem curta (demonstração)' : 'Short introduction (demo)'}</label>
                  <textarea id="fpp-intro" maxLength={250} rows={4} value={message} onChange={event => setMessage(event.target.value)} className="w-full rounded-lg border border-[#c9c9c4] p-3 text-sm" />
                  <p className="text-xs text-[#666]">{message.length}/250 · {pt ? 'Nenhuma mensagem é enviada e nenhum crédito é cobrado.' : 'No message is sent and no credit is charged.'}</p>
                </div>
              )}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#666]">{pt ? 'Fotografia, informação de fundador e redes sociais não são mostradas porque não estão autorizadas na configuração de exemplo. A futura aplicação exigirá controlo de permissões no servidor.' : 'Photo, founder information and social links are not displayed because the example permissions do not allow them. A live service will require server-enforced permissions.'}</p>
          </div>
        </section>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={pt ? '/pt/profissionais' : '/en/professionals'} className="rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319]">{pt ? '← Voltar ao editor FPP' : '← Back to FPP editor'}</Link>
          <Link href={pt ? '/pt/cartoes' : '/en/cards'} className="rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319]">{pt ? 'Cartões Digitais' : 'Digital Cards'}</Link>
        </div>
      </div>
    </main>
  );
}
