import { preparePilotFeedback } from '@/lib/pilot-feedback';
import { executePrivateSql, sqlRows } from '@/lib/turso';

export default async function StaffPilotFeedback() {
  try {
    await preparePilotFeedback();
    const entries = sqlRows(await executePrivateSql('SELECT rowid,body,submitted_at FROM pilot_feedback ORDER BY rowid DESC LIMIT 100'));
    return <details className="mt-6 rounded-xl border border-[#ded8c5] p-4">
      <summary className="cursor-pointer font-semibold">User feedback</summary>
      {entries.length ? <ul className="mt-3 divide-y divide-[#ded8c5]">
        {entries.map(entry => <li key={entry.rowid} className="py-3">
          <time className="text-sm text-[#555]">{entry.submitted_at?.slice(0, 10)}</time>
          <p className="whitespace-pre-wrap break-words">{entry.body}</p>
        </li>)}
      </ul> : <p className="mt-3 text-sm">No feedback yet.</p>}
    </details>;
  } catch {
    return <p className="mt-6">Unable to load user feedback.</p>;
  }
}
