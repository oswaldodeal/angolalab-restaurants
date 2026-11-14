import { ClerkProvider, SignIn, SignOutButton, SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { enGB, ptPT } from '@clerk/localizations';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AccountUnavailable from './AccountUnavailable';
import { accountsConfigured } from '@/lib/account-auth';

type Props = {
  language: 'en' | 'pt';
  mode: 'sign-in' | 'sign-up' | 'account';
};

export default async function PilotAccountPage({ language, mode }: Props) {
  if (!accountsConfigured()) return <AccountUnavailable language={language} />;

  const pt = language === 'pt';
  const signInUrl = pt ? '/pt/entrar' : '/en/signin';
  const signUpUrl = pt ? '/pt/registar' : '/en/signup';
  const accountUrl = pt ? '/pt/conta' : '/en/account';
  const { userId } = await auth();

  if (mode === 'account' && !userId) redirect(signInUrl);
  if (mode !== 'account' && userId) redirect(accountUrl);

  return (
    <ClerkProvider localization={pt ? ptPT : enGB} signInUrl={signInUrl} signUpUrl={signUpUrl}
      signInForceRedirectUrl={accountUrl} signUpForceRedirectUrl={accountUrl}>
      <section className="flex min-h-[65vh] justify-center bg-white px-5 py-12 text-[#242424]">
        {mode === 'sign-in' && <SignIn routing="hash" />}
        {mode === 'sign-up' && <SignUp routing="hash" />}
        {mode === 'account' && (
          <div className="w-full max-w-xl self-start rounded-xl border border-[#ded8c5] p-8">
            <h1 className="text-3xl font-semibold">{pt ? 'A sua conta AngolaLab' : 'Your AngolaLab account'}</h1>
            <p className="mt-4">{pt ? 'Sessão iniciada no piloto privado.' : 'You are signed in to the private pilot.'}</p>
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
