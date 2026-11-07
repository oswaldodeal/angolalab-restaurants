// Temporary demonstration photography for the restaurant discovery pilot.
// These are illustrative stock photos, NOT photos of the fictional restaurants.
// Replace only after the owner provides images and AngolaLab reviews them.
const images: Record<string, string> = {
  'rest-001': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
  'rest-002': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85',
  'rest-003': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
};
export function demoRestaurantPhoto(id: string): string | null {
  return images[id] ?? null;
}
