'use client';
import { useActionState, useState } from 'react';
import type { SavedMenuItem } from '@/lib/store';

type Props = { id: string; currency: string; verified: boolean; photoCount: number; photoIndex: string; item?: Omit<SavedMenuItem, 'photo'>; language: 'en' | 'pt'; action: (previous: string, form: FormData) => Promise<string> };
export default function MenuItemForm({ id, currency, verified, photoCount, photoIndex, item, language, action }: Props) {
  const [result, formAction, pending] = useActionState(action, '');
  const [dirty, setDirty] = useState(false);
  const pt = language === 'pt';
  const saved = !dirty && result === 'item-saved';
  const error = !dirty && result && !['item-saved','item-removed'].includes(result);
  return <form action={formAction} onChange={() => setDirty(true)} onSubmit={() => setDirty(false)} className="space-y-3 rounded-lg bg-[#faf9f6] p-4 text-sm">
    <input type="hidden" name="restaurantId" value={id} /><input type="hidden" name="itemId" value={item?.id ?? ''} /><input type="hidden" name="version" value={item?.updated_at ?? ''} />
    <fieldset disabled={pending} className="space-y-3">
      <label className="block">{pt ? 'Prato ou bebida' : 'Dish or drink'}
        <input name="name" required minLength={2} maxLength={100} defaultValue={item?.name} className="mt-1 w-full rounded border bg-white p-2" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>{pt ? 'Categoria' : 'Category'}
          <select name="category" defaultValue={item?.category ?? 'mains'} className="mt-1 w-full rounded border bg-white p-2">
            <option value="mains">{pt ? 'Pratos principais' : 'Main courses'}</option>
            {verified && <><option value="drinks">{pt ? 'Bebidas' : 'Drinks'}</option><option value="desserts">{pt ? 'Sobremesas' : 'Desserts'}</option></>}
          </select>
        </label>
        <label>{pt ? 'Preço' : 'Price'} ({currency})
          <input name="price" type="number" required min="0" max="9999999.99" step="0.01" defaultValue={item?.price} className="mt-1 w-full rounded border bg-white p-2" />
        </label>
      </div>
      <label className="block">{pt ? 'Fotografia da ementa' : 'Menu photo'}
        <select key={`${photoIndex}:${photoCount}`} name="photo" defaultValue={photoIndex} className="mt-1 w-full rounded border bg-white p-2">
          <option value="">{pt ? 'Sem fotografia' : 'No photo'}</option>
          {Array.from({length: photoCount}, (_, index) => <option key={index} value={index}>{pt ? 'Fotografia' : 'Photo'} {index + 1}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className={`rounded-lg px-4 py-2 font-semibold text-white transition-colors ${pending ? 'bg-amber-700' : saved ? 'bg-emerald-700' : 'bg-[#252a32]'}`}>
          {pending ? (pt ? 'A guardar…' : 'Saving…') : saved ? (pt ? 'Guardado ✓' : 'Saved ✓') : item ? (pt ? 'Guardar' : 'Save item') : (pt ? 'Adicionar' : 'Add item')}
        </button>
        {item && <button name="intent" value="remove" formNoValidate className="rounded-lg border border-red-200 px-4 py-2 text-red-700">{pt ? 'Remover' : 'Remove'}</button>}
      </div>
    </fieldset>
    <p role="status" aria-live="polite" className={error ? 'text-red-700' : dirty ? 'text-amber-800' : 'text-emerald-700'}>
      {pending ? (pt ? 'A guardar alterações…' : 'Saving changes…') : dirty ? (pt ? 'Alterações por guardar.' : 'Unsaved changes.') : error ? (pt ? 'Não foi possível guardar. Verifique os dados ou atualize a página e tente novamente.' : 'Could not save. Check the details or refresh the page and try again.') : result === 'item-saved' ? (pt ? 'Prato guardado. Perfil atualizado.' : 'Item saved. Profile updated.') : null}
    </p>
  </form>;
}
