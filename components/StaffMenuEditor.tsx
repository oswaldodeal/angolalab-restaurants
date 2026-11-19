import { getSavedMenu, prepareRestaurantDatabase } from '@/lib/restaurant-data';
import { saveStaffMenuItem } from '@/app/staff/review/menu-actions';
import { saveOwnerMenuItem } from '@/app/owner/menu-actions';
import MenuItemForm from '@/components/MenuItemForm';

export default async function StaffMenuEditor({ id, country, verified, photos, owner = false, language = 'en' }: { id: string; country: string; verified: boolean; photos: string[]; owner?: boolean; language?: 'en' | 'pt' }) {
  await prepareRestaurantDatabase();
  const items = await getSavedMenu(id, verified);
  const currency = country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA';
  const selectablePhotos = photos.slice(0,verified ? 6 : 2);
  const action = owner ? saveOwnerMenuItem : saveStaffMenuItem;
  const pt = language === 'pt';
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">{pt ? 'Editor de ementa' : 'Menu editor'} · {currency}</h3>
    <p className="mt-2 text-sm text-[#555]">{pt ? 'As alterações guardadas aparecem no perfil público.' : 'Saved changes appear on the public profile.'}</p>
    <div className="mt-4 space-y-4">{items.map(({photo, ...item}) => <MenuItemForm key={item.id} id={id} currency={currency} verified={verified} photoCount={selectablePhotos.length} photoIndex={photo && selectablePhotos.includes(photo) ? String(selectablePhotos.indexOf(photo)) : ''} item={item} language={language} allowTranslation={!owner} action={action} />)}</div>
    {items.length < (verified ? 60 : 2) && <details className="mt-4">
      <summary className="cursor-pointer font-semibold text-emerald-700">{pt ? 'Adicionar prato ou bebida' : 'Add menu item'}</summary>
      <div className="mt-4"><MenuItemForm key="new-item" id={id} currency={currency} verified={verified} photoCount={selectablePhotos.length} photoIndex="" language={language} allowTranslation={!owner} action={action} /></div>
    </details>}
    {!verified && <p className="mt-3 text-sm text-[#555]">{pt ? 'Básico: dois itens em destaque no total, com ou sem fotografia, repartidos entre pratos e bebidas.' : 'Basic: two featured items in total, with or without photos, shared between food and drinks.'}</p>}
  </section>;
}
