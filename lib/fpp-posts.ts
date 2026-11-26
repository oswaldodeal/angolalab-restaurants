export const fppPostTypes = {
  idea: { en: 'Business idea', pt: 'Ideia de negócio' },
  question: { en: 'Question', pt: 'Pergunta' },
  project: { en: 'Project', pt: 'Projeto' },
} as const;

export type FppPostType = keyof typeof fppPostTypes;

export const fppPostStatusLabels = {
  pending: { en: 'Awaiting review', pt: 'A aguardar análise' },
  published: { en: 'Published', pt: 'Publicado' },
  declined: { en: 'Declined', pt: 'Recusado' },
  removed: { en: 'Removed', pt: 'Removido' },
} as const;

export type FppPostStatus = keyof typeof fppPostStatusLabels;

export function isFppPostType(value: unknown): value is FppPostType {
  return typeof value === 'string' && Object.hasOwn(fppPostTypes, value);
}
