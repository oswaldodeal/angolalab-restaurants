'use client';
import { useActionState } from 'react';
import { reviewRestaurant } from '@/app/staff/review/actions';

export default function StaffReviewForm({ id, published }: { id: string; published: boolean }) {
  const [, action, pending] = useActionState(async (_: null, form: FormData) => {
    await reviewRestaurant(form); return null;
  }, null);
  return <form action={action} className="mt-5 space-y-4 border-t border-[#ded8c5] pt-5">
    <input type="hidden" name="id" value={id} />
    <label className="block text-sm font-semibold">Review note / Nota de análise (20–2000 characters)
      <textarea name="note" required minLength={20} maxLength={2000} disabled={pending} className="mt-2 block min-h-24 w-full rounded-lg border border-[#ded8c5] bg-white p-3 font-normal" />
    </label>
    {!published && <label className="flex gap-3 text-sm">
      <input type="checkbox" name="publicationConsent" disabled={pending} />
      I checked the restaurant identity and the submitter’s permission to publish its name, city, cuisine and hours. Basic approval does not grant verification.
    </label>}
    <div className="flex flex-wrap gap-3">
      {published ? <button name="decision" value="withdrawn" disabled={pending} className="rounded-lg border border-red-300 px-4 py-3 text-red-800 disabled:opacity-50">Withdraw listing / Retirar</button> : <>
        <button name="decision" value="approved" disabled={pending} className="rounded-lg bg-[#252a32] px-4 py-3 font-semibold text-white disabled:opacity-50">Publish Basic / Publicar Básico</button>
        <button name="decision" value="rejected" disabled={pending} className="rounded-lg border border-red-300 px-4 py-3 text-red-800 disabled:opacity-50">Reject / Rejeitar</button>
      </>}
      {pending && <span role="status">Saving / A guardar…</span>}
    </div>
  </form>;
}
