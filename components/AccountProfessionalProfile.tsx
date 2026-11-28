import Link from 'next/link';
import FppVisitorSettings from './FppVisitorSettings';
import { getFppVisitorSettings } from '@/lib/fpp-visitor-storage';
import FppParticipation from './FppParticipation';
import { getFppBusinesses, getOwnFppPosts } from '@/lib/fpp-community';
import { isPilotContactBlocked, verifiedContactKeys } from '@/lib/pilot-access-blocks';
import ProfessionalProfileForm from './ProfessionalProfileForm';
import { getProfessionalProfile } from '@/lib/professional-profile';

export default async function AccountProfessionalProfile({ userId, language }: { userId: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const profile = await getProfessionalProfile(userId).catch(() => undefined);
  const settings = profile ? await getFppVisitorSettings(userId).catch(() => null) : null;
  const participation = profile ? await Promise.all([
    getOwnFppPosts(userId),
    verifiedContactKeys(userId).then(isPilotContactBlocked),
    getFppBusinesses(userId).catch(() => []),
  ]).catch(() => null) : null;

  return (
    <section id="professional-profile" aria-labelledby="account-community-heading" className="mt-6 scroll-mt-28">
      <h2 id="account-community-heading" className="text-xl font-semibold">
        {pt ? 'Comunidade da AngolaLab' : 'AngolaLab Community'}
      </h2>
      <details className="mt-3 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-4 sm:p-6">
        <summary className="cursor-pointer font-semibold text-emerald-800">
          {pt ? 'O meu perfil profissional gratuito' : 'My Free Professional Profile'}
        </summary>
        <p className="mt-3 text-sm">
          {pt ? 'Guarda o teu perfil privado para partilhar ideias de negócio, perguntas, projetos e avisos.'
            : 'Save your private profile to share business ideas, questions, projects and announcements.'}
        </p>
        {profile === undefined
          ? <p className="mt-3 text-sm text-red-700">{pt ? 'O perfil está temporariamente indisponível.' : 'Your profile is temporarily unavailable.'}</p>
          : <ProfessionalProfileForm language={language} profile={profile} />}
        {profile && settings && <FppVisitorSettings profile={profile} settings={settings} language={language} />}
        {profile && !settings && <p role="alert" className="mt-4 text-sm text-red-700">{pt ? 'Não foi possível carregar as preferências do perfil.' : 'Unable to load profile preferences.'}</p>}
        {participation ? <FppParticipation language={language} posts={participation[0]} blocked={participation[1]} businesses={participation[2]} />
          : profile && <p role="alert" className="mt-4 text-sm text-red-700">{pt ? 'Não foi possível carregar o acesso ao FPP.' : 'Unable to load FPP access.'}</p>}
        <Link href={pt ? '/pt/profissionais' : '/en/professionals'} className="mt-4 inline-block font-semibold text-emerald-800 underline">
          {pt ? 'Ver Comunidade da AngolaLab' : 'View AngolaLab Community'}
        </Link>
      </details>
    </section>
  );
}
