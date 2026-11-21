import { StaffReplyForm } from '@/components/RestaurantReplyForms';
import { staffAuthorized } from '@/lib/staff-auth';
import { prepareComments } from '@/lib/restaurant-comments';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { VerifyCommenterForm, ModerateCommentForm } from '@/components/CommentForms';

export default async function StaffComments() {
  if (!(await staffAuthorized())) return null;
  try {
    await prepareComments();
    const requests = sqlRows(await executePrivateSql(
      'SELECT user_id, requested_at FROM restaurant_comment_access_requests ORDER BY requested_at, user_id LIMIT 100',
    ));
    const users=sqlRows(await executePrivateSql('SELECT user_id,public_name,active FROM restaurant_commenters ORDER BY reviewed_at DESC LIMIT 100'));
    const comments=sqlRows(await executePrivateSql(`SELECT c.id,c.version,c.public_name,c.body,c.body_en,c.body_pt,c.under_review,c.menu_reference,c.status,c.created_at,l.name FROM restaurant_comments c JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.status IN ('pending','approved') ORDER BY CASE WHEN c.status='pending' THEN 0 ELSE 1 END,c.created_at DESC LIMIT 100`));
    const replies = sqlRows(await executePrivateSql(`SELECT r.comment_id,r.version,r.body,r.body_en,r.body_pt,r.status,
      c.body AS customer_comment,c.menu_reference,l.name
      FROM restaurant_comment_replies r JOIN restaurant_comments c ON c.id=r.comment_id
      JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE r.status IN ('pending','approved')
      ORDER BY r.status='pending' DESC,r.submitted_at,r.comment_id LIMIT 100`));
    return <details className="mt-6 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-5"><summary className="cursor-pointer text-lg font-semibold">Comment permissions and review · {requests.length}{requests.length === 100 ? '+' : ''} access requests · {comments.filter(c=>c.status==='pending').length} pending</summary>
      <p className="mt-3 text-sm text-[#555]">Commenter verification is separate from restaurant verification. Review identity and phone privately; never put phone numbers or email addresses in the public name or comment.</p>
      {requests.length > 0 && <section aria-label="Commenting access requests" className="mt-4 space-y-3">
        <h3 className="font-semibold">Commenting access requests</h3>
        {requests.map(request => <details key={request.user_id} className="rounded-lg border border-[#ded8c5] bg-white p-4">
          <summary className="cursor-pointer break-all text-sm">
            <code>{request.user_id}</code> · <time dateTime={request.requested_at ?? undefined}>{request.requested_at?.slice(0, 10)}</time>
          </summary>
          <VerifyCommenterForm accountId={request.user_id!}/>
        </details>)}
      </section>}
      <details className="mt-4 space-y-3 rounded-lg border border-[#ded8c5] p-4 text-sm">
        <summary className="cursor-pointer font-semibold">Restaurant replies · {replies.filter(reply => reply.status === 'pending').length} pending</summary>
        {replies.length === 0 && <p>No replies to review.</p>}
        {replies.map(reply => <article key={reply.comment_id} className="rounded-lg border border-[#ded8c5] bg-white p-4">
          <h3 className="font-semibold">{reply.name} · {reply.menu_reference} · {reply.status}</h3>
          <p className="mt-2 whitespace-pre-wrap break-words"><strong>Customer comment</strong><br/>{reply.customer_comment}</p>
          <p className="mt-2 whitespace-pre-wrap break-words"><strong>Restaurant reply</strong><br/>{reply.body}</p>
          <StaffReplyForm key={reply.version} commentId={reply.comment_id!} version={reply.version!} english={reply.body_en ?? ''} portuguese={reply.body_pt ?? ''} approved={reply.status === 'approved'}/>
        </article>)}
      </details>
      <VerifyCommenterForm/>
      <ul className="mt-4 space-y-2 text-sm">{users.map(u=><li key={u.user_id}><code className="break-all">{u.user_id}</code> · {u.public_name} · {u.active==='1'?'Allowed':'Revoked'}</li>)}</ul>
      <div className="mt-6 space-y-4">{comments.map(c=><article key={c.id} className="rounded-lg border border-[#ded8c5] bg-white p-4"><h3 className="font-semibold">{c.name} · {c.under_review === '1' ? 'Under review' : c.status}</h3><p className="mt-2 text-sm">{c.public_name} · {c.menu_reference} · {c.created_at}</p><p className="mt-3 whitespace-pre-line break-words text-sm">{c.body}</p><ModerateCommentForm id={c.id!} version={c.version!} english={c.body_en ?? ''} portuguese={c.body_pt ?? ''} published={c.status==='approved'} underReview={c.under_review === '1'}/></article>)}</div>
    </details>;
  } catch {return <p className="mt-6 text-sm text-red-700">Unable to load comment review. Refresh and try again.</p>;}
}
