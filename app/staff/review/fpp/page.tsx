import Link from 'next/link';
import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { getFppCommentReview } from '@/lib/fpp-comments';
import { fppReviewPageSize, getFppReview } from '@/lib/fpp-community';
import { fppPostTypes, fppPostStatusLabels } from '@/lib/fpp-posts';
import { decideFpp, decideFppComment } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'FPP admin | AngolaLab', robots: { index: false, follow: false } };

const button = 'rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold hover:bg-[#f4f3ef]';

export default async function FppAdmin({ searchParams }: { searchParams: Promise<{ page?: string; result?: string; view?: string }> }) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const query = await searchParams;
  const page = /^\d{1,6}$/.test(query.page ?? '') ? Math.max(1, Number(query.page)) : 1;
  const commentsView = query.view === 'comments';
  const review = commentsView ? null : await getFppReview(page).catch(() => null);
  const comments = commentsView ? await getFppCommentReview(page, fppReviewPageSize).catch(() => null) : null;
  const active = commentsView ? comments : review;
  const pageLink = (number: number) => `?page=${number}${commentsView ? '&view=comments' : ''}`;

  return (
    <section className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
      <div className="mx-auto max-w-5xl">
        <Link href="/staff/review" className="font-semibold text-emerald-800 underline">Back to Staff Review</Link>
        <h1 className="mt-5 text-3xl font-semibold">FPP admin</h1>
        <nav aria-label="FPP navigation" className="mt-4 flex flex-wrap gap-4 border-b border-[#D2AC37] pb-4">
          <Link className="font-semibold text-emerald-800 underline" href="/staff/review/fpp" aria-current={!commentsView ? 'page' : undefined}>Posts</Link>
          <Link className="font-semibold text-emerald-800 underline" href="?view=comments" aria-current={commentsView ? 'page' : undefined}>Comments</Link>
          <Link className="font-semibold text-emerald-800 underline" href="/en/professionals">View FPP community</Link>
        </nav>
        {query.result && <p role="status" className="mt-4">{query.result === 'saved' ? 'Decision saved.' : query.result === 'stale' ? 'This item has already changed. Review its current status.' : 'Unable to save the decision.'}</p>}
        {!active && <p role="alert" className="mt-6 text-red-700">Unable to load FPP review. Reload to try again.</p>}
        {active?.length === 0 && <p className="mt-6">{commentsView ? 'No comments to review.' : 'No posts on this page.'}</p>}
        <div className="mt-6 space-y-4">
          {comments?.slice(0, fppReviewPageSize).map(comment => <article key={comment.id} className="rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-5">
            <p className="text-sm">{fppPostStatusLabels[comment.status].en}</p>
            <h2 className="mt-2 break-words text-lg font-semibold">{comment.post_title}</h2>
            <p className="mt-1 break-words text-sm">{comment.author_name}</p>
            <p className="mt-3 whitespace-pre-wrap break-words">{comment.body}</p>
            <form action={decideFppComment} className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" name="id" value={comment.id} />
              {comment.status === 'pending' ? <>
                {comment.post_status === 'published' && <button name="decision" value="published" className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white">Approve comment</button>}
                <button name="decision" value="declined" className={button}>Decline comment</button>
              </> : <button name="decision" value="removed" className={button + ' text-red-700'}>Remove comment</button>}
            </form>
          </article>)}
          {review?.slice(0, fppReviewPageSize).map(post => (
            <article key={post.id} className="rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-5">
              <p className="text-sm">{fppPostTypes[post.kind].en} · {fppPostStatusLabels[post.status].en}</p>
              <h2 className="mt-2 break-words text-lg font-semibold">{post.title}</h2>
              <p className="mt-1 break-words text-sm">{post.author_name}</p>
              <p className="mt-3 whitespace-pre-wrap break-words">{post.body}</p>
              {(post.status === 'pending' || post.status === 'published') && <form action={decideFpp} className="mt-4 flex flex-wrap gap-3">
                <input type="hidden" name="id" value={post.id} />
                {post.status === 'pending' ? <>
                  <button name="decision" value="published" className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white hover:bg-[#424850]">Approve and publish</button>
                  <button name="decision" value="declined" className={button}>Decline post</button>
                </> : <button name="decision" value="removed" className={button + ' text-red-700'}>Remove from community</button>}
              </form>}
            </article>
          ))}
        </div>
        <nav aria-label="Review pages" className="mt-5 flex gap-4">
          {page > 1 && <Link className="text-emerald-800 underline" href={pageLink(page - 1)}>Previous page</Link>}
          {active && active.length > fppReviewPageSize && <Link className="text-emerald-800 underline" href={pageLink(page + 1)}>Next page</Link>}
        </nav>
      </div>
    </section>
  );
}
