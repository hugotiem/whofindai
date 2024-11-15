// import { CoreMessage } from "ai";
// import { notFound } from "next/navigation";

// import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from '@/components/custom/chat';
import { ChatSkeleton } from '@/components/custom/chat-skeletion';
import { getProfileById } from '@/lib/firebase/actions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
// import { getChatById } from "@/db/queries";
// import { Chat } from "@/db/schema";
// import { convertToUIMessages, generateUUID } from "@/lib/utils";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const profile = await getProfileById(id);

  // if (!profile) redirect('/');

  // // type casting
  // const chat: Chat = {
  //   ...chatFromDb,
  //   messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  // };

  // const session = await auth();

  // if (!session || !session.user) {
  //   return notFound();
  // }

  // if (session.user.id !== chat.userId) {
  //   return notFound();
  // }
  // return the chat component or the loading component
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
