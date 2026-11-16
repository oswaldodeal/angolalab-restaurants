'use client';
import { useActionState, useId, useRef, useState } from 'react';
import { updateOwnerCoverPhoto } from '@/app/owner/photo-actions';

export default function OwnerCoverPhoto({ id, src, token, language }: { id: string; src: string | null; token: string; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(updateOwnerCoverPhoto,'');
  const [filename,setFilename] = useState('');
  const [tooLarge,setTooLarge] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const success = result === 'cover-saved' || result === 'cover-removed';
  const message = result === 'cover-saved' ? (pt ? 'Capa guardada. Perfil e diretório atualizados.' : 'Cover saved. Profile and directory updated.')
    : result === 'cover-removed' ? (pt ? 'Capa removida.' : 'Cover removed.')
    : result === 'cover-duplicate' ? (pt ? 'Esta já é a fotografia de capa.' : 'This is already the cover photo.')
    : result === 'invalid-upload' ? (pt ? 'Escolha JPG, PNG ou WebP até 250 KB.' : 'Choose JPG, PNG or WebP up to 250 KB.')
    : result ? (pt ? 'Não foi possível guardar. Atualize a página e tente novamente.' : 'Could not save. Refresh the page and try again.') : '';
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Fotografia de capa' : 'Cover photo'}</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'A imagem grande do perfil e a miniatura em Explorar Restaurantes.' : 'The large profile image and the thumbnail in Browse Restaurants.'}</p>
    {src ? <img src={src} alt={pt ? 'Capa atual do restaurante' : 'Current restaurant cover'} className="mt-4 aspect-[16/9] w-full rounded-lg object-cover" />
      : <p className="mt-4 rounded-lg bg-[#f4f3ef] p-6 text-sm text-[#555]">{pt ? 'Fotografia de capa ainda não adicionada.' : 'No cover photo added yet.'}</p>}
    <form action={action} onReset={() => {setFilename('');setTooLarge(false);input.current?.setCustomValidity('');}} className="mt-4 space-y-3">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="coverToken" value={token} />
      <label htmlFor={inputId} className="block text-sm font-medium">{pt ? 'Escolher nova fotografia de capa' : 'Choose a new cover photo'}</label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={pending} onClick={() => input.current?.click()} className="rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold text-emerald-700">{pt ? 'Fotografia' : 'Photo'}</button>
        <span className="break-all text-sm text-[#555]">{filename || (pt ? 'Nenhum ficheiro selecionado' : 'No file selected')}</span>
      </div>
      <input id={inputId} ref={input} type="file" name="photoFile" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={pending} onChange={({currentTarget}) => {
        const large = (currentTarget.files?.[0]?.size ?? 0) > 250 * 1024;
        if (large) currentTarget.value = '';
        currentTarget.setCustomValidity(large ? '250 KB max' : '');
        setTooLarge(large);setFilename(currentTarget.files?.[0]?.name ?? '');
      }} />
      <p className="text-xs text-[#555]">JPG, PNG, WebP · 250 KB max</p>
      {tooLarge && <p role="alert" className="text-sm text-red-700">{pt ? 'Imagem demasiado grande. Limite: 250 KB.' : 'Image too large. Limit: 250 KB.'}</p>}
      <div className="flex flex-wrap gap-3">
        <button disabled={pending || !filename || tooLarge} className={`rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-60 ${pending ? 'bg-amber-700' : success && !filename ? 'bg-emerald-700' : 'bg-[#252a32]'}`}>{pending ? (pt ? 'A guardar…' : 'Saving…') : result === 'cover-saved' && !filename ? (pt ? 'Guardado ✓' : 'Saved ✓') : src ? (pt ? 'Substituir capa' : 'Replace cover') : (pt ? 'Guardar capa' : 'Save cover')}</button>
        {src && <button name="intent" value="remove" formNoValidate disabled={pending} className="rounded-lg border border-red-200 px-4 py-2 text-red-700 disabled:opacity-60">{pt ? 'Remover capa' : 'Remove cover'}</button>}
      </div>
      <p role="status" aria-live="polite" className={`text-sm ${success ? 'text-emerald-700' : 'text-red-700'}`}>{filename ? '' : message}</p>
    </form>
  </section>;
}
