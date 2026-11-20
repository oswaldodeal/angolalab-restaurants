import { staffAuthorized } from '@/lib/staff-auth';
import { prepareComments } from '@/lib/restaurant-comments';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { VerifyCommenterForm, ModerateCommentForm } from '@/components/CommentForms';

export default async function StaffComments() {
  if (!(await staffAuthorized())) return null;
  try {
    await prepareComments();
    const users=sqlRows(await executePrivateSql('SELECT user_id,public_name,active FROM restaurant_commenters ORDER BY reviewed_at DESC LIMIT 100'));
    const comments=sqlRows(await executePrivateSql(`SELECT c.id,c.version,c.public_name,c.body,c.body_en,c.menu_reference,c.status,c.created_at,l.name FROM restaurant_comments c JOIN restaurant_listings l ON l.id=c.restaurant_id WHERE c.status IN ('pending','approved') ORDER BY CASE WHEN c.status='pending' THEN 0 ELSE 1 END,c.created_at DESC LIMIT 100`));
    return <details className="mt-6 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-5"><summary className="cursor-pointer text-lg font-semibold">Comment permissions and review · {comments.filter(c=>c.status==='pending').length} pending</summary>
      <p className="mt-3 text-sm text-[#555]">Commenter verification is separate from restaurant verification. Review identity and phone privately; never put phone numbers or email addresses in the public name or comment.</p>
      <VerifyCommenterForm/>
      <ul className="mt-4 space-y-2 text-sm">{users.map(u=><li key={u.user_id}><code className="break-all">{u.user_id}</code> · {u.public_name} · {u.active==='1'?'Allowed':'Revoked'}</li>)}</ul>
      <div className="mt-6 space-y-4">{comments.map(c=><article key={c.id} className="rounded-lg border border-[#ded8c5] bg-white p-4"><h3 className="font-semibold">{c.name} · {c.status}</h3><p className="mt-2 text-sm">{c.public_name} · {c.menu_reference} · {c.created_at}</p><p className="mt-3 whitespace-pre-line break-words text-sm">{c.body}</p><ModerateCommentForm id={c.id!} version={c.version!} english={c.body_en ?? ''} published={c.status==='approved'}/></article>)}</div>
    </details>;
  } catch {return <p className="mt-6 text-sm text-red-700">Unable to load comment review. Refresh and try again.</p>;}
}
