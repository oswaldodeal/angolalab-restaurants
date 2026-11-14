import PilotAccountPage from '@/components/PilotAccountPage';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <PilotAccountPage language="pt" mode="account" />;
}
