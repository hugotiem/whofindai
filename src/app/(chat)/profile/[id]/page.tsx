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
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatPage id={id} />
    </Suspense>
  );
}

const ChatPage = async ({ id }: { id: string }) => {
  
  const profile = await getProfileById(id);

  if (!profile) redirect('/');
  return (
    <PreviewChat
      profile={{
        fullName: profile?.fullName,
        company: profile?.company,
        prompt: profile?.prompt,
        userId: profile?.userId
      }}
      initialCompletion={profile.content}
      id={id}
      showLoginButton
    />
  );
};
