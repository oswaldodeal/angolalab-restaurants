'use client';
import { useActionState, useId, useRef, useState } from 'react';
import { updateOwnerMenuPhoto } from '@/app/owner/photo-actions';
import { MENU_PHOTO_LIMIT } from '@/lib/store';

type Photo = { src: string; token: string };
function RemovePhoto({ id, photo, index, pt }: { id: string; photo: Photo; index: number; pt: boolean }) {
  const [result, action, pending] = useActionState(updateOwnerMenuPhoto,'');
  return <form action={action} className="space-y-2">
    <input type="hidden" name="id" value={id} /><input type="hidden" name="photoToken" value={photo.token} />
    <img src={photo.src} alt={pt ? `Fotografia da ementa ${index + 1}` : `Menu photo ${index + 1}`} className="aspect-[4/3] w-full rounded-lg object-cover" />
    <button disabled={pending} name="intent" value="remove" className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-60">{pending ? (pt ? 'A remover…' : 'Removing…') : `${pt ? 'Remover fotografia' : 'Remove photo'} ${index + 1}`}</button>
    {result && result !== 'menu-removed' && <p role="alert" className="text-sm text-red-700">{pt ? 'Não foi possível remover. Atualize a página e tente novamente.' : 'Could not remove. Refresh the page and try again.'}</p>}
  </form>;
}
export default function OwnerMenuPhotos({ id, photos, language, limit = MENU_PHOTO_LIMIT }: { id: string; photos: Photo[]; limit?: number; language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(updateOwnerMenuPhoto,'');
  const [filename,setFilename] = useState('');
  const [tooLarge,setTooLarge] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const message = result === 'menu-saved' ? (pt ? 'Fotografia adicionada. Já pode escolhê-la no editor abaixo.' : 'Photo added. You can select it in the menu editor below.')
    : result === 'invalid-upload' ? (pt ? 'Escolha JPG, PNG ou WebP até 250 KB.' : 'Choose JPG, PNG or WebP up to 250 KB.')
    : result === 'menu-duplicate' ? (pt ? 'Esta fotografia já está na ementa.' : 'This photo is already on the menu.')
    : result === 'menu-limit' ? (pt ? 'Remova uma fotografia antes de adicionar outra.' : 'Remove a photo before adding another.')
    : result ? (pt ? 'Não foi possível guardar. Atualize a página e tente novamente.' : 'Could not save. Refresh the page and try again.') : '';
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Fotografias da ementa' : 'Menu photos'} ({photos.length}/{limit})</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'As fotografias guardadas aparecem no perfil público. Ao remover uma fotografia, ela também deixa de aparecer nos pratos associados.' : 'Saved photos appear on the public profile. Removing a photo also removes it from linked menu items.'}</p>
    {limit === 2 && <p className="mt-2 text-xs text-[#555]">{pt ? 'O Perfil Básico apresenta até duas fotografias de pratos ou bebidas. A fotografia de capa e o logótipo são separados.' : 'Basic profiles show up to two food or drink photos. The cover photo and logo are separate.'}</p>}
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{photos.map((photo,index) => <RemovePhoto key={photo.token} id={id} photo={photo} index={index} pt={pt} />)}</div>
    <form action={action} onReset={() => {setFilename('');setTooLarge(false);input.current?.setCustomValidity('');}} className="mt-4 space-y-3">
      <input type="hidden" name="id" value={id} />
      {photos.length < limit && <>
        <label htmlFor={inputId} className="block text-sm font-medium">{pt ? 'Escolher fotografia da ementa' : 'Choose a menu photo'}</label>
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
        <button disabled={pending || !filename || tooLarge} className={`rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-60 ${pending ? 'bg-amber-700' : result === 'menu-saved' && !filename ? 'bg-emerald-700' : 'bg-[#252a32]'}`}>{pending ? (pt ? 'A guardar…' : 'Saving…') : (pt ? 'Adicionar fotografia' : 'Add photo')}</button>
      </>}
      <p role="status" aria-live="polite" className={`text-sm ${result === 'menu-saved' ? 'text-emerald-700' : 'text-red-700'}`}>{message}</p>
    </form>
  </section>;
}
