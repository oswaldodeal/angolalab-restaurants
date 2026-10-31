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

 
// Brick 010B: bilingual illustrative labels for research-only Basic previews.
// No real products, pricing, inventory, alcohol promotion or business claims.
export const BASIC_PROFILE_EXAMPLES: Record<BusinessType, {
  en: { featured: readonly string[]; textOnly: readonly string[] };
  pt: { featured: readonly string[]; textOnly: readonly string[] };
}> = {
  restaurant: {
    en: { featured: ['House main dish', 'Vegetarian dish'], textOnly: ['Soup of the day', 'Seasonal dessert'] },
    pt: { featured: ['Prato principal da casa', 'Prato vegetariano'], textOnly: ['Sopa do dia', 'Sobremesa da época'] },
  },
  cafe: {
    en: { featured: ['Coffee speciality', 'Breakfast pastry'], textOnly: ['Fresh sandwich'] },
    pt: { featured: ['Especialidade de café', 'Pastel de pequeno-almoço'], textOnly: ['Sandes fresca'] },
  },
  pub: {
    en: { featured: ['Pub lunch', 'Vegetarian pub meal'], textOnly: [] },
    pt: { featured: ['Almoço de pub', 'Refeição vegetariana'], textOnly: [] },
  },
  bar: {
    en: { featured: ['Non-alcoholic house drink', 'Sharing snack'], textOnly: [] },
    pt: { featured: ['Bebida da casa sem álcool', 'Petisco para partilhar'], textOnly: [] },
  },
  takeaway: {
    en: { featured: ['Takeaway main meal', 'Vegetarian takeaway'], textOnly: ['Side dish'] },
    pt: { featured: ['Refeição principal para levar', 'Refeição vegetariana para levar'], textOnly: ['Acompanhamento'] },
  },
  bakery: {
    en: { featured: ['Fresh bread', 'House pastry'], textOnly: ['Daily baked speciality'] },
    pt: { featured: ['Pão fresco', 'Pastel da casa'], textOnly: ['Especialidade do dia'] },
  },
};
