'use client';
import { useActionState } from 'react';
import { submitRestaurantReply } from '@/app/owner/comment-actions';
import { moderateRestaurantReply } from '@/app/staff/review/comment-actions';

const field = 'block w-full rounded-lg border border-[#ded8c5] bg-white p-2';
const button = 'rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50';

export function OwnerReplyForm({ commentId, language, draft }: { commentId: string; language: 'en' | 'pt'; draft?: string }) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(submitRestaurantReply, '');
  return <details className="mt-2">
    <summary className="cursor-pointer font-semibold text-emerald-700">{pt ? 'Responder' : 'Reply'}</summary>
    <form action={action} className="mt-2 space-y-2">
      <input type="hidden" name="commentId" value={commentId}/>
      <label>{pt ? 'Resposta do restaurante (20–1000 caracteres)' : 'Restaurant response (20–1000 characters)'}
        <textarea name="body" className={field} required disabled={pending} rows={3} minLength={20} maxLength={1000} defaultValue={draft}/>
      </label>
      <button disabled={pending} className={button}>{pt ? 'Enviar para análise' : 'Submit for review'}</button>
      {result && <p role="status">{result === 'submitted'
        ? (pt ? 'Resposta enviada para análise.' : 'Response submitted for review.')
        : (pt ? 'Não foi possível enviar. Atualize a página e tente novamente.' : 'Could not submit. Refresh the page and try again.')}</p>}
    </form>
  </details>;
}

export function StaffReplyForm({ commentId, version, approved }: { commentId: string; version: string; approved: boolean }) {
  const [result, action, pending] = useActionState(moderateRestaurantReply, '');
  return <form action={action} className="mt-3 space-y-2">
    <input type="hidden" name="commentId" value={commentId}/>
    <input type="hidden" name="version" value={version}/>
    <fieldset disabled={pending} className="space-y-2">
      <label>Private review note<textarea name="note" className={field} required rows={2} minLength={20} maxLength={2000}/></label>
      <div className="flex flex-wrap gap-2">
        {!approved && <button name="decision" value="approved" className={button}>Approve reply</button>}
        <button name="decision" value="rejected" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">{approved ? 'Unpublish reply' : 'Reject reply'}</button>
      </div>
    </fieldset>
    {result && <p role="status">{result === 'review-saved' ? 'Review saved.' : 'Could not save review. Check the note and refresh if the reply has changed.'}</p>}
  </form>;
}
