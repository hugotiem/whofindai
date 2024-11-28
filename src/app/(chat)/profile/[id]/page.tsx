// import { CoreMessage } from "ai";
// import { notFound } from "next/navigation";

// import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from '@/components/custom/chat';
import { ChatSkeleton } from '@/components/custom/chat-skeletion';
import { getProfileById } from '@/lib/firebase/actions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);
  return { title: `${profile?.fullName} - WinAnyCall` };
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

  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatPage id={id} from_storage={from_storage} />
    </Suspense>
  );
}

const ChatPage = async ({
  id,
  from_storage
}: {
  id: string;
  from_storage: boolean;
}) => {
  const profile = await getProfileById(id);

  if (!profile && !from_storage) redirect('/');

  return (
    <PreviewChat
      profile={
        profile && {
          fullName: profile?.fullName,
          company: profile?.company,
          prompt: profile?.prompt,
          userId: profile?.userId,
          lang: profile?.lang
        }
      }
      initialCompletion={profile && profile.content}
      id={id}
      from_storage={from_storage}
      showLoginButton
    />
  );
};
