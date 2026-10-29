'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CITIES, COUNTRIES, CUISINES } from '@/lib/store';
import { BUSINESS_TYPES, BASIC_PROFILE_LIMITS, BASIC_PROFILE_EXAMPLES, basicProfileItemCount, type BusinessType } from '@/lib/business-types';

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
  const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
  const [previewTier, setPreviewTier] = useState<'basic' | 'verified' | 'pro'>('basic');
  const [cardPublishedPreview, setCardPublishedPreview] = useState(false);
  const [sampleCardType, setSampleCardType] = useState<'business' | 'personal'>('business');
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

  function downloadSampleContact() {
    // Both examples are fictional. Never export registration form or private owner details.
    const identity = sampleCardType === 'business'
      ? ['N:;Restaurante Exemplo;;;', 'FN:Restaurante Exemplo', 'ORG:Restaurante Exemplo', 'TEL;TYPE=WORK,VOICE:+1-202-555-0147']
      : ['N:Exemplo;Ana;;;', 'FN:Ana Exemplo', 'TEL;TYPE=CELL,VOICE:+1-202-555-0147'];
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      ...identity,
      'NOTE:Fictional contact for AngolaLab research demonstration - not a real person or business',
      'END:VCARD',
      '',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = sampleCardType === 'business' ? 'restaurante-exemplo-demo.vcf' : 'ana-exemplo-demo.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Non-restaurant categories are research previews, not active registration.
    if (businessType !== 'restaurant') return;
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

        {!submitted && (
          <section className="mb-7 rounded-xl border border-[#ded8c5] bg-[#fffdf8] p-6" aria-label={pt ? 'Tipo de negócio' : 'Business type'}>
            <h2 className="mb-3 text-lg font-semibold text-[#987515]">{pt ? '🧱 Brick 009A · Tipo de negócio' : '🧱 Brick 009A · Business type'}</h2>
            <label htmlFor="businessType" className={labelClass}>{pt ? 'Escolha o tipo de negócio' : 'Choose your business type'}</label>
            <select id="businessType" className={inputClass} value={businessType} onChange={(event) => setBusinessType(event.target.value as BusinessType)}>
              {BUSINESS_TYPES.map((type) => <option key={type.id} value={type.id}>{type[language]}</option>)}
            </select>
            <p className="mt-3 text-sm text-[#555]">
              {BUSINESS_TYPES.find((type) => type.id === businessType)?.[pt ? 'focusPt' : 'focusEn']}
            </p>
            <div className="mt-4 rounded-lg border border-[#e9e5db] bg-white p-4 text-sm">
              <p className="font-semibold">{pt ? 'Capacidade do perfil Básico' : 'Basic profile capacity'}: {basicProfileItemCount(businessType)} {pt ? 'itens' : 'items'}</p>
              <p className="mt-1 text-[#555]">
                {BASIC_PROFILE_LIMITS[businessType].featured} {pt ? 'itens em destaque com fotografia' : 'featured items with photos'}
                {BASIC_PROFILE_LIMITS[businessType].textOnly > 0 && (
                  <> · {BASIC_PROFILE_LIMITS[businessType].textOnly} {pt ? 'itens adicionais sem fotografia' : 'additional text-only items'}</>
                )}
              </p>
              <p className="mt-2 text-xs text-[#777]">{pt ? 'Modelo de investigação; a edição de perfis para outras categorias ainda não está disponível.' : 'Research model; profile editing for other categories is not available yet.'}</p>
            </div>
            {/* Brick 010: visual-only adaptive profile research, no submissions or uploads. */}
            <div className="mt-5 rounded-xl border border-[#ded8c5] bg-[#faf9f6] p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#987515]">
                {pt ? 'Brick 010E · Pré-visualização adaptável' : 'Brick 010E · Adaptive profile preview'}
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                {BUSINESS_TYPES.find((type) => type.id === businessType)?.[language]} · {previewTier === 'basic' ? (pt ? 'Perfil Básico' : 'Basic Profile') : previewTier === 'verified' ? (pt ? 'Perfil Verificado (exemplo)' : 'Verified Profile (example)') : (pt ? 'Pro Verificado (planeado)' : 'Pro Verified (planned)')}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#666]">
                {pt ? 'Exemplo ilustrativo: não representa um negócio real, nem publica produtos.' : 'Illustrative example: not a real business and no products are published.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={pt ? 'Escolher demonstração de perfil' : 'Choose profile demonstration'}>
                {(['basic', 'verified', 'pro'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    aria-pressed={previewTier === tier}
                    onClick={() => setPreviewTier(tier)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b18a23] ${previewTier === tier ? 'border-[#987515] bg-[#fff0bd] text-[#59430a]' : 'border-[#d9d5c9] bg-white text-[#555] hover:bg-[#fffaf0]'}`}
                  >
                    {tier === 'basic' ? (pt ? 'Básico' : 'Basic') : tier === 'verified' ? (pt ? 'Verificado · Exemplo' : 'Verified · Example') : (pt ? 'Pro Verificado · Planeado' : 'Pro Verified · Planned')}
                  </button>
                ))}
              </div>
              {previewTier !== 'basic' && (
                <div className="mt-4 rounded-lg border border-[#ded8c5] bg-white p-4 text-sm" role="status">
                  <p className="font-semibold text-[#76570f]">{pt ? 'Exemplo de funcionalidades após verificação' : 'Example features after verification'}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(pt
                      ? ['Mais fotografias do negócio', 'Morada completa e mapa', 'Horário de funcionamento detalhado', 'Informações adicionais do responsável']
                      : ['Additional business photos', 'Full address and map', 'Detailed opening hours', 'Additional owner information']
                    ).map((feature) => (
                      <div key={feature} className="rounded-md border border-[#ece8dc] bg-[#faf9f6] p-3">{feature}</div>
                    ))}
                  </div>
                  {previewTier === 'pro' && (
                    <div className="mt-4 rounded-lg border border-dashed border-[#c8b98b] bg-[#fffaf0] p-4">
                      <p className="text-sm font-semibold text-[#76570f]">{pt ? 'Funcionalidades futuras · Ainda não disponíveis' : 'Future features · Not available yet'}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(pt ? ['Domínio próprio do negócio (planeado)', 'Cartão de visita digital com ligação ao perfil (planeado)', 'Design de cartão físico com identidade exclusiva do negócio (planeado)', 'Impressão de cartões físicos sob encomenda (planeado; custo separado)'] : ['Business-owned domain (planned)', 'Digital business card linking to the profile (planned)', 'Physical card design using only the business identity (planned)', 'Made-to-order physical printing (planned; separately priced)']).map((item) => (
                          <div key={item} className="rounded-md border border-[#ece8dc] bg-white p-3">{item}</div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-[#666]">{pt ? 'Os cartões mostram apenas a identidade do negócio, sem marca AngolaLab. Um código QR no cartão poderá abrir o perfil público.' : 'Cards show only the participating business identity, without AngolaLab branding. A QR code on the card could open its public profile.'}</p>
                      <div className="mt-4 rounded-lg border border-[#d8d1bd] bg-white p-4">
                        <p className="text-sm font-semibold text-[#76570f]">{pt ? 'Brick 010K · Cartões digitais pessoal e empresarial' : 'Brick 010K · Personal and business digital cards'}</p>
                        <p className="mt-1 text-xs text-[#666]">{pt ? 'Exemplo fictício. Os controlos de publicação só alteram esta demonstração no seu navegador.' : 'Fictional example. Publication controls only change this preview in your browser.'}</p>
                        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={pt ? 'Tipo de cartão de exemplo' : 'Sample card type'}>
                          {(['business', 'personal'] as const).map((type) => (
                            <button key={type} type="button" aria-pressed={sampleCardType === type} onClick={() => setSampleCardType(type)}
                              className={`rounded-lg border px-4 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${sampleCardType === type ? 'border-[#987515] bg-[#fff0bd] text-[#59430a]' : 'border-[#d9d5c9] bg-white text-[#555]'}`}>
                              {type === 'business' ? (pt ? 'Negócio' : 'Business') : (pt ? 'Pessoa' : 'Personal')}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setCardPublishedPreview((value) => !value)} aria-pressed={cardPublishedPreview} className="rounded-lg border border-[#987515] bg-[#fff0bd] px-4 py-2 text-xs font-semibold text-[#59430a] focus-visible:outline-2 focus-visible:outline-offset-2">
                            {cardPublishedPreview ? (pt ? 'Simular retirada de publicação' : 'Simulate unpublish') : (pt ? 'Simular publicação' : 'Simulate publish')}
                          </button>
                          <span className="self-center text-xs text-[#666]" role="status">{cardPublishedPreview ? (pt ? 'Estado simulado: público' : 'Simulated status: public') : (pt ? 'Estado simulado: privado' : 'Simulated status: private')}</span>
                        </div>
                        <div className="mx-auto mt-4 max-w-[310px] rounded-[1.6rem] border-[5px] border-[#353535] bg-white p-4 shadow-sm" aria-label={pt ? 'Exemplo de cartão de visita para telemóvel' : 'Mobile business card example'}>
                          <div className="rounded-xl bg-[#f4f0e5] p-5 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d7c58f] text-xl font-bold text-[#49390f]" aria-hidden="true">{sampleCardType === 'business' ? 'R' : 'A'}</div>
                            <p className="mt-3 text-lg font-bold">{sampleCardType === 'business' ? 'Restaurante Exemplo' : 'Ana Exemplo'}</p>
                            <p className="mt-1 text-xs text-[#555]">{sampleCardType === 'business' ? (pt ? 'Restaurante · Luanda (exemplo)' : 'Restaurant · Luanda (example)') : (pt ? 'Pessoa · Exemplo fictício' : 'Individual · Fictional example')}</p>
                            <p className="mt-3 text-xs font-medium text-[#76570f]">{pt ? 'Dados fictícios · Sem contacto real' : 'Fictional details · No real contact'}</p>
                          </div>
                          <div className="mt-3 space-y-2 text-center text-xs text-[#555]">
                            <p>{sampleCardType === 'business' ? (pt ? 'Horários e menu: disponíveis após publicação real' : 'Hours and menu: available after real publication') : (pt ? 'Nome e telemóvel fictícios para testar a importação' : 'Fictional name and mobile number for import testing')}</p>
                            <button type="button" onClick={downloadSampleContact} className="w-full rounded-lg bg-[#252a32] px-4 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2">
                              {pt ? 'Guardar contacto de exemplo (.vcf)' : 'Save sample contact (.vcf)'}
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#666]">{pt ? 'O ficheiro .vcf contém apenas dados fictícios, incluindo um número de telefone reservado para exemplos. Não são publicados dados, não existe ligação pública para partilhar e nenhum QR é gerado.' : 'The .vcf file contains only fictional sample details, including a reserved example telephone number. No data is published, no public share link exists and no QR is generated.'}</p>
                      </div>
                      {businessType === 'restaurant' && (
                        <div className="mt-4 rounded-lg border border-[#d8d1bd] bg-white p-4">
                          <p className="text-sm font-semibold text-[#76570f]">{pt ? 'Encomendas por QR na mesa · Investigação futura' : 'Table QR ordering · Future research'}</p>
                          <p className="mt-2 text-xs leading-relaxed text-[#555]">
                            {pt ? 'Exemplo conceptual: Mesa 05 → Ler QR da mesa → Consultar menu → Selecionar ACC271026 → Enviar pedido → Restaurante confirma.' : 'Concept only: Table 05 → Scan table QR → View menu → Select ACC271026 → Submit order → Restaurant confirms.'}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-[#666]">
                            {pt ? 'O QR da mesa é diferente do QR do cartão de visita. Não existe código QR funcional, encomenda, pagamento ou integração com a cozinha nesta versão. O atendimento tradicional continua disponível.' : 'The table QR is distinct from the business-card QR. This version has no functional QR code, ordering, payment or kitchen integration. Traditional waiter-assisted service remains an option.'}
                          </p>
                        </div>
                      )}
                      <p className="mt-3 text-xs text-[#666]">{pt ? 'Sem ativação, pagamento, reserva de domínio ou emissão de cartão nesta demonstração.' : 'No activation, payment, domain registration or business-card issuance in this demonstration.'}</p>
                    </div>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-[#666]">
                    {pt ? 'Apenas uma demonstração visual. Não foi verificada nenhuma empresa; não são apresentados dados reais, mapas ativos ou serviços pagos.' : 'Visual demonstration only. No business has been verified; no real business data, active maps or paid services are shown.'}
                  </p>
                </div>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: BASIC_PROFILE_LIMITS[businessType].featured }, (_, index) => (
                  <div key={`featured-${index}`} className="overflow-hidden rounded-lg border border-[#e9e5db] bg-white">
                    <div className="flex h-24 items-center justify-center bg-[#eae7df] text-xs font-medium text-[#6c665a]" aria-hidden="true">
                      {pt ? 'Espaço para fotografia' : 'Photo placeholder'}
                    </div>
                    <div className="p-3 text-sm font-medium">
                      {BASIC_PROFILE_EXAMPLES[businessType][language].featured[index]}
                    </div>
                  </div>
                ))}
              </div>
              {BASIC_PROFILE_LIMITS[businessType].textOnly > 0 && (
                <div className="mt-3 space-y-2">
                  {Array.from({ length: BASIC_PROFILE_LIMITS[businessType].textOnly }, (_, index) => (
                    <div key={`text-${index}`} className="rounded-lg border border-[#e9e5db] bg-white px-4 py-3 text-sm">
                      {BASIC_PROFILE_EXAMPLES[businessType][language].textOnly[index]}
                    </div>
                  ))}
                </div>
              )}

            </div>
            <p className="mt-3 text-xs text-[#6d5c32]">
              {pt ? 'Nesta fase, apenas o registo de restaurantes está ativo. As outras categorias são exemplos de investigação, sem envio de dados.' : 'Only restaurant registration is active at this stage. Other categories are research previews and do not submit data.'}
            </p>
          </section>
        )}

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
        ) : businessType !== 'restaurant' ? (
          <section className="rounded-xl border border-[#ded8c5] bg-[#fbf7ed] p-7" role="status">
            <h2 className="text-xl font-semibold">{pt ? 'Categoria em preparação' : 'Category in research'}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#555]">
              {pt ? 'Estamos a estudar como adaptar os perfis Básico e Verificado a este tipo de negócio. Ainda não é possível enviar um registo nesta categoria.' : 'We are researching how Basic and Verified profiles should adapt to this business type. Registration for this category is not available yet.'}
            </p>
            <button type="button" onClick={() => setBusinessType('restaurant')} className="mt-5 rounded-lg border border-[#b18a23] bg-white px-5 py-3 text-sm font-semibold text-[#75570d]">
              {pt ? 'Voltar ao registo de restaurante' : 'Return to restaurant registration'}
            </button>
          </section>
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
