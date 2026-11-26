import Link from 'next/link';
import { getPublishedRestaurant } from '@/lib/restaurant-data';
import { withRestaurantReferral } from '@/lib/restaurant-referral';

export default async function RestaurantRegistrationEntry({ language, id }: { language: 'en' | 'pt'; id: string }) {
  const restaurant = await getPublishedRestaurant(id, language).catch(() => null);
  if (!restaurant) return null;
  const pt = language === 'pt';
  const signup = withRestaurantReferral(pt ? '/pt/registar' : '/en/signup', id);
  const signin = withRestaurantReferral(pt ? '/pt/entrar' : '/en/signin', id);
  return <section className="mx-auto my-8 max-w-4xl rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-6 text-[#242424]">
    <h1 className="text-2xl font-semibold">{pt ? 'Criar conta AngolaLab' : 'Create an AngolaLab account'}</h1>
    <p className="mt-3">{pt ? 'Convite de' : 'Invited by'} <strong>{restaurant.name}</strong></p>
    <p className="mt-3">{pt ? 'As Conexões Digitais ajudam a descobrir negócios e profissionais. Na Comunidade AngolaLab, podes partilhar ideias de negócio, perguntas, projetos e avisos.' : 'Digital Connections helps you discover businesses and professionals. In the AngolaLab Community, you can share business ideas, questions, projects and announcements.'}</p>
    <div className="mt-4 flex flex-wrap gap-4">
      <Link href={signup} className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white">{pt ? 'Criar conta' : 'Create account'}</Link>
      <Link href={signin} className="rounded-lg px-4 py-2 font-semibold text-emerald-700 underline">{pt ? 'Entrar' : 'Sign in'}</Link>
    </div>
    <div className="mt-3 flex flex-wrap gap-4 text-sm">
      <Link href={pt ? '/pt/cartoes' : '/en/cards'} className="text-emerald-700 underline">{pt ? 'Ver demonstração do Cartão Digital' : 'Explore the Digital Card demo'}</Link>
      <Link href={withRestaurantReferral(pt ? '/en/professionals' : '/pt/profissionais', id)} className="text-emerald-700 underline" lang={pt ? 'en' : 'pt'}>{pt ? 'Continue in English' : 'Continuar em português'}</Link>
    </div>
    <details className="mt-5 text-sm">
      <summary className="cursor-pointer font-semibold">{pt ? 'Condições para comentar no piloto' : 'Pilot commenting conditions'}</summary>
      <p className="mt-2">{pt ? 'Só utilizadores verificados pela equipa AngolaLab podem comentar. Escolha um prato ou bebida que experimentou e autorize a publicação com o seu nome público. Não inclua dados privados. A equipa analisa cada comentário antes da publicação.' : 'Only users verified by AngolaLab staff can comment. Choose a dish or drink you tried and consent to publication under your public name. Keep private details out of the comment. Staff review each comment before publication.'}</p>
    </details>
    <p className="mt-5 font-semibold text-[#76570f]">{pt ? 'Construindo ligações para Angola.' : 'Building connections for Angola.'}</p>
  </section>;
}
