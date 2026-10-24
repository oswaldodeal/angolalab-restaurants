import { redirect } from 'next/navigation';
import { staffAuthorized } from '@/lib/staff-auth';
import { getStaffSubmissions } from '@/lib/staff-submissions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private staff review | AngolaLab', robots: { index: false, follow: false } };

export default async function StaffReview() {
  if (!(await staffAuthorized())) redirect('/staff/review/login');
  let submissions;
  try {
    submissions = await getStaffSubmissions();
  } catch {
    return <main className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold">Staff review</h1>
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
          Unable to load registrations. Check the preview database connection.
        </p>
      </div>
    </main>;
  }
  return <main className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-[#987515]">AngolaLab · Private Research</p>
      <h1 className="mt-3 text-3xl font-semibold">Restaurant submissions</h1>
      <p className="mt-3 border-b-[3px] border-[#D2AC37] pb-6 text-[#555]">
        Staff-only review · {submissions.length} latest submissions · Read-only pilot.
        Approval and publication are not enabled.
      </p>
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
          </article>)}</div>}
    </div>
  </main>;
}
