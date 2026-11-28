import FppVisitorProfile from '@/components/FppVisitorProfile';

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FppVisitorProfile id={(await params).id} language="en" />;
}
