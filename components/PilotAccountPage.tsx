import RestaurantOrders from '@/components/RestaurantOrders';
import { withRestaurantReferral } from '@/lib/restaurant-referral';
import AccountComments from '@/components/AccountComments';
import OwnerRestaurants from '@/components/OwnerRestaurants';
import { ClerkProvider, SignIn, SignOutButton, SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { enGB, ptPT } from '@clerk/localizations';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AccountUnavailable from './AccountUnavailable';
import { accountsConfigured } from '@/lib/account-auth';

type Props = {
  language: 'en' | 'pt';
  restaurantId?: string;
  mode: 'sign-in' | 'sign-up' | 'account';
};

export default async function PilotAccountPage({ language, mode, restaurantId }: Props) {
  if (!accountsConfigured()) return <AccountUnavailable language={language} />;

  const pt = language === 'pt';
  const signInUrl = withRestaurantReferral(pt ? '/pt/entrar' : '/en/signin', restaurantId);
  const signUpUrl = withRestaurantReferral(pt ? '/pt/registar' : '/en/signup', restaurantId);
  const accountUrl = withRestaurantReferral(pt ? '/pt/conta' : '/en/account', restaurantId);
  const { userId } = await auth();

  if (mode === 'account' && !userId) redirect(signInUrl);
  if (mode !== 'account' && userId) redirect(accountUrl);

  return (
    <ClerkProvider localization={pt ? ptPT : enGB} signInUrl={signInUrl} signUpUrl={signUpUrl}
      signInForceRedirectUrl={accountUrl} signUpForceRedirectUrl={accountUrl}>
      <section className="flex min-h-[65vh] justify-center bg-white px-5 py-12 text-[#242424]">
        {mode === 'sign-in' && <SignIn routing="hash" />}
        {mode === 'sign-up' && (
          <div className="flex w-full max-w-md flex-col items-center gap-5">
            <aside aria-labelledby="responsible-use-heading" className="w-full rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-4 text-sm leading-relaxed">
              <h2 id="responsible-use-heading" className="font-semibold">{pt ? 'Usa o AngolaLab com responsabilidade' : 'Use AngolaLab responsibly'}</h2>
              <p className="mt-2">{pt
                ? 'Não faça pedidos falsos, não assedie clientes ou funcionários e não use outra conta para contornar um bloqueio. O uso indevido pode levar ao bloqueio do seu número de telefone verificado e à perda de acesso às funcionalidades que exigem uma conta verificada em toda a AngolaLab, incluindo através de códigos QR já em circulação.'
                : 'Do not place fake orders, harass customers or staff, or use another account to get around a block. Abuse may lead to your verified phone number being blocked and loss of access to features that require a verified account across AngolaLab, including through QR codes already in circulation.'}</p>
            </aside>
            <SignUp routing="hash" />
          </div>
        )}
        {mode === 'account' && (
          <div className="w-full max-w-4xl self-start rounded-xl border border-[#ded8c5] p-8">
            <h1 className="text-3xl font-semibold">{pt ? 'A sua conta AngolaLab' : 'Your AngolaLab account'}</h1>
            <p className="mt-4">{pt ? 'Sessão iniciada no piloto privado.' : 'You are signed in to the private pilot.'}</p>
            {userId && <RestaurantOrders userId={userId} language={language} restaurantId={restaurantId} />}
            {userId && <OwnerRestaurants userId={userId} language={language} />}
            {userId && <AccountComments userId={userId} language={language} restaurantId={restaurantId} />}
            {userId && <details className="mt-6 text-sm">
              <summary className="cursor-pointer text-emerald-700">{pt ? 'ID da minha conta' : 'My account ID'}</summary>
              <code className="mt-2 block select-all break-all rounded bg-[#f4f3ef] p-3">{userId}</code>
            </details>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link className="font-semibold text-[#76570f] underline" href={pt ? '/pt/restaurantes' : '/en/restaurants'}>
                {pt ? 'Ver restaurantes' : 'Browse Restaurants'}
              </Link>
              <SignOutButton redirectUrl={signInUrl}>
                <button type="button" className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white">
                  {pt ? 'Terminar sessão' : 'Sign out'}
                </button>
              </SignOutButton>
            </div>
          </div>
        )}
      </section>
    </ClerkProvider>
  );
}
