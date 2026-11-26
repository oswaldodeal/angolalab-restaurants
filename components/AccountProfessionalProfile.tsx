import Link from 'next/link';
import FppParticipation from './FppParticipation';
import { getFppAccount } from '@/lib/fpp-community';
import ProfessionalProfileForm from './ProfessionalProfileForm';
import { getProfessionalProfile } from '@/lib/professional-profile';

export default async function AccountProfessionalProfile({ userId, language }: { userId: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const profile = await getProfessionalProfile(userId).catch(() => undefined);
  const access = profile ? await getFppAccount(userId).catch(() => null) : null;

  return (
    <details id="professional-profile" className="mt-6 scroll-mt-28 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-4 sm:p-6">
      <summary className="cursor-pointer font-semibold text-emerald-800">
        {pt ? 'O meu perfil profissional gratuito' : 'My Free Professional Profile'}
      </summary>
      <p className="mt-3 text-sm">
        {pt ? 'Guarda um perfil privado e pede acesso para participar na comunidade FPP.'
          : 'Save a private profile and request access to take part in the FPP community.'}
      </p>
      {profile === undefined
        ? <p className="mt-3 text-sm text-red-700">{pt ? 'O perfil está temporariamente indisponível.' : 'Your profile is temporarily unavailable.'}</p>
        : <ProfessionalProfileForm language={language} profile={profile} />}
      {access ? <FppParticipation language={language} status={access.status} posts={access.posts} />
        : profile && <p role="alert" className="mt-4 text-sm text-red-700">{pt ? 'Não foi possível carregar o acesso ao FPP.' : 'Unable to load FPP access.'}</p>}
      <Link href={pt ? '/pt/profissionais' : '/en/professionals'} className="mt-4 inline-block font-semibold text-emerald-800 underline">
        {pt ? 'Ver comunidade FPP' : 'View FPP community'}
      </Link>
    </details>
  );
}
