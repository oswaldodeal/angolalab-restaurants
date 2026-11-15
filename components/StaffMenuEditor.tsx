import { getSavedMenu } from '@/lib/restaurant-data';
import { saveStaffMenuItem } from '@/app/staff/review/menu-actions';
import { saveOwnerMenuItem } from '@/app/owner/menu-actions';
import MenuItemForm from '@/components/MenuItemForm';

export default async function StaffMenuEditor({ id, country, verified, photos, owner = false, language = 'en' }: { id: string; country: string; verified: boolean; photos: string[]; owner?: boolean; language?: 'en' | 'pt' }) {
  const items = await getSavedMenu(id, verified);
  const currency = country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA';
  const action = owner ? saveOwnerMenuItem : saveStaffMenuItem;
  const pt = language === 'pt';
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Editor de ementa' : 'Menu editor'} · {currency}</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'As alterações guardadas aparecem no perfil público.' : 'Saved changes appear on the public profile.'}</p>
    <div className="mt-4 space-y-4">{items.map(({photo, ...item}) => <MenuItemForm key={item.id} id={id} currency={currency} verified={verified} photoCount={photos.length} photoIndex={photo && photos.includes(photo) ? String(photos.indexOf(photo)) : ''} item={item} language={language} action={action} />)}</div>
    {items.length < (verified ? 60 : 2) && <details className="mt-4">
      <summary className="cursor-pointer font-semibold text-emerald-700">{pt ? 'Adicionar prato ou bebida' : 'Add menu item'}</summary>
      <div className="mt-4"><MenuItemForm key="new-item" id={id} currency={currency} verified={verified} photoCount={photos.length} photoIndex="" language={language} action={action} /></div>
    </details>}
    {!verified && <p className="mt-3 text-sm text-[#555]">{pt ? 'Básico: dois pratos em destaque.' : 'Basic: two featured main dishes.'}</p>}
  </section>;
}
