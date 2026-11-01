'use client';

import Link from 'next/link';
import { useState } from 'react';

type Language = 'en' | 'pt';
type Field = 'profession' | 'skills' | 'languages' | 'interests' | 'publication' | 'founder' | 'collaboration';
const initialVisibility: Record<Field, boolean> = {
  profession: true, skills: true, languages: true, interests: true,
  publication: false, founder: false, collaboration: true,
};
const fieldOrder: Field[] = ['profession', 'skills', 'languages', 'interests', 'publication', 'founder', 'collaboration'];
const values: Record<Field, string> = {
  profession: 'Web Developer',
  skills: 'Web Development · Research · Technology',
  languages: 'English · Portuguese · Dutch',
  interests: 'Education · Digital Systems',
  publication: 'The Structure Beneath the Noise',
  founder: 'AngolaLab',
  collaboration: 'Research projects and web development',
};

export default function FppVisitorWaldoDemo({ language }: { language: Language }) {
  const pt = language === 'pt';
  const [visible, setVisible] = useState<Record<Field, boolean>>({ ...initialVisibility });
  const [listed, setListed] = useState(true);
  const [contactAllowed, setContactAllowed] = useState(true);
  const [compose, setCompose] = useState(false);
  const [message, setMessage] = useState(pt
    ? 'Olá Waldo! Visitei o seu perfil e gostaria de saber mais sobre as suas competências em desenvolvimento web e investigação.'
    : 'Hello Waldo! I visited your profile and would like to know more about your Web Development and Research skills.');
  const labels: Record<Field, string> = pt ? {
    profession: 'Profissão', skills: 'Competências', languages: 'Idiomas',
    interests: 'Interesses', publication: 'Publicação', founder: 'Fundador de',
    collaboration: 'Projetos e colaboração',
  } : {
    profession: 'Profession', skills: 'Skills', languages: 'Languages',
    interests: 'Interests', publication: 'Publication', founder: 'Founder of',
    collaboration: 'Projects and collaboration',
  };
  const profileBase = pt ? '/pt/profissionais' : '/en/professionals';
  const checkboxClass = 'h-4 w-4 shrink-0 accent-[#927018]';
  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · {pt ? 'Conexões digitais' : 'Digital Connections'}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{pt ? 'Perfil do visitante · Waldo' : 'Visitor profile · Waldo'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555]">{pt
          ? 'Demonstração fictícia de um perfil profissional para adultos (18+). Apenas os campos permitidos aparecem na vista do visitante.'
          : 'Fictional adult (18+) professional profile demonstration. Only permitted fields appear in the visitor view.'}</p>

        <section aria-label={pt ? 'Perfil do visitante' : 'Visitor profile'} className="mt-7 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-sm">
          <div className="h-3 bg-[#b6923b]" />
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-start gap-4">
              <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-3xl font-bold text-[#5f4a18]">W</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a20]">{pt ? 'Exemplo fictício · Não publicado' : 'Fictional example · Not published'}</p>
                <h2 className="mt-1 text-2xl font-bold">Waldo</h2>
                {visible.profession && <p className="mt-1 text-sm text-[#555]">{values.profession}</p>}
                <p className="mt-2 text-xs text-[#666]">{pt ? 'Informações do perfil declaradas pelo titular; identidade não verificada.' : 'Profile details are self-reported; identity not verified.'}</p>
              </div>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {fieldOrder.filter(key => visible[key] && key !== 'profession').map(key => (
                <div key={key} className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                  <h3 className="text-sm font-bold">{labels[key]}</h3>
                  <p className="mt-2 break-words text-sm leading-6 text-[#555]">{values[key]}</p>
                  {key === 'founder' && <p className="mt-2 text-xs text-[#777]">{pt ? 'Declaração do titular; relação com a organização não verificada.' : 'Self-reported founder claim; relationship with organisation not verified.'}</p>}
                </div>
              ))}
            </div>
            {contactAllowed ? (
              <div className="mt-7 rounded-xl border border-[#e4d5a6] bg-[#fff9e9] p-5">
                <h3 className="font-bold">{pt ? 'Interessado em colaborar com Waldo?' : 'Interested in working with Waldo?'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{pt
                  ? 'No serviço futuro, uma nova apresentação custará 1 crédito. Receber e responder será gratuito; as conversas aceites continuarão gratuitamente.'
                  : 'In the future service, a new introduction will cost 1 credit. Receiving and replying will be free; accepted conversations can continue for free.'}</p>
                <button type="button" onClick={() => setCompose(current => !current)} className="mt-4 rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#424850]">
                  {compose ? (pt ? 'Fechar apresentação' : 'Close introduction') : (pt ? 'Escrever apresentação · Teste' : 'Write introduction · Demo')}
                </button>
                {compose && <div className="mt-4 rounded-xl border border-[#e4d5a6] bg-white p-4">
                  <label htmlFor="intro-text" className="text-sm font-semibold">{pt ? 'Mensagem curta' : 'Short introduction'}</label>
                  <textarea id="intro-text" rows={3} maxLength={250} value={message} onChange={event => setMessage(event.target.value)} className="mt-2 block w-full rounded-lg border border-[#c9c9c4] p-3 text-sm focus-visible:outline-2 focus-visible:outline-[#927018]" />
                  <p className="mt-2 text-xs text-[#666]">{message.length}/250 · {pt ? 'Apenas pré-visualização: nenhuma mensagem é enviada e nenhum crédito é cobrado.' : 'Preview only: no message is sent and no credit is charged.'}</p>
                  <button type="button" disabled={!message.trim()} onClick={() => navigator.clipboard?.writeText(message)} className="mt-3 rounded-lg border border-[#c9c9c4] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">{pt ? 'Copiar texto' : 'Copy text'}</button>
                </div>}
              </div>
            ) : <div className="mt-7 rounded-xl bg-[#f7f6f2] p-5 text-sm text-[#555]">{pt ? 'Waldo não está a aceitar novas apresentações.' : 'Waldo is not accepting new introductions.'}</div>}
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-7" aria-label={pt ? 'Simulador de permissões' : 'Permission simulator'}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{pt ? 'Simulador de permissões do titular' : 'Owner permission simulator'}</h2>
            <button type="button" onClick={() => setVisible(Object.fromEntries(fieldOrder.map(key => [key, true])) as Record<Field, boolean>)} className="rounded-lg border px-3 py-2 text-sm">{pt ? 'Mostrar todos' : 'Show all'}</button>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#666]">{pt ? 'Altere as opções para testar a vista do visitante. Estes controlos não guardam nem publicam dados.' : 'Change these settings to test the visitor view. These controls do not save or publish data.'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fieldOrder.map(key => <label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" className={checkboxClass} checked={visible[key]} onChange={event => setVisible(previous => ({ ...previous, [key]: event.target.checked }))} />{labels[key]}</label>)}
          </div>
          <div className="mt-5 border-t border-[#dedbd3] pt-4">
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" className={checkboxClass} checked={listed} onChange={event => setListed(event.target.checked)} />{pt ? 'Aparecer no diretório FPP' : 'Appear in FPP Directory'}</label>
            <label className="mt-3 flex items-center gap-3 text-sm"><input type="checkbox" className={checkboxClass} checked={contactAllowed} onChange={event => setContactAllowed(event.target.checked)} />{pt ? 'Aceitar apresentações profissionais' : 'Accept professional introductions'}</label>
            <p className="mt-3 text-xs text-[#666]">{listed ? (pt ? 'Estado simulado: visível no diretório.' : 'Simulated status: listed in directory.') : (pt ? 'Estado simulado: oculto do diretório. O acesso por ligação direta exigirá controlos adicionais.' : 'Simulated status: hidden from directory. Direct-link access will require additional controls.')}</p>
          </div>
        </section>
        <p className="mt-5 text-xs leading-6 text-[#666]">{pt ? 'Antes do lançamento real: autenticação, verificações de permissões no servidor, consentimento de contacto, moderação e regras de retenção das mensagens.' : 'Before live launch: authentication, server-side permission checks, contact consent, moderation and message-retention rules.'}</p>
        <Link href={profileBase} className="mt-6 inline-flex rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319]">{pt ? '← Voltar ao FPP' : '← Back to FPP'}</Link>
      </div>
    </main>
  );
}

