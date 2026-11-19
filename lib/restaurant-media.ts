import 'server-only';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { readMenuPhotos, type Restaurant } from '@/lib/store';

export async function readRestaurantMedia(id?: string) {
  try {
    return sqlRows(await executePrivateSql(`SELECT m.id,m.cover_photo_url,m.menu_photo_url FROM restaurant_profile_media m JOIN restaurant_listings l ON l.id=m.id ${id ? 'WHERE m.id=?' : ''}`,id?[id]:[]));
  } catch(error) {
    if(error instanceof Error && error.message==='TURSO_MEDIA_NOT_MIGRATED') return [];
    throw error;
  }
}

export function withRestaurantMedia(restaurant: Restaurant, media?: Record<string,string|null>): Restaurant {
  if(!media) return restaurant;
  const photos=readMenuPhotos(media.menu_photo_url,media.cover_photo_url);
  return {...restaurant,photos:media.cover_photo_url?[media.cover_photo_url]:[],menuPhotos:photos.slice(0,restaurant.status==='verified'?6:2)};
}
