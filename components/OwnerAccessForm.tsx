import { executePrivateSql, sqlRows } from '@/lib/turso';
import { linkRestaurantOwner } from '@/app/staff/review/owner-actions';

export default async function OwnerAccessForm({ id }: { id: string }) {
  const owner = sqlRows(await executePrivateSql('SELECT clerk_user_id FROM restaurant_owners WHERE restaurant_id=?', [id]))[0];
  return <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
    <h3 className="font-semibold">Owner dashboard access / Acesso do proprietário</h3>
    {owner ? <form action={linkRestaurantOwner} className="mt-3 space-y-3 text-sm">
      <p className="break-all">Connected account / Conta ligada: {owner.clerk_user_id}</p>
      <input type="hidden" name="restaurantId" value={id} /><input type="hidden" name="userId" value={owner.clerk_user_id!} />
      <button name="intent" value="remove" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Remove owner access / Remover acesso</button>
    </form> : <form action={linkRestaurantOwner} className="mt-3 space-y-3 text-sm">
      <input type="hidden" name="restaurantId" value={id} />
      <p>The owner can copy their account ID from My account. / O proprietário pode copiar o ID na sua conta.</p>
      <label className="block">Owner account ID / ID da conta
        <input name="userId" required pattern="user_[a-zA-Z0-9]{10,100}" placeholder="user_…" className="mt-1 w-full rounded border p-2" />
      </label>
      <label className="block">Review note / Nota de análise
        <textarea name="note" required minLength={20} maxLength={2000} className="mt-1 w-full rounded border p-2" />
      </label>
      <label className="flex items-start gap-2"><input type="checkbox" name="permission" required className="mt-1" /><span>I checked this account belongs to an authorised restaurant representative. / Confirmei que a conta pertence a um representante autorizado.</span></label>
      <button className="rounded-lg bg-[#252a32] px-4 py-2 text-white">Connect owner / Ligar proprietário</button>
    </form>}
  </section>;
}
