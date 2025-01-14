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
  return { title: `${profile?.fullName} - Winanycall` };
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

  console.log('profile', profile);

  if (!profile && !from_storage) redirect('/');

  return (
    <PreviewChat
      profile={{
        id: profile!.id,
        userId: profile!.userId,
        created_at: profile!.created_at,
        updated_at: profile!.updated_at,
        fullName: profile!.fullName,
        company: profile!.company,
        role: profile!.role,
        missions: profile!.missions,
        background: profile!.background,
        education: profile!.education,
        company_description: profile!.company_description,
        personality_traits: profile!.personality_traits,
        communication_insights: profile!.communication_insights,
        country: profile!.country,
        city: profile!.city,
        industry: profile!.industry,
        seo_title: profile!.seo_title,
        seo_description: profile!.seo_description,
        seo_keywords: profile!.seo_keywords
      }}
      // lang: profile?.lang
      // initialCompletion={profile && profile.content}
      id={id}
      from_storage={from_storage}
      showLoginButton
    />
  );
};
