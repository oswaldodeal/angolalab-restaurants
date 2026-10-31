'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ChangeEvent } from 'react';

type Language = 'en' | 'pt';
type Field = 'photo' | 'profession' | 'skills' | 'languages' | 'interests' | 'publication' | 'collaboration' | 'instagram' | 'facebook';
const defaults: Record<Field, boolean> = {photo:false, profession:true, skills:true, languages:true, interests:true, publication:true, collaboration:true, instagram:false, facebook:false};
function safeSocial(input: string, network: 'instagram' | 'facebook') {
  try {
    const url = new URL(input);
    const hosts = network === 'instagram' ? ['instagram.com','www.instagram.com'] : ['facebook.com','www.facebook.com','m.facebook.com'];
    if (url.protocol !== 'https:' || !hosts.includes(url.hostname.toLowerCase()) || url.username || url.password || url.port || url.pathname === '/' || url.pathname.startsWith('/sharer') || url.pathname.startsWith('/dialog')) return null;
    return url.origin + url.pathname;
  } catch { return null; }
}

export default function ProfessionalProfileDemo({ language }: { language: Language }) {
  const pt = language === 'pt';
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Waldo',
    profession: 'Web Developer',
    skills: 'Web development, Website building',
    languages: 'English, Portuguese, Dutch',
    interests: 'Reading, Writing, Technology',
    publication: 'The Structure Beneath the Noise',
    collaboration: 'Education projects, technology and international collaboration',
    instagram: '', facebook: '',
  });
  const [draft, setDraft] = useState(profile);
  const [photo, setPhoto] = useState<string | null>(null);
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [visibility, setVisibility] = useState(defaults);
  const [draftVisibility, setDraftVisibility] = useState(defaults);
  const [visitor, setVisitor] = useState(false);
  const [socialError, setSocialError] = useState('');
  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      setPhotoError(pt ? 'Use JPG, PNG ou WebP até 3 MB.' : 'Use JPG, PNG or WebP up to 3 MB.');
      event.target.value = '';
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') setDraftPhoto(reader.result); };
    reader.readAsDataURL(file);
    event.target.value = '';
  }
  const fields = [
    { key: 'name', label: pt ? 'Nome de apresentação' : 'Display name', required: true },
    { key: 'profession', label: pt ? 'Profissão' : 'Profession', required: true },
    { key: 'skills', label: pt ? 'Competências (separadas por vírgulas)' : 'Skills (comma separated)', required: true },
    { key: 'languages', label: pt ? 'Idiomas (separados por vírgulas)' : 'Languages (comma separated)', required: true },
    { key: 'interests', label: pt ? 'Interesses' : 'Interests', required: false },
    { key: 'publication', label: pt ? 'Publicação (opcional)' : 'Publication (optional)', required: false },
    { key: 'collaboration', label: pt ? 'Projetos e colaboração' : 'Projects and collaboration', required: false },
  ] as const;
  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((draft.instagram.trim() && !safeSocial(draft.instagram, 'instagram')) || (draft.facebook.trim() && !safeSocial(draft.facebook, 'facebook'))) {
      setSocialError(pt ? 'Use links HTTPS válidos de Instagram ou Facebook.' : 'Use valid HTTPS Instagram or Facebook links.');
      return;
    }
    setSocialError('');
    setVisibility(draftVisibility);
    setProfile(Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as typeof profile);
    setPhoto(draftPhoto);
    setEditing(false);
  }
  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">
          {pt ? 'AngolaLab · Conexões digitais' : 'AngolaLab · Digital Connections'}
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          {pt ? 'Perfil profissional gratuito' : 'Free Professional Profile'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555]">
          {pt
            ? 'Conheça as competências, os interesses e os projetos de outras pessoas. Esta página é uma demonstração fictícia: não existem perfis públicos nem pedidos de ligação ativos.'
            : 'Discover people through their skills, interests and projects. This is a fictional demonstration: no public profiles or connection requests are active.'}
        </p>

        <section className="mt-7 min-w-0 rounded-2xl border border-[#dedbd3] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{pt ? 'Crie o seu perfil · Teste' : 'Create your profile · Test'}</h2>
              <p className="mt-1 text-sm text-[#666]">{pt ? 'Edite os dados fictícios e veja a pré-visualização abaixo.' : 'Edit the sample details and preview your profile below.'}</p>
            </div>
            {!editing && <button type="button" onClick={() => { setDraft(profile); setDraftPhoto(photo); setDraftVisibility(visibility); setPhotoError(''); setSocialError(''); setEditing(true); }}
              className="rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#424850]">
              {pt ? 'Criar / editar perfil' : 'Create / edit profile'}
            </button>}
          </div>
          {editing && <form onSubmit={submitProfile} className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(({ key, label, required }) => <label key={key} className="block min-w-0 text-sm font-semibold text-[#333]">
              {label}
              <input type="text" maxLength={160} required={required} value={draft[key]}
                onChange={event => setDraft(previous => ({ ...previous, [key]: event.target.value }))}
                className="mt-2 block min-w-0 w-full max-w-full rounded-lg border border-[#c9c9c4] bg-white px-3 py-3 font-normal text-[#252525] focus-visible:outline-2 focus-visible:outline-[#927018]" />
            </label>)}
            <div className="min-w-0 rounded-xl border border-[#dedbd3] p-4 sm:col-span-2">
              <h3 className="text-sm font-bold">{pt ? 'Redes sociais (opcional)' : 'Social media (optional)'}</h3>
              {(['instagram', 'facebook'] as const).map(network => (
                <label key={network} className="mt-3 block min-w-0 text-sm font-semibold">
                  {network === 'instagram' ? 'Instagram' : 'Facebook'}
                  <input type="url" inputMode="url" maxLength={300} placeholder={network === 'instagram' ? 'https://www.instagram.com/yourprofile/' : 'https://www.facebook.com/yourprofile'}
                    value={draft[network]} onChange={event => {setDraft(p => ({...p,[network]:event.target.value}));setSocialError('');}}
                    className="mt-1 block w-full min-w-0 rounded-lg border border-[#c9c9c4] px-3 py-3 font-normal" />
                </label>
              ))}
              {socialError && <p role="alert" className="mt-2 text-sm text-red-700">{socialError}</p>}
            </div>
            <fieldset className="min-w-0 rounded-xl border border-[#dedbd3] p-4 sm:col-span-2">
              <legend className="px-1 text-sm font-bold">{pt ? 'Visibilidade do perfil' : 'Profile visibility'}</legend>
              <p className="mb-3 text-xs text-[#666]">{pt ? 'Escolha o que o visitante pode ver. O nome permanece visível. Apenas simulação local.' : 'Choose what visitors can see. Name stays visible. Local demonstration only.'}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {([
                  ['photo', pt ? 'Fotografia' : 'Photo'], ['profession', pt ? 'Profissão' : 'Profession'],
                  ['skills', pt ? 'Competências' : 'Skills'], ['languages', pt ? 'Idiomas' : 'Languages'],
                  ['interests', pt ? 'Interesses' : 'Interests'], ['publication', pt ? 'Publicação' : 'Publication'],
                  ['collaboration', pt ? 'Colaboração' : 'Collaboration'], ['instagram', 'Instagram'], ['facebook', 'Facebook']
                ] as [Field,string][]).map(([key,label]) => <label key={key} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={draftVisibility[key]} onChange={event => setDraftVisibility(p => ({...p,[key]:event.target.checked}))} className="h-4 w-4 accent-[#927018]" />{label}
                </label>)}
              </div>
            </fieldset>
            <div className="min-w-0 max-w-full rounded-xl border border-[#dedbd3] p-4 sm:col-span-2">
              <label htmlFor="fpp-photo" className="block text-sm font-semibold">{pt ? 'Fotografia de perfil (opcional)' : 'Profile photo (optional)'}</label>
              <p className="mt-1 text-xs text-[#666]">{pt ? 'JPG, PNG ou WebP, até 3 MB. Apenas neste dispositivo; sem envio para o servidor.' : 'JPG, PNG or WebP, up to 3 MB. On-device preview only; no server upload.'}</p>
              {draftPhoto && <img src={draftPhoto} alt={pt ? 'Pré-visualização' : 'Photo preview'} className="mt-3 h-24 w-24 rounded-full object-cover" />}
              <input id="fpp-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} className="mt-3 block w-full min-w-0 max-w-full text-sm" />
              {draftPhoto && <button type="button" onClick={() => setDraftPhoto(null)} className="mt-2 rounded-lg border px-3 py-2 text-sm">{pt ? 'Remover fotografia' : 'Remove photo'}</button>}
              {photoError && <p role="alert" className="mt-2 text-sm text-red-700">{photoError}</p>}
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" className="rounded-lg bg-[#252a32] px-5 py-3 text-sm font-semibold text-white">
                {pt ? 'Atualizar pré-visualização' : 'Update preview'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[#ccc] px-5 py-3 text-sm font-semibold">
                {pt ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </form>}
          <p className="mt-4 text-xs leading-5 text-[#666]">
            {pt ? 'Apenas teste: os dados ficam na memória desta página, não são guardados nem publicados e desaparecem ao atualizar a página. Não introduza informações privadas.' : 'Test only: entries remain in this page’s memory, are not saved or published, and disappear on refresh. Do not enter private information.'}
          </p>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
          <span className="text-sm font-semibold">{pt ? 'Pré-visualização da privacidade' : 'Privacy preview'}</span>
          <button type="button" onClick={() => setVisitor(p => !p)} className="rounded-lg bg-[#252a32] px-4 py-3 text-sm font-semibold text-white">
            {visitor ? (pt ? 'Vista do titular' : 'Owner view') : (pt ? 'Vista do visitante' : 'Visitor view')}
          </button>
        </div>
        <section aria-label={pt ? 'Perfil de demonstração' : 'Demonstration profile'}
          className="mt-8 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-sm">
          <div className="h-3 bg-[#b6923b]" />
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-start gap-5">
              {photo && (!visitor || visibility.photo) ? <img src={photo} alt={pt ? 'Fotografia do perfil' : 'Profile photograph'} className="h-20 w-20 shrink-0 rounded-full object-cover" /> : <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-3xl font-bold text-[#5f4a18]">{profile.name.trim().charAt(0).toUpperCase() || '?'}</div>}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a20]">
                  {pt ? 'Perfil fictício · Não publicado' : 'Fictional profile · Not published'}
                </p>
                <h2 className="mt-1 break-words text-2xl font-bold">{profile.name}</h2>
                {(!visitor || visibility.profession) && <p className="mt-1 text-base text-[#555]">{profile.profession}</p>}
                {(!visitor || visibility.collaboration) && <p className="mt-2 text-sm text-[#666]">{profile.collaboration}</p>}
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {(!visitor || visibility.skills) && <div className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Competências' : 'Skills'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{profile.skills}</p>
              </div>}
              {(!visitor || visibility.languages) && <div className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Idiomas' : 'Languages'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{profile.languages}</p>
              </div>}
              {(!visitor || visibility.interests) && <div className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Interesses' : 'Interests'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{profile.interests}</p>
              </div>}
              {(!visitor || visibility.publication) && <div className="min-w-0 rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Publicação de exemplo' : 'Example publication'}</h3>
                <p className="mt-2 text-sm italic leading-6 text-[#555]">{profile.publication || (pt ? 'Não indicado' : 'Not specified')}</p>
              </div>}
            </div>

            {(safeSocial(profile.instagram, 'instagram') || safeSocial(profile.facebook, 'facebook')) && (
              <div className="mt-6 rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Redes sociais' : 'Social media'}</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(!visitor || visibility.instagram) && safeSocial(profile.instagram, 'instagram') && <a href={safeSocial(profile.instagram, 'instagram')!} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-white px-4 py-3 text-sm font-semibold">Instagram ↗</a>}
                  {(!visitor || visibility.facebook) && safeSocial(profile.facebook, 'facebook') && <a href={safeSocial(profile.facebook, 'facebook')!} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-white px-4 py-3 text-sm font-semibold">Facebook ↗</a>}
                </div>
              </div>
            )}
            <div className="mt-7 rounded-xl border border-[#e4d5a6] bg-[#fff9e9] p-5">
              <h3 className="font-bold">{pt ? 'Colaboração' : 'Collaboration'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#555]">
                {pt
                  ? 'Imagine que está a desenvolver um projeto e procura alguém com estas competências. No futuro, poderá pedir uma ligação e decidir em conjunto se querem colaborar.'
                  : 'Imagine you are building a project and need these skills. In future, you could request a connection and decide together whether to collaborate.'}
              </p>
              <button type="button" disabled aria-disabled="true"
                className="mt-4 cursor-not-allowed rounded-lg bg-[#dedbd3] px-5 py-3 text-sm font-semibold text-[#666]">
                {pt ? 'Pedir ligação · Em desenvolvimento' : 'Request connection · Planned'}
              </button>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#666]">
              {pt
                ? 'Privacidade primeiro: os futuros titulares escolherão o que partilhar. Nenhuma mensagem é enviada nesta demonstração.'
                : 'Privacy first: future profile owners will choose what to share. No messages are sent in this demonstration.'}
            </p>
          </div>
        </section>
        <Link href={pt ? '/pt/cartoes' : '/en/cards'} className="mt-7 inline-flex rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319] hover:bg-[#fff9e9]">
          {pt ? '← Voltar aos Cartões Digitais' : '← Back to Digital Cards'}
        </Link>
      </div>
    </main>
  );
}
