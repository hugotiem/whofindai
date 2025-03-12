import { Chat as PreviewChat } from '@/components/custom/chat';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProfileResponseSchema } from '@/lib/prompts/profile';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id }
  });
  return { title: `${profile?.fullName} - Leedinsight` };
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const { id } = await params;

  const from_storage = (await searchParams)['from_storage'] === 'true';

  return <ChatPage id={id} from_storage={from_storage} />;
}

const ChatPage = async ({
  id,
  from_storage
}: {
  id: string;
  from_storage: boolean;
}) => {
  const profile = await prisma.profile.findUnique({
    where: { id }
  });

  if (!profile && !from_storage) redirect('/');

  return (
    <PreviewChat
      profile={
        profile
          ? {
              ...profile,
              profileData: profile.profileData as unknown as ProfileResponseSchema
            }
          : undefined
      }
      // lang: profile?.lang
      // initialCompletion={profile && profile.content}
      id={id}
      from_storage={false}
    />
  );
};
