import RestaurantRegistration from '@/components/RestaurantRegistration';

export const dynamic = 'force-dynamic';

export default function RegisterRestaurantPage() {
  return <RestaurantRegistration language="pt" available={Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN && (process.env.STAFF_REVIEW_PASSWORD?.length ?? 0) >= 16)} />;
}
