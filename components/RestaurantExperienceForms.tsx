'use client';

import { useActionState } from 'react';
import { reviewExperience, submitExperience } from '@/app/feedback/experience-actions';
import { experienceCriteria } from '@/lib/experience-criteria';

const field = 'mt-1 block w-full rounded-lg border border-[#ded8c5] bg-white p-2';
const button = 'rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50';

export function RestaurantExperienceForm({ orderId, language }: { orderId: string; language: 'pt' | 'en' }) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(submitExperience, '');
  return <details className="mt-3 border-t border-[#ded8c5] pt-3">
    <summary className="cursor-pointer font-semibold text-emerald-800">{pt ? 'Avaliar a experiência' : 'Rate your experience'}</summary>
    <form action={action} className="mt-3">
      <input type="hidden" name="orderId" value={orderId}/>
      <fieldset disabled={pending} className="space-y-3">
        <legend className="mb-2">{pt ? '1 = Muito fraco · 5 = Excelente. A equipa AngolaLab analisa as respostas em privado.' : '1 = Very poor · 5 = Excellent. AngolaLab staff review responses privately.'}</legend>
        <div className="grid gap-3 sm:grid-cols-2">{experienceCriteria.map(criterion =>
          <label key={criterion.key}>{criterion[language]}
            <select name={criterion.key} required defaultValue="" className={field}>
              <option value="" disabled>{pt ? 'Escolher avaliação' : 'Choose rating'}</option>
              {[1,2,3,4,5].map(value => <option key={value}>{value}</option>)}
              <option value="na">{pt ? 'Não aplicável' : 'Not applicable'}</option>
            </select>
          </label>)}</div>
        <label className="block">{pt ? 'O que correu bem e o que pode melhorar? (opcional)' : 'What worked well and what could be better? (optional)'}
          <textarea name="comment" maxLength={2000} rows={3} className={field}/>
        </label>
        <button className={button}>{pt ? 'Enviar avaliação' : 'Send survey'}</button>
      </fieldset>
      {result && <p role="status" className="mt-2">{result === 'sent'
        ? (pt ? 'Avaliação enviada.' : 'Survey sent.')
        : (pt ? 'Confirma as respostas e tenta novamente.' : 'Check your ratings and try again.')}</p>}
    </form>
  </details>;
}

export function StaffExperienceReviewForm({ orderId, reviewedAt, analysis, visit }: {
  orderId: string; reviewedAt: string; analysis: string; visit: string;
}) {
  const [result, action, pending] = useActionState(reviewExperience, '');
  return <form action={action} className="mt-3">
    <input type="hidden" name="orderId" value={orderId}/>
    <input type="hidden" name="reviewedAt" value={reviewedAt}/>
    <fieldset disabled={pending} className="space-y-3">
      <label className="block">Private staff analysis<textarea name="analysis" defaultValue={analysis} required maxLength={2000} rows={2} className={field}/></label>
      <label className="block">Visit observations (optional)<textarea name="visit" defaultValue={visit} maxLength={2000} rows={2} className={field}/></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="visitPermission" defaultChecked={Boolean(visit)}/> The venue agreed to the visit.</label>
      <button className={button}>Save review</button>
    </fieldset>
    {result && <p role="status" className="mt-2">{result === 'saved' ? 'Review saved.' : 'Check the analysis and visit permission, or refresh and try again.'}</p>}
  </form>;
}
