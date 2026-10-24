import { staffAuthorized } from '@/lib/staff-auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StaffLogin({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await staffAuthorized()) redirect('/staff/review');
  const { error } = await searchParams;
  return <main className="min-h-[65vh] bg-white px-5 py-12 text-[#222]">
    <div className="mx-auto max-w-lg rounded-xl border border-[#ded8c5] p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[#987515]">AngolaLab · Staff only</p>
      <h1 className="mt-3 text-3xl font-semibold">Restaurant review access</h1>
      <p className="mt-3 text-[#555]">Private research records. Not for restaurant owners or public visitors.</p>
      {error && <p role="alert" className="mt-5 rounded bg-red-50 p-3 text-red-800">Access unavailable or incorrect password.</p>}
      <form action="/api/staff/login" method="post" className="mt-7 space-y-4">
        <label htmlFor="password" className="block font-medium">Staff password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="w-full rounded-lg border border-[#ded8c5] p-3" />
        <button className="w-full rounded-lg bg-[#252a32] p-3 font-semibold text-white">Sign in</button>
      </form>
    </div>
  </main>;
}
