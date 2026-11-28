'use client';

import { useActionState } from 'react';
import { changePilotAccessBlock } from '@/app/staff/review/access-block-actions';

const input = 'mt-1 block w-full rounded-lg border border-[#ded8c5] bg-white p-2';
const messages: Record<string, string> = {
  blocked: 'Contact blocked for restaurant commenting.',
  unblocked: 'Contact unblocked. Existing commenting permissions apply.',
  'not-blocked': 'No active block was found for that contact.',
  invalid: 'Enter a valid contact and a private reason.',
};

export default function StaffAccessBlockForm() {
  const [result, action, pending] = useActionState(changePilotAccessBlock, '');
  return <details className="mt-6 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-5">
    <summary className="cursor-pointer text-lg font-semibold">Block or unblock customer access</summary>
    <p className="mt-3 text-sm">Enter the customer’s verified phone number with its country code, or their verified email. This applies to commenting in the restaurant pilot.</p>
    <form action={action} className="mt-4 text-sm">
      <fieldset disabled={pending} className="space-y-3">
        <label className="block">Contact type<select name="kind" className={input}><option value="phone">Phone number</option><option value="email">Email address</option></select></label>
        <label className="block">Phone number or email<input name="contact" required maxLength={254} autoComplete="off" className={input}/></label>
        <label className="block">Private reason<textarea name="reason" required maxLength={1000} rows={2} className={input}/></label>
        <div className="flex flex-wrap gap-3">
          <button name="decision" value="block" className="rounded-lg bg-red-800 px-4 py-2 font-semibold text-white">Block contact</button>
          <button name="decision" value="unblock" className="rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold">Unblock contact</button>
        </div>
      </fieldset>
      {result && <p role="status" className="mt-3">{messages[result] ?? 'Unable to save the decision. Try again.'}</p>}
    </form>
  </details>;
}
