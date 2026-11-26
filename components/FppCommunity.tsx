import Link from 'next/link';
import { accountsConfigured } from '@/lib/account-auth';
import { getPublishedFppPosts } from '@/lib/fpp-community';
import { fppPostTypes } from '@/lib/fpp-posts';
import { withRestaurantReferral } from '@/lib/restaurant-referral';

export default async function FppCommunity({ language, restaurantId }: { language: 'en' | 'pt'; restaurantId?: string }) {
  const pt = language === 'pt';
  const posts = accountsConfigured() ? await getPublishedFppPosts().catch(() => null) : null;
  const signup = withRestaurantReferral(pt ? '/pt/registar' : '/en/signup', restaurantId);
  const account = withRestaurantReferral(pt ? '/pt/conta' : '/en/account', restaurantId);

  return (
    <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-12 text-[#222]">
      <h1 className="text-3xl font-semibold">{pt ? 'Comunidade FPP' : 'FPP community'}</h1>
      <p className="mt-3">{pt ? 'Partilha ideias de negócio, faz perguntas e apresenta os teus projetos.' : 'Share business ideas, ask questions and show what you’re working on.'}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-[#D2AC37] pb-6">
        <Link href={signup} className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white">
          {pt ? 'Criar conta AngolaLab' : 'Create an AngolaLab account'}
        </Link>
        <Link href={account + '#professional-profile'} className="font-semibold text-emerald-800 underline">
          {pt ? 'A minha conta' : 'My account'}
        </Link>
      </div>
      <section aria-label={pt ? 'Publicações recentes' : 'Recent posts'} className="mt-6 space-y-4">
        {posts === null && <p>{pt ? 'As publicações estão temporariamente indisponíveis.' : 'Posts are temporarily unavailable.'}</p>}
        {posts?.length === 0 && <p>{pt ? 'Ainda não há publicações.' : 'No posts yet.'}</p>}
        {posts?.map(post => <article key={post.id} className="rounded-xl border border-[#ded8c5] bg-white p-5">
          <p className="text-sm font-semibold text-emerald-800">{fppPostTypes[post.kind][language]}</p>
          <h2 className="mt-2 break-words text-xl font-semibold">{post.title}</h2>
          <p className="mt-1 break-words text-sm">{post.author_name}</p>
          <p className="mt-3 whitespace-pre-wrap break-words">{post.body}</p>
        </article>)}
      </section>
    </main>
  );
}
