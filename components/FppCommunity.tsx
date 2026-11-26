import { auth } from '@clerk/nextjs/server';
import { getProfessionalProfile } from '@/lib/professional-profile';
import { getPublishedFppComments } from '@/lib/fpp-comments';
import FppCommentForm from './FppCommentForm';
import Link from 'next/link';
import { accountsConfigured } from '@/lib/account-auth';
import { getPublishedFppPosts } from '@/lib/fpp-community';
import { fppPostTypes } from '@/lib/fpp-posts';
import { withRestaurantReferral } from '@/lib/restaurant-referral';

export default async function FppCommunity({ language, restaurantId }: { language: 'en' | 'pt'; restaurantId?: string }) {
  const pt = language === 'pt';
  const [posts, user] = accountsConfigured()
    ? await Promise.all([getPublishedFppPosts().catch(() => null), auth()])
    : [null, null];
  const comments = await getPublishedFppComments(posts?.map(post => post.id) ?? []).catch(() => null);
  const profile = user?.userId ? await getProfessionalProfile(user.userId).catch(() => null) : null;
  const commentsByPost = new Map<string, NonNullable<typeof comments>>();
  for (const comment of comments ?? []) {
    const group = commentsByPost.get(comment.post_id) ?? [];
    group.push(comment);
    commentsByPost.set(comment.post_id, group);
  }
  const tiers = pt
    ? { basic: 'Perfil Básico', verified: 'Perfil Verificado', pro: 'Perfil Pro' }
    : { basic: 'Basic profile', verified: 'Verified profile', pro: 'Pro profile' };
  const signup = withRestaurantReferral(pt ? '/pt/registar' : '/en/signup', restaurantId);
  const account = withRestaurantReferral(pt ? '/pt/conta' : '/en/account', restaurantId);

  return (
    <section className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
      <div className="mx-auto max-w-5xl">
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
          {posts?.map(post => <article key={post.id} id={'post-' + post.id} className="rounded-xl border border-[#ded8c5] bg-white p-5">
            <p className="text-sm font-semibold text-emerald-800">{fppPostTypes[post.kind][language]}</p>
            <h2 className="mt-2 break-words text-xl font-semibold">{post.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {post.has_photo === '1' && <img src={'/api/fpp/photo/' + post.id} alt="" loading="lazy" width={40} height={40} className="size-10 rounded-full object-cover" />}
              <span className="break-words">{post.business_name ?? post.author_name}</span>
              {post.business_id && post.business_tier && <Link
                href={(pt ? '/pt/restaurantes/' : '/en/restaurants/') + post.business_id}
                className="rounded-full border border-[#ded8c5] bg-[#fffaf0] px-3 py-1 font-semibold text-[#76570f] hover:underline">
                {tiers[post.business_tier]}
              </Link>}
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words">{post.body}</p>
            <details className="mt-4 border-t border-[#ded8c5] pt-3">
              <summary className="cursor-pointer font-semibold text-emerald-800">{pt ? 'Comentários' : 'Comments'}</summary>
              {comments === null && <p className="mt-3 text-sm">{pt ? 'Comentários temporariamente indisponíveis.' : 'Comments are temporarily unavailable.'}</p>}
              {commentsByPost.get(post.id)?.map(comment => <div key={comment.id} className="mt-3 rounded-lg bg-[#f7f5ef] p-3 text-sm">
                <p className="break-words font-semibold">{comment.author_name}</p>
                <p className="mt-1 whitespace-pre-wrap break-words">{comment.body}</p>
              </div>)}
              {profile ? <FppCommentForm id={post.id} language={language} /> : <Link href={account + '#professional-profile'} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline">
                {user?.userId ? (pt ? 'Configurar perfil para comentar' : 'Set up your profile to comment')
                  : (pt ? 'Entrar para comentar' : 'Sign in to comment')}
              </Link>}
            </details>
          </article>)}
        </section>
      </div>
    </section>
  );
}
