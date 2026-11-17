'use client';
import { useActionState, useState } from 'react';
import { saveReviewedTranslation } from '@/app/staff/review/translation-actions';

type Props = { id: string; description: string; hours: string; descriptionEn: string; hoursEn: string; version: string; lastEditor: string | null; lastSaved: string | null };
export default function StaffTranslationForm({ id, description, hours, descriptionEn, hoursEn, version, lastEditor, lastSaved }: Props) {
  const [result,action,pending] = useActionState(saveReviewedTranslation,'');
  const [dirty,setDirty] = useState(false);
  const saved = !dirty && result === 'translation-saved';
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">English translation review / Análise da tradução inglesa</h3>
    <p className="mt-2 text-sm text-[#555]">Review the English description and hours against the Portuguese original. Saving updates the English public profile.</p>
    <p className={`mt-3 text-sm ${lastEditor === 'shared-pilot-staff' ? 'text-emerald-700' : 'text-[#555]'}`}>
      {lastEditor === 'shared-pilot-staff' ? `English last reviewed by staff: ${lastSaved ?? ''}` : 'Needs staff review: check the English version against the latest owner details.'}
    </p>
    <div className="mt-4 rounded-lg bg-[#f4f3ef] p-4 text-sm" lang="pt">
      <h4 className="font-semibold">Original em português</h4>
      <p className="mt-2 whitespace-pre-line">{description || 'Descrição ainda não adicionada.'}</p>
      <p className="mt-3 whitespace-pre-line"><span className="font-semibold">Horário: </span>{hours || 'Horário ainda não adicionado.'}</p>
    </div>
    <form action={action} onChange={() => setDirty(true)} onSubmit={() => setDirty(false)} className="mt-4 space-y-4 text-sm">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="version" value={version} />
      <fieldset disabled={pending} className="space-y-4">
        <label className="block font-medium">Description · English
          <textarea lang="en" name="descriptionEn" maxLength={2000} rows={5} defaultValue={descriptionEn} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
        </label>
        <label className="block font-medium">Opening hours · English
          <textarea lang="en" name="hoursEn" maxLength={300} rows={3} defaultValue={hoursEn} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
        </label>
        <label className="flex items-start gap-2"><input type="checkbox" name="reviewed" required className="mt-1" /><span>I checked that the English text matches the Portuguese meaning and preserves the restaurant name and opening times.</span></label>
        <button disabled={pending} className={`rounded-lg px-4 py-2 font-semibold text-white ${pending ? 'bg-amber-700' : saved ? 'bg-emerald-700' : 'bg-[#252a32]'}`}>{pending ? 'Saving… / A guardar…' : saved ? 'English saved ✓ / Inglês guardado ✓' : 'Save reviewed English / Guardar inglês revisto'}</button>
      </fieldset>
      <p role="status" aria-live="polite" className={saved ? 'text-emerald-700' : dirty || pending ? 'text-amber-800' : 'text-red-700'}>
        {pending ? 'Saving…' : dirty ? 'Unsaved changes / Alterações por guardar.' : saved ? 'Reviewed English saved. Portuguese original preserved.' : result === 'stale' ? 'The source details changed or the listing is no longer published. Refresh and review again.' : result === 'invalid-translation' ? 'Check the text lengths and confirm the translation review.' : result ? 'Unable to save. Try again later.' : null}
      </p>
    </form>
  </section>;
}
