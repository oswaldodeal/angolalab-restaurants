'use client';
import { useActionState, useState } from 'react';
import { saveOwnerDetails } from '@/app/owner/details-actions';

export default function OwnerDetailsForm({ id, description, hours, version, language }: { id: string; description: string; hours: string; version: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const hoursExample = '12:00–23:00 Segunda–Sexta\n12:00–24:00 Sábado–Domingo';
  const [result,action,pending] = useActionState(saveOwnerDetails,'');
  const [dirty,setDirty] = useState(false);
  const saved = result === 'details-saved' && !dirty;
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Descrição e horário' : 'Description and opening hours'}</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'Edite a descrição e o horário em português. A equipa AngolaLab trata da tradução para inglês.' : 'Edit your description and opening hours in Portuguese. AngolaLab staff handle the English translation.'}</p>
    <form action={action} onChange={() => setDirty(true)} onSubmit={() => setDirty(false)} className="mt-4 space-y-4 text-sm">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="version" value={version} />
      <fieldset disabled={pending} className="space-y-4">
        <label className="block font-medium">{pt ? 'Sobre o restaurante · Português' : 'About the restaurant · Portuguese'}
          <textarea lang="pt" name="description" maxLength={2000} rows={5} defaultValue={description} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
          <span className="mt-1 block text-xs font-normal text-[#555]">{pt ? 'Até 2000 caracteres.' : 'Up to 2000 characters.'}</span>
        </label>
        <label className="block font-medium">{pt ? 'Horário de funcionamento · Português' : 'Opening hours · Portuguese'}
          <textarea lang="pt" name="hours" maxLength={300} rows={3} defaultValue={hours} placeholder={hoursExample} aria-describedby={`hours-example-${id}`} className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" />
          <span id={`hours-example-${id}`} className="mt-2 block whitespace-pre-line text-xs font-normal text-[#555]">{pt ? 'Exemplo de formato:' : 'Example format (Portuguese):'}{'\n'}<span lang="pt">{hoursExample}</span></span>
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
