'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CITIES, COUNTRIES, CUISINES } from '@/lib/store';

type Language = 'pt' | 'en';
type Fields = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  restaurantName: string;
  country: string;
  city: string;
  cuisine: string;
  address: string;
  openingHours: string;
  website: string;
};
const empty: Fields = {
  ownerName: '', ownerEmail: '', ownerPhone: '', restaurantName: '',
  country: '', city: '', cuisine: '', address: '', openingHours: '', website: '',
};

export default function RestaurantRegistration({ language }: { language: Language }) {
  const pt = language === 'pt';
  const [form, setForm] = useState<Fields>(empty);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const update = (name: keyof Fields, value: string) => setForm((previous) => ({
    ...previous,
    [name]: value,
    ...(name === 'country' ? { city: '' } : {}),
  }));
  const cities = CITIES.filter((item) => item.country === form.country);
  const inputClass = 'w-full rounded-lg border border-[#d9d5c9] bg-white px-4 py-3 text-[#222] focus-visible:outline-2 focus-visible:outline-[#b18a23]';
  const labelClass = 'block text-sm font-medium mb-2';
  const back = pt ? '/pt/restaurantes' : '/en/restaurants';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/restaurant-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Unable to save');
      setSubmitted(true);
      setForm(empty);
    } catch {
      setError(pt
        ? 'Não foi possível guardar o registo. Tente novamente mais tarde.'
        : 'Your registration could not be saved. Please try again later.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#222] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href={back} className="mb-7 inline-block font-medium text-[#876613] hover:underline">
          ← {pt ? 'Voltar aos restaurantes' : 'Back to restaurants'}
        </Link>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#987515]">
          {pt ? 'AngolaLab · Registo de Negócios' : 'AngolaLab · Business Registration'}
        </p>
        <h1 className="text-3xl font-semibold">{pt ? 'Registar restaurante' : 'Register a restaurant'}</h1>
        <p className="mb-7 mt-3 border-b-[3px] border-[#D2AC37] pb-7 leading-relaxed text-[#555]">
          {pt
            ? 'Envie os dados para análise. O restaurante não será publicado ou verificado automaticamente.'
            : 'Submit details for review. Your restaurant will not be published or verified automatically.'}
        </p>

        {submitted ? (
          <div role="status" className="rounded-xl border border-[#ded8c5] bg-[#fffaf0] p-8">
            <h2 className="mb-3 text-2xl font-semibold">{pt ? 'Registo recebido' : 'Registration received'}</h2>
            <p className="mb-6 text-[#555]">
              {pt
                ? 'Os dados foram guardados e aguardam análise da equipa AngolaLab.'
                : 'Your details were saved and are awaiting AngolaLab staff review.'}
            </p>
            <Link href={back} className="inline-flex rounded-lg bg-[#252a32] px-5 py-3 text-white">
              {pt ? 'Ver restaurantes' : 'Browse restaurants'}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-7">
            <section className="rounded-xl border border-[#ded8c5] p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#987515]">
                {pt ? '01 · Contacto do responsável' : '01 · Owner contact'}
              </h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="ownerName" className={labelClass}>{pt ? 'Nome completo' : 'Full name'} *</label>
                  <input id="ownerName" className={inputClass} required maxLength={120} autoComplete="name" value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ownerEmail" className={labelClass}>Email *</label>
                  <input id="ownerEmail" className={inputClass} required type="email" maxLength={254} autoComplete="email" value={form.ownerEmail} onChange={(e) => update('ownerEmail', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ownerPhone" className={labelClass}>{pt ? 'Telefone' : 'Phone'} *</label>
                  <input id="ownerPhone" className={inputClass} required type="tel" maxLength={35} autoComplete="tel" value={form.ownerPhone} onChange={(e) => update('ownerPhone', e.target.value)} />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#ded8c5] p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#987515]">
                {pt ? '02 · Dados do restaurante' : '02 · Restaurant details'}
              </h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="restaurantName" className={labelClass}>{pt ? 'Nome do restaurante' : 'Restaurant name'} *</label>
                  <input id="restaurantName" className={inputClass} required maxLength={160} value={form.restaurantName} onChange={(e) => update('restaurantName', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>{pt ? 'País' : 'Country'} *</label>
                  <select id="country" className={inputClass} required value={form.country} onChange={(e) => update('country', e.target.value)}>
                    <option value="">{pt ? 'Selecione um país' : 'Select a country'}</option>
                    {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c[language]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>{pt ? 'Cidade' : 'City'} *</label>
                  <select id="city" className={inputClass} required disabled={!form.country} value={form.city} onChange={(e) => update('city', e.target.value)}>
                    <option value="">{pt ? 'Selecione uma cidade' : 'Select a city'}</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c[language]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="cuisine" className={labelClass}>{pt ? 'Tipo de cozinha' : 'Cuisine'} *</label>
                  <select id="cuisine" className={inputClass} required value={form.cuisine} onChange={(e) => update('cuisine', e.target.value)}>
                    <option value="">{pt ? 'Selecione o tipo' : 'Select cuisine'}</option>
                    {CUISINES.map((c) => <option key={c.id} value={c.id}>{c[language]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>{pt ? 'Morada do restaurante' : 'Restaurant address'} *</label>
                  <input id="address" className={inputClass} required maxLength={300} value={form.address} onChange={(e) => update('address', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="openingHours" className={labelClass}>{pt ? 'Horário de funcionamento (opcional)' : 'Opening hours (optional)'}</label>
                  <input id="openingHours" className={inputClass} maxLength={200} value={form.openingHours} onChange={(e) => update('openingHours', e.target.value)} />
                </div>
              </div>
            </section>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
            </div>

            <p className="border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-5 py-4 text-sm leading-relaxed text-[#454545]">
              {pt
                ? 'Os dados de contacto serão utilizados apenas para analisar o pedido. Não envie documentos de identificação ou palavras-passe.'
                : 'Contact details are used only to review your submission. Do not send identity documents or passwords.'}
            </p>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            <button disabled={saving} type="submit" className="w-full rounded-xl bg-[#252a32] px-6 py-4 text-base font-semibold text-white hover:bg-[#414751] disabled:cursor-wait disabled:opacity-60">
              {saving
                ? (pt ? 'A guardar…' : 'Saving…')
                : (pt ? 'Enviar para análise' : 'Submit for review')}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
