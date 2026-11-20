export const registrationPilotId = 'ddf546eb-e898-4bf6-90b3-9d737534dd77';

export function restaurantReferral(value: unknown): string | undefined {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value) ? value : undefined;
}

export function withRestaurantReferral(path: string, id?: string) {
  return id ? `${path}?restaurant=${encodeURIComponent(id)}` : path;
}
