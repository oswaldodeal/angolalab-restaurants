export type Restaurant = {
  id: string;
  ownerId: string;

  // Basic info — visible immediately
  name: string;
  cuisine: string;
  city: string;
  neighbourhood: string;
  address: string;

  // Coordinates — added by admin
  lat: number | null;
  lng: number | null;

  // Full details — visible only when verified
  phone?: string;
  hours?: string;
  description?: string;
  menuPdf?: string;
  menuPhotos: string[];
  photos: string[];

  status: 'pending' | 'basic' | 'verified';
  submittedAt: string;
  verifiedAt?: string;

  isPremium: boolean;
};

export const CUISINES = [
  { id: 'angolan', pt: 'Angolana', en: 'Angolan' },
  { id: 'portuguese', pt: 'Portuguesa', en: 'Portuguese' },
  { id: 'seafood', pt: 'Marisco', en: 'Seafood' },
  { id: 'grill', pt: 'Churrascaria', en: 'Grill' },
  { id: 'pizzeria', pt: 'Pizzaria', en: 'Pizzeria' },
  { id: 'bakery', pt: 'Padaria & Pastelaria', en: 'Bakery & Pastries' },
  { id: 'international', pt: 'Internacional', en: 'International' },
  { id: 'other', pt: 'Outro', en: 'Other' },
];

export const CITIES = [
  { id: 'luanda', pt: 'Luanda', en: 'Luanda' },
  { id: 'benguela', pt: 'Benguela', en: 'Benguela' },
  { id: 'huambo', pt: 'Huambo', en: 'Huambo' },
  { id: 'lobito', pt: 'Lobito', en: 'Lobito' },
  { id: 'namibe', pt: 'Namibe', en: 'Namibe' },
  { id: 'bissau', pt: 'Bissau', en: 'Bissau' },
  { id: 'praia', pt: 'Praia', en: 'Praia' },
  { id: 'other', pt: 'Outra Cidade / Outro País', en: 'Other City / Country' },
];

// Helper: generate Google Maps link
export function getGoogleMapsUrl(restaurant: Restaurant): string {
  if (restaurant.lat && restaurant.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;
  }
  const encoded = encodeURIComponent(`${restaurant.name}, ${restaurant.address}, ${restaurant.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

// Sample data
export const initialRestaurants: Restaurant[] = [
  {
    id: 'rest-001',
    ownerId: 'demo',
    name: 'Restaurante Vulola',
    cuisine: 'angolan',
    city: 'luanda',
    neighbourhood: 'Viana',
    address: 'Bairro Bela Vista, Viana, Luanda',
    lat: -8.8167,
    lng: 13.2333,
    status: 'verified',
    submittedAt: '2026-10-20T10:00:00Z',
    verifiedAt: '2026-10-20T14:00:00Z',
    phone: '+244 935 200 452',
    hours: 'Segunda a Sábado: 08h00 – 22h00',
    description: 'Comida tradicional angolana. Funge, calulu, peixe grelhado fresco e muito mais. Ambiente familiar.',
    menuPhotos: [],
    photos: [],
    isPremium: false,
  },
  {
    id: 'rest-002',
    ownerId: 'demo',
    name: 'Sabores de Luanda',
    cuisine: 'international',
    city: 'luanda',
    neighbourhood: 'Ingombota',
    address: 'Rua de São Tomé, Ingombota, Luanda',
    lat: null,
    lng: null,
    status: 'basic',
    submittedAt: '2026-10-20T15:00:00Z',
    menuPhotos: [],
    photos: [],
    isPremium: false,
  },
];
