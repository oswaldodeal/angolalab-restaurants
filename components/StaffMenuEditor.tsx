import { getSavedMenu } from '@/lib/restaurant-data';
import { saveMenuItem } from '@/app/staff/review/menu-actions';

export default async function StaffMenuEditor({ id, country, verified, photos }: { id: string; country: string; verified: boolean; photos: string[] }) {
  const items = await getSavedMenu(id, verified);
  const currency = country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA';
  const fields = (item?: typeof items[number]) => <>
    <input type="hidden" name="restaurantId" value={id} />
    <input type="hidden" name="itemId" value={item?.id ?? ''} />
    <input type="hidden" name="version" value={item?.updated_at ?? ''} />
    <label className="block">Dish or drink / Prato ou bebida
      <input name="name" required minLength={2} maxLength={100} defaultValue={item?.name} className="mt-1 w-full rounded border p-2" />
    </label>
    <div className="grid gap-3 sm:grid-cols-2">
      <label>Category / Categoria
        <select name="category" defaultValue={item?.category ?? 'mains'} className="mt-1 w-full rounded border bg-white p-2">
          <option value="mains">Main courses / Pratos principais</option>
          {verified && <><option value="drinks">Drinks / Bebidas</option><option value="desserts">Desserts / Sobremesas</option></>}
        </select>
      </label>
      <label>Price / Preço ({currency})
        <input name="price" type="number" required min="0" max="9999999.99" step="0.01" defaultValue={item?.price} className="mt-1 w-full rounded border p-2" />
      </label>
    </div>
    <label className="block">Menu photo / Fotografia da ementa
      <select name="photo" defaultValue={item?.photo ? String(photos.indexOf(item.photo)) === '-1' ? '' : String(photos.indexOf(item.photo)) : ''} className="mt-1 w-full rounded border bg-white p-2">
        <option value="">No photo / Sem fotografia</option>
        {photos.map((_, index) => <option key={index} value={index}>Photo / Fotografia {index + 1}</option>)}
      </select>
    </label>
  </>;
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">Menu editor / Editor de ementa · {currency}</h3>
    <p className="mt-2 text-sm text-[#555]">Saved changes appear on the public profile. / As alterações guardadas aparecem no perfil público.</p>
    <div className="mt-4 space-y-4">{items.map(item => <form key={item.id} action={saveMenuItem} className="space-y-3 rounded-lg bg-[#faf9f6] p-4 text-sm">
      {fields(item)}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-[#252a32] px-4 py-2 text-white">Save item / Guardar</button>
        <button name="intent" value="remove" formNoValidate className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Remove / Remover</button>
      </div>
    </form>)}</div>
    {items.length < (verified ? 60 : 2) && <details className="mt-4">
      <summary className="cursor-pointer font-semibold text-emerald-700">Add menu item / Adicionar prato ou bebida</summary>
      <form action={saveMenuItem} className="mt-4 space-y-3 text-sm">{fields()}
        <button className="rounded-lg bg-[#252a32] px-4 py-2 text-white">Add item / Adicionar</button>
      </form>
    </details>}
    {!verified && <p className="mt-3 text-sm text-[#555]">Basic: two featured main dishes. / Básico: dois pratos em destaque.</p>}
  </section>;
}
