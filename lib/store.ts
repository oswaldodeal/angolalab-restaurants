export type Restaurant = {
  id: string;
  ownerId: string;

  // Basic info — visible immediately
  name: string;
  cuisine: string;
  country: string
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

 // Independent business verification
status: 'pending' | 'basic' | 'verified';
submittedAt: string;
verifiedAt?: string;

// Website profile plan
profilePlan?: 'basic' | 'verified' | 'pro';

// Legacy field — retained during migration
isPremium: boolean;
};

export const COUNTRIES = [
  { id: 'AO', pt: 'Angola', en: 'Angola' },
  { id: 'PT', pt: 'Portugal', en: 'Portugal' },
  { id: 'GB', pt: 'Inglaterra (Reino Unido)', en: 'England (United Kingdom)' },
];

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
  // Angola
  { id: 'luanda', country: 'AO', pt: 'Luanda', en: 'Luanda' },
  { id: 'benguela', country: 'AO', pt: 'Benguela', en: 'Benguela' },
  { id: 'huambo', country: 'AO', pt: 'Huambo', en: 'Huambo' },
  { id: 'lobito', country: 'AO', pt: 'Lobito', en: 'Lobito' },
  { id: 'namibe', country: 'AO', pt: 'Namibe', en: 'Namibe' },

  // Portugal
  { id: 'lisboa', country: 'PT', pt: 'Lisboa', en: 'Lisbon' },
  { id: 'porto', country: 'PT', pt: 'Porto', en: 'Porto' },
  { id: 'coimbra', country: 'PT', pt: 'Coimbra', en: 'Coimbra' },
  { id: 'faro', country: 'PT', pt: 'Faro', en: 'Faro' },

  // England, United Kingdom — initial city coverage for the UK pilot
  { id: 'manchester', country: 'GB', pt: 'Manchester', en: 'Manchester' },
  { id: 'oldham', country: 'GB', pt: 'Oldham', en: 'Oldham' },
  { id: 'london', country: 'GB', pt: 'Londres', en: 'London' },
  { id: 'birmingham', country: 'GB', pt: 'Birmingham', en: 'Birmingham' },
  { id: 'liverpool', country: 'GB', pt: 'Liverpool', en: 'Liverpool' },
];

// Helper: generate Google Maps link
export function getGoogleMapsUrl(restaurant: Restaurant): string {
  if (restaurant.lat !== null && restaurant.lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;
  }

  const country = COUNTRIES.find(
    (item) => item.id === restaurant.country
  );

  const location = [
    restaurant.name,
    restaurant.address,
    restaurant.city,
    country?.en ?? restaurant.country,
  ].join(', ');

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

// Sample data
export const initialRestaurants: Restaurant[] = [
  {
    id: 'rest-001',
    ownerId: 'demo',
    name: 'Restaurante Vulola',
    cuisine: 'angolan',
    country: 'AO',
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
    // Fictional Manchester pilot listing — no real business identity or verification implied.
    id: 'rest-003',
    ownerId: 'demo',
    name: 'Sabores de Manchester (Demo)',
    cuisine: 'portuguese',
    country: 'GB',
    city: 'manchester',
    neighbourhood: 'Manchester',
    address: '',
    lat: null,
    lng: null,
    status: 'basic',
    submittedAt: '2026-10-26T00:00:00Z',
    menuPhotos: [],
    photos: [],
    isPremium: false,
  },
  {
    id: 'rest-002',
    ownerId: 'demo',
    name: 'Sabores de Luanda',
    cuisine: 'international',
    country: 'AO',
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
