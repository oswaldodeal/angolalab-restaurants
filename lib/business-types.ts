// Brick 009A: discovery/registration research taxonomy.
// Categories other than restaurant are not yet accepting submissions.
export const BUSINESS_TYPES = [
  { id: 'restaurant', en: 'Restaurant', pt: 'Restaurante', focusEn: 'Meals and dining', focusPt: 'Refeições e restauração' },
  { id: 'cafe', en: 'Café', pt: 'Café', focusEn: 'Coffee, breakfast and snacks', focusPt: 'Café, pequeno-almoço e lanches' },
  { id: 'pub', en: 'Pub', pt: 'Pub', focusEn: 'Pub hospitality and food service', focusPt: 'Serviços de pub e restauração' },
  { id: 'bar', en: 'Bar', pt: 'Bar', focusEn: 'Bar hospitality', focusPt: 'Serviços de bar' },
  { id: 'takeaway', en: 'Takeaway', pt: 'Takeaway', focusEn: 'Food to take away', focusPt: 'Comida para levar' },
  { id: 'bakery', en: 'Bakery', pt: 'Padaria / Pastelaria', focusEn: 'Bread, cakes and pastries', focusPt: 'Pão, bolos e pastelaria' },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]['id'];

// Approved Brick 009A Basic-profile capacity. The existing restaurant
// editor remains unchanged; other business profiles are not active yet.
export const BASIC_PROFILE_LIMITS: Record<BusinessType, {
  featured: number;
  textOnly: number;
}> = {
  restaurant: { featured: 2, textOnly: 2 },
  cafe: { featured: 2, textOnly: 1 },
  pub: { featured: 2, textOnly: 0 },
  bar: { featured: 2, textOnly: 0 },
  takeaway: { featured: 2, textOnly: 1 },
  bakery: { featured: 2, textOnly: 1 },
};

export function basicProfileItemCount(type: BusinessType): number {
  const limits = BASIC_PROFILE_LIMITS[type];
  return limits.featured + limits.textOnly;
}
