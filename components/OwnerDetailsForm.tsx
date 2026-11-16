'use client';
import { useActionState, useState } from 'react';
import { saveOwnerDetails } from '@/app/owner/details-actions';

export default function OwnerDetailsForm({ id, description, hours, version, language }: { id: string; description: string; hours: string; version: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [result,action,pending] = useActionState(saveOwnerDetails,'');
  const [dirty,setDirty] = useState(false);
  const saved = result === 'details-saved' && !dirty;
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Descrição e horário' : 'Description and opening hours'}</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'Estas informações aparecem no perfil público.' : 'These details appear on your public profile.'}</p>
    <form action={action} onChange={() => setDirty(true)} onSubmit={() => setDirty(false)} className="mt-4 space-y-4 text-sm">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="version" value={version} />
      <fieldset disabled={pending} className="space-y-4">
        <label className="block font-medium">{pt ? 'Sobre o restaurante' : 'About the restaurant'}
          <textarea name="description" maxLength={2000} rows={5} defaultValue={description} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
          <span className="mt-1 block text-xs font-normal text-[#555]">{pt ? 'Até 2000 caracteres.' : 'Up to 2000 characters.'}</span>
        </label>
        <label className="block font-medium">{pt ? 'Horário de funcionamento' : 'Opening hours'}
          <textarea name="hours" maxLength={300} rows={3} defaultValue={hours} placeholder={pt ? 'Seg–Sex: 12:00–22:00\nSáb–Dom: 12:00–23:00' : 'Mon–Fri: 12:00–22:00\nSat–Sun: 12:00–23:00'} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
          <span className="mt-1 block text-xs font-normal text-[#555]">{pt ? 'Até 300 caracteres.' : 'Up to 300 characters.'}</span>
        </label>
        <button disabled={pending} className={`rounded-lg px-4 py-2 font-semibold text-white ${pending ? 'bg-amber-700' : saved ? 'bg-emerald-700' : 'bg-[#252a32]'}`}>{pending ? (pt ? 'A guardar…' : 'Saving…') : saved ? (pt ? 'Guardado ✓' : 'Saved ✓') : (pt ? 'Guardar informações' : 'Save details')}</button>
      </fieldset>
      <p role="status" aria-live="polite" className={`text-sm ${pending ? 'text-amber-800' : saved ? 'text-emerald-700' : dirty ? 'text-amber-800' : 'text-red-700'}`}>
        {pending ? (pt ? 'A guardar…' : 'Saving…') : dirty ? (pt ? 'Alterações por guardar.' : 'Unsaved changes.') : saved ? (pt ? 'Informações guardadas. Perfil atualizado.' : 'Details saved. Profile updated.') : result === 'stale' ? (pt ? 'As informações ou o seu acesso mudaram. Atualize a página antes de tentar novamente.' : 'The details or your access have changed. Refresh before trying again.') : result ? (pt ? 'Não foi possível guardar. Verifique os dados e tente novamente.' : 'Could not save. Check the details and try again.') : null}
      </p>
    </form>
  </section>;
}
