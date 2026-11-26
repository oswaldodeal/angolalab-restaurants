'use client';

import { useActionState, useState } from 'react';
import { saveFppVisitorSettings } from '@/app/professional-profile/visitor-actions';
import { additionalFields, countryCodes, fppVisitorDetails, visitorFields, type VisitorSettings } from '@/lib/fpp-visitor-settings';
import type { ProfessionalProfile } from '@/lib/professional-profile-fields';

const input = 'mt-1 block w-full rounded-lg border border-[#ded8c5] bg-white px-3 py-2';
const secondary = 'rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold hover:bg-[#f7f5ef]';

export default function FppVisitorSettings({ profile, settings, language }: {
  profile: ProfessionalProfile;
  settings: VisitorSettings & { photo: string };
  language: 'en' | 'pt';
}) {
  const pt = language === 'pt';
  const [preview, setPreview] = useState(false);
  const [result, submit, pending] = useActionState(saveFppVisitorSettings, null);
  const countries = new Intl.DisplayNames([language], { type: 'region' });
  const details = fppVisitorDetails(profile, settings, language);

  return (
    <section className="mt-6 rounded-xl border border-[#ded8c5] bg-white p-4 sm:p-6">
      <h3 className="text-lg font-semibold">{pt ? 'Visibilidade e colaboração' : 'Visibility and collaboration'}</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" aria-pressed={!preview} className={secondary} onClick={() => setPreview(false)}>{pt ? 'Editar preferências' : 'Edit preferences'}</button>
        <button type="button" aria-pressed={preview} className={secondary} onClick={() => setPreview(true)}>{pt ? 'Vista do visitante' : 'Visitor preview'}</button>
      </div>
      {preview ? (
        <div className="mt-4 rounded-lg bg-[#fffdf8] p-4">
          <p className="text-sm">{pt ? 'Vista privada com as preferências guardadas.' : 'Private preview using your saved preferences.'}</p>
          <h4 className="mt-3 text-xl font-semibold">{profile.displayName}</h4>
          {settings.photo && settings.visible.includes('photo') && <img src={settings.photo} alt={pt ? 'Pré-visualização da fotografia' : 'Profile photo preview'} className="mt-3 size-24 rounded-full object-cover" />}
          {details.length > 0 && <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {details.map(detail => <div key={detail.key} className="min-w-0">
              <dt className="font-semibold">{detail.label}</dt><dd className="break-words whitespace-pre-wrap">{detail.value}</dd>
            </div>)}
          </dl>}
        </div>
      ) : (
        <form action={submit} className="mt-4">
          <p className="mb-4 text-sm">{pt ? 'Guarda as tuas escolhas para atualizar a pré-visualização. A fotografia aparece nas tuas publicações se ativares a sua visibilidade.' : 'Save your choices to update the preview. Your photo appears on your published posts when you enable its visibility.'}</p>
          <fieldset key={JSON.stringify({ ...settings, photo: undefined })} disabled={pending} className="grid gap-4 sm:grid-cols-2">
            {additionalFields.map(field => <label key={field.key} className="block text-sm font-semibold">
              {field[language]} <span className="font-normal">({pt ? 'opcional' : 'optional'})</span>
              <input type={field.key === 'instagram' || field.key === 'facebook' ? 'url' : 'text'} name={field.key} maxLength={field.maxLength} defaultValue={settings[field.key]} className={input} />
            </label>)}
            <label className="block text-sm font-semibold">
              {pt ? 'País de residência' : 'Country of residence'}
              <select name="country" defaultValue={settings.country} className={input}>
                <option value="">{pt ? 'Selecionar país' : 'Select a country'}</option>
                {countryCodes.map(code => <option key={code} value={code}>{countries.of(code)}</option>)}
              </select>
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="font-semibold">{pt ? 'Países onde queres colaborar' : 'Countries where you want to collaborate'}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {countryCodes.map(code => <label key={code} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="markets" value={code} defaultChecked={settings.markets.includes(code)} className="accent-[#927018]" />{countries.of(code)}
                </label>)}
              </div>
            </fieldset>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="remote" defaultChecked={settings.remote} className="accent-[#927018]" />{pt ? 'Disponível para projetos à distância' : 'Available for remote projects'}
            </label>
            <fieldset className="rounded-lg border border-[#ded8c5] p-4 sm:col-span-2">
              <legend className="px-1 font-semibold">{pt ? 'Visibilidade do perfil' : 'Profile visibility'}</legend>
              <p className="mb-3 text-sm">{pt ? 'A vista do visitante mostra os campos selecionados. Para os partilhares na comunidade, ativa a opção abaixo.' : 'The visitor preview shows the selected fields. Turn on sharing below to show them in the community.'}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {visitorFields.map(field => <label key={field.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="visible" value={field.key} defaultChecked={settings.visible.includes(field.key)} className="accent-[#927018]" />{field[language]}
                </label>)}
              </div>
            </fieldset>
            <label className="flex items-start gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="shareDetails" defaultChecked={settings.shareDetails} className="mt-1 accent-[#927018]" />
              {pt ? 'Mostrar os detalhes selecionados no meu perfil da comunidade' : 'Show the selected details on my community profile'}
            </label>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold">
                {pt ? 'Fotografia de perfil (opcional)' : 'Profile photo (optional)'}
                <p className="my-2 font-normal">{pt ? 'JPG, PNG ou WebP até 250 KB.' : 'JPG, PNG or WebP up to 250 KB.'}</p>
                <input type="file" name="photoFile" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
              </label>
              {settings.photo && <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" name="removePhoto" />{pt ? 'Remover fotografia guardada' : 'Remove saved photo'}
              </label>}
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input name="adult" type="checkbox" required className="accent-[#927018]" />{pt ? 'Confirmo que tenho 18 anos ou mais.' : 'I confirm that I am 18 or older.'}
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-60">
                {pending ? (pt ? 'A guardar…' : 'Saving…') : (pt ? 'Guardar preferências' : 'Save preferences')}
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {result && <p role="status" className={result === 'saved' ? 'mt-3 text-emerald-800' : 'mt-3 text-red-700'}>
        {result === 'saved' ? (pt ? 'Preferências guardadas.' : 'Preferences saved.')
          : result === 'invalid-photo' ? (pt ? 'Seleciona JPG, PNG ou WebP até 250 KB.' : 'Choose a JPG, PNG or WebP up to 250 KB.')
          : result === 'invalid' ? (pt ? 'Verifica os dados, incluindo os endereços HTTPS dos perfis sociais e a confirmação de idade.' : 'Check your details, including HTTPS social profile links and age confirmation.')
          : (pt ? 'Não foi possível guardar as preferências.' : 'Unable to save your preferences.')}
      </p>}
    </section>
  );
}
