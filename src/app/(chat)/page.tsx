import { Chat } from '@/components/custom/chat';
import CongratulationDialog from '@/components/custom/dialog/CongratulationDialog';
import { generateUUID } from '@/lib/utils';

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const id = generateUUID();
  const params = await searchParams;
  const subscribed = params['subscribed'];
  const plan = params['plan'];

  const isSubscribed = subscribed === 'true';

  return (
    <>
      {isSubscribed && plan && (
        <CongratulationDialog initialOpen={true} plan={plan as string} />
      )}
      <Chat /*key={id}*/ id={id} showLoginButton={false} />
    </>
  );
}
