import RestaurantRegistration from '@/components/RestaurantRegistration';

export const dynamic = 'force-dynamic';

export default function SubmitRestaurantPage() {
  return <RestaurantRegistration language="en" available={Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN && (process.env.STAFF_REVIEW_PASSWORD?.length ?? 0) >= 16)} />;
}
