import { prepareComments } from '@/lib/restaurant-comments';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { OwnerReplyForm } from '@/components/RestaurantReplyForms';

export default async function OwnerPublishedComments({ restaurantId, userId, language }: {
  restaurantId: string; userId: string; language: 'en' | 'pt';
}) {
  const pt = language === 'pt';
  const labels: Record<string, string> = pt
    ? { pending: 'Aguarda análise', approved: 'Resposta publicada', rejected: 'Resposta não aprovada' }
    : { pending: 'Awaiting review', approved: 'Reply published', rejected: 'Reply not approved' };
  try {
    await prepareComments();
    const comments = sqlRows(await executePrivateSql(`SELECT c.id,c.public_name,c.menu_reference,c.body,
      r.status AS reply_status,r.body AS reply_body,CASE WHEN r.owner_id=o.clerk_user_id THEN 1 ELSE 0 END AS own_reply
      FROM restaurant_comments c
      JOIN restaurant_owners o ON o.restaurant_id=c.restaurant_id AND o.clerk_user_id=?
      JOIN restaurant_commenters u ON u.user_id=c.user_id AND u.active=1
      LEFT JOIN restaurant_comment_replies r ON r.comment_id=c.id AND
        (r.status='approved' OR (r.owner_id=o.clerk_user_id AND r.owner_linked_at=o.linked_at))
      WHERE c.restaurant_id=? AND c.status='approved' ORDER BY c.created_at DESC,c.id LIMIT 100`, [userId, restaurantId]));
    return <details className="mt-4 rounded-lg border border-[#ded8c5] p-3 text-sm">
      <summary className="cursor-pointer font-semibold">{pt ? 'Comentários publicados' : 'Published comments'}</summary>
      {comments.length === 0 && <p className="mt-3">{pt ? 'Ainda não há comentários publicados.' : 'No published comments yet.'}</p>}
      <ul className="divide-y divide-[#ded8c5]">{comments.map(comment => <li key={comment.id} className="space-y-2 py-3">
        <p className="font-semibold">{comment.public_name} · {comment.menu_reference}</p>
        <p className="whitespace-pre-wrap break-words">{comment.body}</p>
        {comment.reply_status && <div className="border-l-2 border-emerald-700 pl-3">
          <p className="font-semibold">{labels[comment.reply_status]}</p>
          <p className="whitespace-pre-wrap break-words">{comment.reply_body}</p>
        </div>}
        {(!comment.reply_status || comment.reply_status === 'rejected') &&
          <OwnerReplyForm commentId={comment.id!} language={language} draft={comment.own_reply === '1' ? comment.reply_body ?? undefined : undefined}/>}
      </li>)}</ul>
    </details>;
  } catch {
    return <p role="status" className="mt-3 text-sm">{pt ? 'Não foi possível carregar os comentários publicados.' : 'Unable to load published comments.'}</p>;
  }
}
