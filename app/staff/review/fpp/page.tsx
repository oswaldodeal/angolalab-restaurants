import Link from 'next/link';
import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { fppReviewPageSize, getFppReview } from '@/lib/fpp-community';
import { fppPostTypes, fppPostStatusLabels } from '@/lib/fpp-posts';
import { decideFpp } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'FPP admin | AngolaLab', robots: { index: false, follow: false } };

const button = 'rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold hover:bg-[#f4f3ef]';

export default async function FppAdmin({ searchParams }: { searchParams: Promise<{ queue?: string; page?: string; result?: string }> }) {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  const query = await searchParams;
  const queue = query.queue === 'posts' ? 'posts' : 'requests';
  const page = /^\d{1,6}$/.test(query.page ?? '') ? Math.max(1, Number(query.page)) : 1;
  const review = await getFppReview(page, queue).catch(() => null);
  const count = review ? review.requests.length + review.posts.length : 0;

  return (
    <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-12 text-[#222]">
      <Link href="/staff/review" className="font-semibold text-emerald-800 underline">Back to Staff Review</Link>
      <h1 className="mt-5 text-3xl font-semibold">FPP admin</h1>
      <nav aria-label="FPP review queues" className="mt-4 flex flex-wrap gap-4 border-b border-[#D2AC37] pb-4">
        <Link className="font-semibold text-emerald-800 underline" aria-current={queue === 'requests' ? 'page' : undefined} href="/staff/review/fpp">Access requests</Link>
        <Link className="font-semibold text-emerald-800 underline" aria-current={queue === 'posts' ? 'page' : undefined} href="/staff/review/fpp?queue=posts">Posts</Link>
        <Link className="font-semibold text-emerald-800 underline" href="/en/professionals">View FPP community</Link>
      </nav>
      {query.result && <p role="status" className="mt-4">{query.result === 'saved' ? 'Decision saved.' : query.result === 'stale' ? 'This item has already changed. Review its current status.' : 'Unable to save the decision.'}</p>}
      {!review && <p role="alert" className="mt-6 text-red-700">Unable to load FPP review. Reload to try again.</p>}
      {review && count === 0 && <p className="mt-6">{queue === 'requests' ? 'No access requests on this page.' : 'No posts on this page.'}</p>}
      <div className="mt-6 space-y-4">
        {review?.requests.slice(0, fppReviewPageSize).map(request => (
          <article key={request.id} className="rounded-xl border border-[#ded8c5] p-5">
            <h2 className="break-words text-lg font-semibold">{request.display_name}</h2>
            <p className="mt-1 capitalize">{request.status}</p>
            <code className="mt-2 block break-all text-sm">{request.user_id}</code>
            {request.status === 'pending' && <form action={decideFpp} className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="queue" value="requests" />
              <button name="decision" value="approved" className={button}>Accept request</button>
              <button name="decision" value="declined" className={button}>Decline request</button>
            </form>}
          </article>
        ))}
        {review?.posts.slice(0, fppReviewPageSize).map(post => (
          <article key={post.id} className="rounded-xl border border-[#ded8c5] p-5">
            <p className="text-sm">{fppPostTypes[post.kind].en} · {fppPostStatusLabels[post.status].en}</p>
            <h2 className="mt-2 break-words text-lg font-semibold">{post.title}</h2>
            <p className="mt-1 break-words text-sm">{post.author_name}</p>
            <p className="mt-3 whitespace-pre-wrap break-words">{post.body}</p>
            {(post.status === 'pending' || post.status === 'published') && <form action={decideFpp} className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="queue" value="posts" />
              {post.status === 'pending' ? <>
                <button name="decision" value="published" className={button}>Approve and publish</button>
                <button name="decision" value="declined" className={button}>Decline post</button>
              </> : <button name="decision" value="removed" className={button + ' text-red-700'}>Remove from community</button>}
            </form>}
          </article>
        ))}
      </div>
      <nav aria-label="Review pages" className="mt-5 flex gap-4">
        {page > 1 && <Link className="text-emerald-800 underline" href={`?queue=${queue}&page=${page - 1}`}>Previous page</Link>}
        {count > fppReviewPageSize && <Link className="text-emerald-800 underline" href={`?queue=${queue}&page=${page + 1}`}>Next page</Link>}
      </nav>
    </main>
  );
}
