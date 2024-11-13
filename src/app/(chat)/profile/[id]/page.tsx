// import { CoreMessage } from "ai";
// import { notFound } from "next/navigation";

// import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from '@/components/custom/chat';
import { getProfileById } from '@/lib/firebase/actions';
import { redirect } from 'next/navigation';
// import { getChatById } from "@/db/queries";
// import { Chat } from "@/db/schema";
// import { convertToUIMessages, generateUUID } from "@/lib/utils";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    redirect('/');
  }

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

  return (
    <PreviewChat
      /*id={chat.id}*/ initialCompletion={profile.content}
      id={id}
      showLoginButton
    />
  );
}
