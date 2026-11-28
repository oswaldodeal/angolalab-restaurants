import Link from 'next/link';
import { notFound } from 'next/navigation';
import { accountsConfigured } from '@/lib/account-auth';
import { getFppVisitorProfile } from '@/lib/fpp-community';

export default async function FppVisitorProfile({ id, language }: { id: string; language: 'en' | 'pt' }) {
  if (!accountsConfigured() || !/^[a-f0-9-]{36}$/.test(id)) notFound();

  const profile = await getFppVisitorProfile(id, language);
  if (!profile) notFound();
  const pt = language === 'pt';

  return (
    <section className="min-h-[65vh] bg-[#f3f2ef] px-5 py-12 text-[#222]">
      <div className="mx-auto max-w-3xl">
        <article className="rounded-2xl border border-[#ded8c5] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            {profile.hasPhoto && <img src={'/api/fpp/photo/' + id} width={80} height={80} alt="" className="size-20 rounded-full object-cover" />}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#76570f]">{profile.businessId ? (pt ? 'Perfil Empresarial' : 'Business Profile') : (pt ? 'Perfil Profissional' : 'Professional Profile')}</p>
              <h1 className="mt-1 break-words text-3xl font-semibold">{profile.displayName}</h1>
            </div>
          </div>
          {profile.businessId && <Link href={(pt ? '/pt/restaurantes/' : '/en/restaurants/') + profile.businessId}
            className="mt-5 inline-block font-semibold text-emerald-800 underline underline-offset-4">
            {pt ? 'O nosso restaurante' : 'Our Restaurant'}
          </Link>}
          {profile.details.length > 0 && <dl className="mt-6 grid gap-5 border-t border-[#ded8c5] pt-6 sm:grid-cols-2">
            {profile.details.map(detail => <div key={detail.key} className="min-w-0">
              <dt className="font-semibold">{detail.label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words">{detail.value}</dd>
            </div>)}
          </dl>}
        </article>
      </div>
    </section>
  );
}
