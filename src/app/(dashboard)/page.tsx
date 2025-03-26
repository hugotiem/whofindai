import CongratulationDialog from '@/components/custom/dialog/CongratulationDialog';
import { Dashboard } from './dashboard';

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const subscribed = params['subscribed'];
  const plan = params['plan'];

  const isSubscribed = subscribed === 'true';

  return (
    <>
      {isSubscribed && plan && (
        <CongratulationDialog initialOpen={true} plan={plan as string} />
      )}
      <Dashboard />
    </>
  );
}
