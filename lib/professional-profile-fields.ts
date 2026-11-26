export const professionalProfileFields = [
  { key: 'displayName', en: 'Display name', pt: 'Nome de apresentação', maxLength: 80, required: true },
  { key: 'profession', en: 'Profession or area of study', pt: 'Profissão ou área de estudo', maxLength: 120 },
  { key: 'skills', en: 'Skills', pt: 'Competências', maxLength: 240 },
  { key: 'languages', en: 'Languages', pt: 'Idiomas', maxLength: 120 },
  { key: 'projects', en: 'Projects and interests', pt: 'Projetos e interesses', maxLength: 500, multiline: true },
] as const;

type ProfileField = typeof professionalProfileFields[number]['key'];
export type ProfessionalProfile = Record<ProfileField, string>;
export type ProfessionalProfileResult = 'saved' | 'invalid' | 'blocked' | 'unavailable';
