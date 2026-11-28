'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FppDirectoryProfile } from '@/lib/fpp-community';

const filterStyle = 'rounded-lg px-4 py-2 text-sm font-semibold aria-pressed:bg-[#252a32] aria-pressed:text-white border border-[#c9c9c4]';

function searchable(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export default function FppDirectory({ language, profiles }: {
  language: 'en' | 'pt';
  profiles: FppDirectoryProfile[] | null;
}) {
  const pt = language === 'pt';
  const [search, setSearch] = useState('');
  const [introductions, setIntroductions] = useState(false);
  const community = pt ? '/pt/profissionais' : '/en/professionals';
  const visitorBase = community + (pt ? '/perfil/' : '/profile/');
  const query = searchable(search.trim());
  const results = profiles?.filter(profile =>
    (!introductions || profile.introductions) &&
    searchable([profile.name, profile.profession, profile.skills].join(' ')).includes(query)
  );

  return (
    <section className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-6 sm:p-9">
          <h1 className="text-3xl font-bold sm:text-4xl">{pt ? 'Descubra pessoas e competências' : 'Discover People & Skills'}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#555]">
            {pt ? 'Encontre profissionais, investigadores e criadores de projetos que já publicaram na comunidade. Os detalhes do perfil aparecem com autorização do titular.'
              : 'Find professionals, researchers and project builders who have published in the community. Profile details appear with the owner’s permission.'}
          </p>
        </div>

        {profiles && profiles.length > 0 && <section className="mt-6 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-7" aria-label={pt ? 'Pesquisar diretório' : 'Search directory'}>
          <label htmlFor="fpp-directory-search" className="block text-sm font-bold">{pt ? 'Pesquisar por nome, profissão ou competências' : 'Search by name, profession or skills'}</label>
          <input id="fpp-directory-search" type="search" maxLength={120} value={search} onChange={event => setSearch(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#c9c9c4] bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-[#927018]" />
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={pt ? 'Filtrar perfis' : 'Filter profiles'}>
            <button type="button" aria-pressed={!introductions} onClick={() => setIntroductions(false)} className={filterStyle}>
              {pt ? 'Todos os perfis' : 'All profiles'}
            </button>
            <button type="button" aria-pressed={introductions} onClick={() => setIntroductions(true)} className={filterStyle}>
              {pt ? 'Aceitam apresentações' : 'Welcome introductions'}
            </button>
          </div>
          <p role="status" className="mt-4 text-sm text-[#555]">
            {results?.length === 1 ? (pt ? '1 perfil encontrado' : '1 profile found')
              : pt ? `${results?.length} perfis encontrados` : `${results?.length} profiles found`}
          </p>
        </section>}

        <section className="mt-6" aria-label={pt ? 'Resultados do diretório' : 'Directory results'}>
          {(!results || results.length === 0) ? (
            <p className="rounded-xl border border-[#dedbd3] bg-white p-6 text-sm text-[#555]">
              {results === undefined ? (pt ? 'O diretório está temporariamente indisponível.' : 'The directory is temporarily unavailable.')
                : profiles?.length ? (pt ? 'Nenhum perfil corresponde à pesquisa.' : 'No profiles match your search.')
                : (pt ? 'Ainda não há perfis individuais com publicações na comunidade.' : 'No individual profiles have published in the community yet.')}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(profile => <article key={profile.id} className="flex min-w-0 flex-col rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  {profile.hasPhoto
                    ? <img src={'/api/fpp/photo/' + profile.id} alt="" loading="lazy" width={56} height={56} className="size-14 shrink-0 rounded-full object-cover" />
                    : <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-xl font-bold text-[#5f4a18]">{Array.from(profile.name)[0]}</span>}
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-bold">
                      <Link href={visitorBase + profile.id} className="text-emerald-800 underline-offset-4 hover:underline focus-visible:underline">{profile.name}</Link>
                    </h2>
                    {profile.profession && <p className="mt-1 break-words text-sm text-[#555]">{profile.profession}</p>}
                  </div>
                </div>
                {profile.skills && <div className="mt-4 text-sm">
                  <p className="font-semibold">{pt ? 'Competências' : 'Skills'}</p>
                  <p className="mt-1 break-words">{profile.skills}</p>
                </div>}
                {profile.languages && <div className="mt-3 text-sm">
                  <p className="font-semibold">{pt ? 'Idiomas' : 'Languages'}</p>
                  <p className="mt-1 break-words">{profile.languages}</p>
                </div>}
                {profile.introductions && <p className="mt-3 text-sm text-emerald-800">{pt ? 'Aceita apresentações profissionais' : 'Welcomes professional introductions'}</p>}
              </article>)}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
