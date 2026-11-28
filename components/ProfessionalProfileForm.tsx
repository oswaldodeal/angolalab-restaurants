'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { submitProfessionalProfile } from '@/app/professional-profile/actions';
import { professionalProfileFields, type ProfessionalProfile } from '@/lib/professional-profile-fields';

export default function ProfessionalProfileForm({ language, profile }: { language: 'en' | 'pt'; profile: ProfessionalProfile | null }) {
  const pt = language === 'pt';
  const [draft, setDraft] = useState(profile ?? { displayName: '', profession: '', skills: '', languages: '', projects: '' });
  const [result, submit, pending] = useActionState(submitProfessionalProfile, null);
  const messages = {
    saved: pt ? 'Perfil guardado.' : 'Profile saved.',
    invalid: pt ? 'Verifica o nome e o limite de caracteres de cada campo.' : 'Check your display name and the character limit for each field.',
    blocked: pt ? 'O teu acesso a esta funcionalidade está bloqueado.' : 'Your access to this feature is blocked.',
    unavailable: pt ? 'Não foi possível guardar o perfil. Tenta novamente.' : 'We could not save your profile. Try again.',
  };

  return (
    <form action={submit} className="mt-4">
      <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
        {professionalProfileFields.map(field => {
          const input = {
            name: field.key,
            maxLength: field.maxLength,
            value: draft[field.key],
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const value = event.target.value;
              setDraft(previous => ({ ...previous, [field.key]: value }));
            },
            className: 'mt-1 w-full rounded-lg border border-[#ded8c5] bg-white px-3 py-2',
          };
          const multiline = 'multiline' in field;
          return (
            <label key={field.key} className={multiline ? 'sm:col-span-2' : undefined}>
              {field[language]}
              {multiline ? <textarea {...input} rows={3} /> : <input {...input} required={'required' in field} />}
            </label>
          );
        })}
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-60">
            {pending ? (pt ? 'A guardar…' : 'Saving…') : (pt ? 'Guardar perfil' : 'Save profile')}
          </button>
        </div>
      </fieldset>
      {result && <p role="status" className={result === 'saved' ? 'mt-3 text-emerald-800' : 'mt-3 text-red-700'}>{messages[result]}</p>}
    </form>
  );
}
