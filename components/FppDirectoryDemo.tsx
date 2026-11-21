'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Language = 'en' | 'pt';
type Visibility = { profession: boolean; skills: boolean; languages: boolean; founder: boolean };
type Profile = {
  id: string;
  name: string;
  profession: { en: string; pt: string };
  skills: { en: string; pt: string };
  languages: string;
  founder?: string;
  directoryConsent: boolean;
  contactConsent: boolean;
  identityVerified: boolean;
  visibility: Visibility;
  demoPage?: boolean;
};

// Fictional, in-memory examples only. Never replace this array with real account data
// until the server checks directory consent and field-level permissions.
const examples: Profile[] = [
  {
    id: 'waldo', name: 'Waldo',
    profession: { en: 'Web Developer', pt: 'Desenvolvedor Web' },
    skills: { en: 'Web Development · Research · Technology', pt: 'Desenvolvimento Web · Investigação · Tecnologia' },
    languages: 'English · Português · Nederlands', founder: 'AngolaLab',
    directoryConsent: true, contactConsent: true, identityVerified: false,
    visibility: { profession: true, skills: true, languages: true, founder: false },
    demoPage: true,
  },
  {
    id: 'ana', name: 'Ana Exemplo',
    profession: { en: 'Education Researcher', pt: 'Investigadora em Educação' },
    skills: { en: 'Education · Research · Digital Learning', pt: 'Educação · Investigação · Aprendizagem Digital' },
    languages: 'Português · English',
    directoryConsent: true, contactConsent: false, identityVerified: false,
    visibility: { profession: true, skills: true, languages: false, founder: false },
  },
  {
    id: 'carlos', name: 'Carlos Exemplo',
    profession: { en: 'Business Consultant', pt: 'Consultor de Negócios' },
    skills: { en: 'Business · Tourism · Planning', pt: 'Negócios · Turismo · Planeamento' },
    languages: 'Português · English',
    directoryConsent: true, contactConsent: true, identityVerified: false,
    visibility: { profession: true, skills: false, languages: true, founder: false },
  },
  {
    id: 'hidden', name: 'Hidden Example',
    profession: { en: 'Designer', pt: 'Designer' },
    skills: { en: 'Design', pt: 'Design' }, languages: 'English',
    directoryConsent: false, contactConsent: false, identityVerified: false,
    visibility: { profession: true, skills: true, languages: true, founder: false },
  },
];

export default function FppDirectoryDemo({ language }: { language: Language }) {
  const pt = language === 'pt';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'contact'>('all');
  const [showWaldo, setShowWaldo] = useState(true);
  const directoryBase = pt ? '/pt/profissionais' : '/en/professionals';
  const profiles = useMemo(() => examples.filter(p => p.directoryConsent && (p.id !== 'waldo' || showWaldo)), [showWaldo]);
  const results = profiles.filter(p => {
    const searchable = [p.name, p.visibility.profession ? p.profession[language] : '', p.visibility.skills ? p.skills[language] : '', p.visibility.languages ? p.languages : '', p.visibility.founder ? p.founder ?? '' : ''].join(' ').toLocaleLowerCase();
    return searchable.includes(search.trim().toLocaleLowerCase()) && (filter === 'all' || p.contactConsent);
  });
  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · {pt ? 'Conexões digitais' : 'Digital Connections'}</p>
        <div className="mt-4 rounded-2xl border border-[#dedbd3] bg-white p-6 sm:p-9">
          <h1 className="text-3xl font-bold sm:text-4xl">{pt ? 'Descubra pessoas e competências' : 'Discover People & Skills'}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#555]">{pt
            ? 'Explore profissionais, investigadores e criadores de projetos. Apenas informações autorizadas pelos titulares aparecem no diretório.'
            : 'Explore professionals, researchers and project builders. Only information permitted by profile owners appears in the directory.'}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[#f6efdd] px-3 py-2 text-[#745a1e]">{pt ? 'Perfis gratuitos' : 'Free profiles'}</span>
            <span className="rounded-full bg-[#f6efdd] px-3 py-2 text-[#745a1e]">18+</span>
            <span className="rounded-full bg-[#f6efdd] px-3 py-2 text-[#745a1e]">{pt ? 'Visibilidade autorizada' : 'Permission-led discovery'}</span>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#795d1b]">{pt ? 'Demonstração: todos os nomes e perfis apresentados são exemplos fictícios. Nenhum utilizador real está listado.' : 'Demonstration: all listed names and profiles are fictional examples. No real users are listed.'}</p>
        </div>

        <section className="mt-6 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-7" aria-label={pt ? 'Pesquisar diretório' : 'Search directory'}>
          <label htmlFor="fpp-directory-search" className="block text-sm font-bold">{pt ? 'Pesquisar por nome, profissão ou competências' : 'Search by name, profession or skills'}</label>
          <input id="fpp-directory-search" type="search" maxLength={120} value={search} onChange={e => setSearch(e.target.value)}
            placeholder={pt ? 'Ex.: Investigação, Web, Waldo' : 'e.g. Research, Web, Waldo'}
            className="mt-2 w-full rounded-lg border border-[#c9c9c4] bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#927018]" />
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={pt ? 'Filtrar perfis' : 'Filter profiles'}>
            <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === 'all' ? 'bg-[#252a32] text-white' : 'border border-[#c9c9c4] bg-white text-[#333]'}`}>
              {pt ? 'Todos os perfis' : 'All profiles'}
            </button>
            <button type="button" aria-pressed={filter === 'contact'} onClick={() => setFilter('contact')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === 'contact' ? 'bg-[#252a32] text-white' : 'border border-[#c9c9c4] bg-white text-[#333]'}`}>
              {pt ? 'Aceitam apresentações' : 'Accept introductions'}
            </button>
          </div>
          <p role="status" className="mt-4 text-xs text-[#666]">{results.length} {pt ? 'perfis de exemplo encontrados' : 'example profiles found'}</p>
        </section>

        <section className="mt-6" aria-label={pt ? 'Resultados do diretório' : 'Directory results'}>
          {results.length === 0 ? (
            <div className="rounded-xl border border-[#dedbd3] bg-white p-6 text-sm text-[#555]">{pt ? 'Nenhum perfil corresponde à pesquisa. Experimente outras palavras.' : 'No matching profiles. Try another search.'}</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(p => <article key={p.id} className="flex min-w-0 flex-col rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-xl font-bold text-[#5f4a18]">{p.name[0]}</div>
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-bold">{p.name}</h2>
                    {p.visibility.profession && <p className="mt-1 text-sm text-[#555]">{p.profession[language]}</p>}
                  </div>
                </div>
                {p.visibility.skills && <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wide text-[#777]">{pt ? 'Competências' : 'Skills'}</p><p className="mt-1 break-words text-sm leading-6">{p.skills[language]}</p></div>}
                {p.visibility.languages && <div className="mt-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#777]">{pt ? 'Idiomas' : 'Languages'}</p><p className="mt-1 text-sm">{p.languages}</p></div>}
                {p.visibility.founder && p.founder && <div className="mt-3"><p className="text-xs font-semibold">{pt ? 'Fundador de' : 'Founder of'}: {p.founder}</p><p className="mt-1 text-xs text-[#666]">{pt ? 'Declaração não verificada' : 'Self-reported, not verified'}</p></div>}
                <div className="mt-auto pt-5">
                  <p className="mb-3 text-xs text-[#666]">{p.identityVerified ? (pt ? 'Exemplo de identidade verificada' : 'Example identity verified') : (pt ? 'Perfil declarado pelo titular · Não verificado' : 'Self-reported profile · Not verified')}</p>
                  <p className="mb-3 text-xs text-[#666]">{p.contactConsent ? (pt ? 'Aceita apresentações profissionais (simulado)' : 'Accepts professional introductions (simulated)') : (pt ? 'Não aceita novas apresentações' : 'Not accepting introductions')}</p>
                  {p.demoPage ? <Link href={`${directoryBase}/waldo`} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#252a32] px-4 py-3 text-sm font-semibold text-white hover:bg-[#424850]">{pt ? 'Ver perfil de visitante' : 'View visitor profile'}</Link>
                    : <span aria-disabled="true" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#d9d7d1] bg-[#f7f6f2] px-4 py-3 text-center text-sm font-semibold text-[#777]">{pt ? 'Página individual ainda não disponível' : 'Individual page not yet available'}</span>}
                </div>
              </article>)}
            </div>
          )}
        </section>

        <section className="mt-7 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold">{pt ? 'Teste de autorização do diretório' : 'Directory consent demonstration'}</h2>
          <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'Simule a decisão de Waldo de aparecer no diretório. Isto não altera o perfil real nem a página de visitante.' : 'Simulate Waldo choosing whether to appear in the directory. This does not change a real profile or the visitor page.'}</p>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={showWaldo} onChange={e => setShowWaldo(e.target.checked)} className="h-4 w-4 accent-[#927018]" />{pt ? 'Waldo autoriza a apresentação no diretório' : 'Waldo permits directory listing'}</label>
          <p className="mt-3 text-xs text-[#666]">{pt ? 'O campo Fundador está oculto por defeito. Pesquisas não incluem campos ocultos nem perfis sem autorização.' : 'Founder is hidden by default. Search excludes hidden fields and profiles without directory consent.'}</p>
        </section>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={directoryBase} className="rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319]">{pt ? '← Voltar ao editor FPP' : '← Back to FPP editor'}</Link>
          <Link href={pt ? '/pt/cartoes' : '/en/cards'} className="rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319]">{pt ? 'Cartões Digitais' : 'Digital Cards'}</Link>
        </div>
        <p className="mt-5 text-xs leading-6 text-[#666]">{pt ? 'Antes de publicar perfis reais: autenticação, consentimento explícito, aplicação das permissões no servidor, verificação com âmbito definido, moderação e proteção contra abuso.' : 'Before listing real people: authentication, explicit consent, server-enforced permissions, scoped verification, moderation and abuse protection.'}</p>
      </div>
    </main>
  );
}

