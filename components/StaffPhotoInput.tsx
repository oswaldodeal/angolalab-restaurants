'use client';

import { useRef, useState } from 'react';

export default function StaffPhotoInput({ cover = false }: { cover?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [filename, setFilename] = useState('');
  const [tooLarge, setTooLarge] = useState(false);
  return (
    <>
      {cover && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button ref={buttonRef} type="button" onClick={() => inputRef.current?.click()} className="rounded-lg border border-[#ded8c5] px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
            Photo / Fotografia
          </button>
          <span aria-live="polite" className="break-all text-sm text-[#555]">{filename || 'No file selected / Nenhum ficheiro selecionado'}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        name="photoFile"
        accept="image/jpeg,image/png,image/webp"
        className={cover ? 'hidden' : 'mt-1 block w-full'}
        onInvalid={cover ? event => {
          event.preventDefault();
          buttonRef.current?.focus();
        } : undefined}
        onChange={({ currentTarget }) => {
          const oversized = (currentTarget.files?.[0]?.size ?? 0) > 250 * 1024;
          if (oversized) currentTarget.value = '';
          currentTarget.setCustomValidity(oversized ? 'Choose an image up to 250 KB. / Escolha uma imagem até 250 KB.' : '');
          setTooLarge(oversized);
          setFilename(currentTarget.files?.[0]?.name ?? '');
        }}
      />
      {tooLarge && <span role="alert" className="block text-sm text-red-700">Image too large. Choose a file up to 250 KB. / Imagem demasiado grande. Escolha um ficheiro até 250 KB.</span>}
    </>
  );
}
