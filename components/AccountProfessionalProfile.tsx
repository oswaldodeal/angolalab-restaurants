import ProfessionalProfileForm from './ProfessionalProfileForm';
import { getProfessionalProfile } from '@/lib/professional-profile';

export default async function AccountProfessionalProfile({ userId, language }: { userId: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const profile = await getProfessionalProfile(userId).catch(() => undefined);

  return (
    <details id="professional-profile" className="mt-6 scroll-mt-28 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-4 sm:p-6">
      <summary className="cursor-pointer font-semibold text-emerald-800">
        {pt ? 'O meu perfil profissional gratuito' : 'My Free Professional Profile'}
      </summary>
      <p className="mt-3 text-sm">
        {pt ? 'Guarda as tuas competências, idiomas e projetos. O perfil é privado nesta fase do piloto.'
          : 'Save your skills, languages and projects. Your profile is private during this stage of the pilot.'}
      </p>
      {profile === undefined
        ? <p className="mt-3 text-sm text-red-700">{pt ? 'O perfil está temporariamente indisponível.' : 'Your profile is temporarily unavailable.'}</p>
        : <ProfessionalProfileForm language={language} profile={profile} />}
    </details>
  );
}
