import { professionalProfileFields, type ProfessionalProfile } from '@/lib/professional-profile-fields';

export const countryCodes = ['AO', 'BR', 'CV', 'DK', 'FR', 'DE', 'GW', 'GQ', 'MZ', 'NL', 'PT', 'ST', 'ZA', 'TL', 'GB', 'US'] as const;

export const additionalFields = [
  { key: 'interests', en: 'Interests', pt: 'Interesses', maxLength: 240 },
  { key: 'publication', en: 'Publication', pt: 'Publicação', maxLength: 160 },
  { key: 'founder', en: 'Founder of', pt: 'Fundador de', maxLength: 160 },
  { key: 'instagram', en: 'Instagram', pt: 'Instagram', maxLength: 200 },
  { key: 'facebook', en: 'Facebook', pt: 'Facebook', maxLength: 200 },
  { key: 'city', en: 'City or place', pt: 'Cidade ou localidade', maxLength: 80 },
] as const;

const baseVisibilityFields = professionalProfileFields.filter(field => field.key !== 'displayName');
export const visitorFields = [
  ...baseVisibilityFields, ...additionalFields,
  { key: 'country', en: 'Country of residence', pt: 'País de residência' },
  { key: 'markets', en: 'Collaboration countries', pt: 'Países de colaboração' },
  { key: 'remote', en: 'Remote availability', pt: 'Disponibilidade à distância' },
  { key: 'photo', en: 'Profile photo', pt: 'Fotografia de perfil' },
] as const;

type ExtraField = typeof additionalFields[number]['key'];
type VisitorField = typeof visitorFields[number]['key'];
export type VisitorSettings = Record<ExtraField, string> & {
  country: string;
  markets: string[];
  remote: boolean;
  shareDetails: boolean;
  directoryDetails: boolean;
  introductions: boolean;
  visible: VisitorField[];
};

export const emptyVisitorSettings: VisitorSettings = {
  interests: '', publication: '', founder: '', instagram: '', facebook: '', city: '',
  country: '', markets: [], remote: false, shareDetails: false, directoryDetails: false, introductions: false, visible: [],
};

function allowedCountry(code: string) {
  return countryCodes.some(country => country === code);
}

function socialProfile(raw: string, network: 'instagram' | 'facebook') {
  if (!raw) return '';
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    if (url.protocol !== 'https:' || host !== network + '.com' || url.username || url.password || url.port || url.pathname === '/') return null;
    return url.origin + url.pathname;
  } catch {
    return null;
  }
}

export function readVisitorSettings(form: FormData): VisitorSettings | null {
  const settings: VisitorSettings = { ...emptyVisitorSettings };
  for (const field of additionalFields) {
    const raw = form.get(field.key);
    if (typeof raw !== 'string' || raw.trim().length > field.maxLength) return null;
    settings[field.key] = raw.trim();
  }
  const instagram = socialProfile(settings.instagram, 'instagram');
  const facebook = socialProfile(settings.facebook, 'facebook');
  const country = form.get('country');
  const markets = form.getAll('markets');
  if (instagram === null || facebook === null || typeof country !== 'string' ||
      (country && !allowedCountry(country)) || markets.length > countryCodes.length ||
      !markets.every(value => typeof value === 'string' && allowedCountry(value))) return null;

  const visibility = new Set(form.getAll('visible'));
  return {
    ...settings, instagram, facebook, country,
    markets: [...new Set(markets as string[])],
    remote: form.get('remote') === 'on',
    shareDetails: form.get('shareDetails') === 'on',
    directoryDetails: form.get('directoryDetails') === 'on',
    introductions: form.get('introductions') === 'on',
    visible: visitorFields.filter(field => visibility.has(field.key)).map(field => field.key),
  };
}

export function fppVisitorDetails(profile: ProfessionalProfile, settings: VisitorSettings, language: 'en' | 'pt') {
  const countryNames = new Intl.DisplayNames([language], { type: 'region' });
  const values = {
    ...profile, ...settings,
    country: settings.country ? countryNames.of(settings.country) : '',
    markets: settings.markets.map(code => countryNames.of(code)).join(', '),
    remote: settings.remote ? (language === 'pt' ? 'Disponível para projetos à distância' : 'Available for remote projects') : '',
    photo: '',
  };
  return visitorFields.filter(field => settings.visible.includes(field.key) && values[field.key])
    .map(field => ({ key: field.key, label: field[language], value: values[field.key] }));
}
