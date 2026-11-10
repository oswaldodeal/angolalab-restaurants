import StaffPhotoInput from '@/components/StaffPhotoInput';
import { MENU_PHOTO_LIMIT, SAMPLE_RESTAURANT_COVER } from '@/lib/store';
import StaffReviewForm from '@/components/StaffReviewForm';
import { enableProPlan, publishVerifiedContacts, removeCoverPhoto, signOutStaff, updateMenuPhoto } from './actions';
import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { getStaffSubmissions } from '@/lib/staff-submissions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private staff review | AngolaLab', robots: { index: false, follow: false } };

export default async function StaffReview({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const { result } = await searchParams;
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  let submissions;
  try {
    submissions = await getStaffSubmissions();
  } catch (error) {
    const code = error instanceof Error ? error.message : '';
    const diagnosis = ({
      TURSO_INVALID_URL: 'The saved TURSO_DATABASE_URL is not a valid Turso URL. Its Value must be the libsql:// database URL, not the token.',
      TURSO_TOKEN_REJECTED: 'Turso rejected the saved token. Use a valid token for the same Restaurants database as TURSO_DATABASE_URL.',
      TURSO_WRITE_DENIED: 'The database token cannot prepare the pilot tables. This workflow needs read/write database access.',
      TURSO_SCHEMA_MISMATCH: 'The existing submissions table has a different structure. The migration needs an adjustment; keep existing records unchanged.',
      TURSO_NOT_CONFIGURED: 'The database URL or token is missing from this Preview deployment.',
    } as Record<string, string>)[code] ?? 'The database request or table setup failed. The saved credentials and schema need checking.';
    return <main className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold">Staff review</h1>
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
          Unable to load registrations. {diagnosis}
        </p>
      </div>
    </main>;
  }
  return <main className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-[#987515]">AngolaLab · Private Research</p>
      <h1 className="mt-3 text-3xl font-semibold">Restaurant submissions</h1>
      <p className="mt-3 border-b-[3px] border-[#D2AC37] pb-6 text-[#555]">
        Staff-only review · {submissions.length} latest submissions.
        Approval publishes a Basic listing only. Verification is a separate evidence review.
        Pilot reviews use one shared staff identity; review notes and timestamps are recorded.
      </p>
      <form action={signOutStaff}><button className="mt-5 rounded-lg border border-[#ded8c5] px-4 py-2">Sign out / Sair</button></form>
      {result && <p role="status" className="mt-5 rounded-lg bg-[#fffaf0] p-4">{result === 'menu-duplicate' ? 'This image is already on the menu. / Esta imagem já está na ementa.' : result === 'menu-limit' ? 'Remove an image before adding another. / Remova uma imagem antes de adicionar outra.' : result === 'invalid-upload' ? 'Choose a JPG, PNG or WebP image up to 250 KB.' : result === 'menu-saved' ? 'Menu image saved / Imagem da ementa guardada.' : result === 'menu-removed' ? 'Menu image removed / Imagem da ementa removida.' : result === 'cover-removed' ? 'Cover photo removed / Fotografia de capa removida.' : result === 'invalid-cover' ? 'Enter a direct HTTPS image URL for the approved cover photo.' : result === 'verified' ? 'Verified profile published / Perfil verificado publicado.' : result === 'invalid-verification' ? 'Enter a valid business address and public phone, record the evidence, and confirm permission to publish.' : result === 'saved' ? 'Decision saved. Directory updated / Decisão guardada.' : result === 'stale' ? 'This record has changed or already been reviewed. Reload it and try again.' : result === 'invalid' ? 'Add a review note of 20–2000 characters. Publication also requires the identity and permission check.' : 'Unable to save. No publication decision was confirmed. Try again later.'}</p>}
      {submissions.length === 0 ? <p className="mt-8">No submissions yet.</p> :
        <div className="mt-8 space-y-5">{submissions.map((item, index) =>
          <article key={item.id} className="rounded-xl border border-[#ded8c5] p-6">
            <p className="text-sm font-semibold text-[#987515]">{String(index + 1).padStart(2, '0')} · {item.status.toUpperCase()}</p>
            <h2 className="mt-2 text-2xl font-semibold">{item.restaurant_name}</h2>
            <p className="mt-2 text-[#555]">{item.city}, {item.country} · {item.cuisine}</p>
            <p className="mt-1 text-sm text-[#555]">{item.address}</p>
            {item.opening_hours && <p className="mt-1 text-sm">Hours: {item.opening_hours}</p>}
            <div className="mt-5 border-t border-[#ded8c5] pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#987515]">Private owner contact</p>
              <p className="mt-2">{item.owner_name}</p>
              <p className="break-all">{item.owner_email}</p>
              <p>{item.owner_phone}</p>
              <p className="mt-2 text-xs text-[#777]">Received: {item.created_at}</p>
            </div>
            {item.review_note && <p className="mt-4 rounded-lg bg-[#fffaf0] p-4 text-sm">Latest review: {item.review_note} · {item.reviewed_by} · {item.reviewed_at}</p>}
            {(item.status === 'pending' || item.status === 'approved') && <StaffReviewForm id={item.id} published={item.status === 'approved'} />}
            {item.status === 'approved' && !item.verified_at && (
              <form action={publishVerifiedContacts} className="mt-6 space-y-4 rounded-lg border border-[#ded8c5] bg-[#fffaf0] p-4">
                <h3 className="font-semibold">Publish Verified profile / Publicar perfil verificado</h3>
                <p className="text-sm text-[#555]">Enter the business details approved for publication. Owner contacts above are private.</p>
                <input type="hidden" name="id" value={item.id} />
                <label className="block text-sm font-medium">
                  Public business address / Morada pública
                  <input name="publicAddress" required minLength={5} maxLength={300} className="mt-1 w-full rounded border border-[#ded8c5] bg-white p-2" />
                </label>
                <label className="block text-sm font-medium">
                  Public business phone / Telefone público
                  <input name="publicPhone" type="tel" required maxLength={35} className="mt-1 w-full rounded border border-[#ded8c5] bg-white p-2" />
                </label>
                <label className="block text-sm font-medium">
                  Verification evidence / Evidência de verificação
                  <textarea name="evidenceNote" required minLength={20} maxLength={2000} className="mt-1 w-full rounded border border-[#ded8c5] bg-white p-2" />
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" name="verifiedConsent" required className="mt-1" />
                  <span>I checked the business evidence and have permission to publish this address and phone number.</span>
                </label>
                <button type="submit" className="rounded-lg bg-[#252a32] px-4 py-3 font-semibold text-white">Publish Verified / Publicar verificado</button>
              </form>
            )}
            {item.status === 'approved' && item.verified_at && (
              <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
                <h3 className="font-semibold">Cover photo / Fotografia de capa</h3>
                <form action={enableProPlan} className="mt-4 space-y-3">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="block text-sm font-medium">
                    Choose a new cover file / Escolher nova fotografia de capa
                    <StaffPhotoInput cover />
                    <span className="text-xs text-[#555]">JPG, PNG, WebP · 250 KB max</span>
                  </div>
                  <label className="block text-sm font-medium">
                    Cover photo URL / Ligação da fotografia de capa
                    <input type="url" name="coverPhotoUrl" maxLength={2000} defaultValue={item.cover_photo_url?.startsWith('https://') ? item.cover_photo_url : ''} className="mt-1 w-full rounded border border-[#ded8c5] p-2" />
                  </label>
                  <button type="submit" className="rounded-lg bg-[#252a32] px-4 py-2 text-sm font-semibold text-white">
                    {item.pro_id ? (item.cover_photo_url ? 'Replace cover / Substituir capa' : 'Add cover / Adicionar capa') : 'Enable Pro Verified / Ativar Pro Verificado'}
                  </button>
                  <button type="submit" name="sampleCover" value="yes" formNoValidate className="ml-3 rounded-lg border border-[#ded8c5] px-4 py-2 text-sm font-semibold text-emerald-700">
                    Use sample cover / Usar capa de demonstração
                  </button>
                  {item.cover_photo_url === SAMPLE_RESTAURANT_COVER && <p className="text-sm text-[#555]">Sample cover in use / Capa de demonstração ativa</p>}
                </form>
                {item.cover_photo_url && (
                  <form action={removeCoverPhoto} className="mt-4">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="expectedCover" value={item.cover_photo_url} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.cover_photo_url} alt="Current cover / Capa atual" referrerPolicy="no-referrer" loading="lazy" className="mb-3 aspect-video w-full max-w-xs rounded-lg object-cover" />
                    <button type="submit" className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">
                      Remove cover / Remover capa
                    </button>
                  </form>
                )}
              </section>
            )}
            {item.pro_id && (
              <section className="mt-6 rounded-lg border border-[#ded8c5] p-4">
                <h3 className="font-semibold">Menu images / Imagens da ementa ({item.menuPhotos.length}/{MENU_PHOTO_LIMIT})</h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {item.menuPhotos.map((photo, index) => (
                    <li key={photo}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`Menu image ${index + 1} / Imagem da ementa ${index + 1}`} loading="lazy" className="w-full max-w-xs rounded-lg" />
                      <form action={updateMenuPhoto} className="mt-2">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="expectedMenu" value={photo} />
                        <button type="submit" name="removeMenu" value="yes" className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">
                          Remove image {index + 1} / Remover imagem {index + 1}
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
                <form action={updateMenuPhoto} className="mt-4 space-y-3">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="block text-sm font-medium">
                    Choose a menu image / Escolher imagem da ementa
                    <StaffPhotoInput cover />
                    <span className="text-xs text-[#555]">JPG, PNG, WebP · 250 KB max</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className="rounded-lg bg-[#252a32] px-4 py-2 text-sm font-semibold text-white">Add menu image / Adicionar imagem</button>
                    <button type="submit" name="sampleMenu" value="yes" formNoValidate className="rounded-lg border border-[#ded8c5] px-4 py-2 text-sm font-semibold text-emerald-700">Use sample dish / Usar prato de demonstração</button>
                  </div>
                </form>
              </section>
            )}
            {item.status === 'approved' && <a className="mt-4 inline-block font-semibold text-[#876613]" href={'/en/restaurants/' + item.id}>{item.verified_at ? 'Open Verified profile →' : 'Open Basic profile →'}</a>}
          </article>)}</div>}
    </div>
  </main>;
}
