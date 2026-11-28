'use client';

import { useActionState, useState } from 'react';
import { submitFppComment } from '@/app/professional-profile/actions';

export default function FppCommentForm({ id, language }: { id: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [draft, setDraft] = useState('');
  const [result, submit, pending] = useActionState(async (_last: string | null, data: FormData) => {
    const status = await submitFppComment(null, data);
    if (status === 'submitted') setDraft('');
    return status;
  }, null);

  return <form action={submit} className="mt-4">
    <fieldset disabled={pending} className="space-y-3">
      <input type="hidden" name="postId" value={id} />
      <label className="block text-sm font-semibold">
        {pt ? 'O teu comentário' : 'Your comment'}
        <textarea name="comment" required minLength={3} maxLength={1000} rows={3} value={draft}
          onChange={event => setDraft(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#ded8c5] px-3 py-2" />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="commentConsent" required className="mt-1" />
        {pt ? 'Autorizo a publicação com o meu nome de apresentação.' : 'I agree to share this under my display name.'}
      </label>
      <button className="rounded-lg bg-[#252a32] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? (pt ? 'A enviar…' : 'Sending…') : (pt ? 'Enviar para análise' : 'Submit for review')}
      </button>
    </fieldset>
    {result && <p role="status" className="mt-3 text-sm">{result === 'submitted'
      ? (pt ? 'Comentário enviado para análise.' : 'Comment submitted for review.')
      : result === 'invalid'
        ? (pt ? 'Verifica o texto e a autorização.' : 'Check your comment and consent.')
        : (pt ? 'Não foi possível enviar. Verifica a tua conta e o estado da publicação.' : 'Could not submit. Check your account and the post’s status.')}</p>}
  </form>;
}
