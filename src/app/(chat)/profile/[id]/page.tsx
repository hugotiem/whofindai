import { Chat as PreviewChat } from '@/components/custom/chat';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id }
  });
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
      // profile={{
      //   id: profile!.id,
      //   userId: profile!.userId,
      //   created_at: profile!.created_at,
      //   updated_at: profile!.updated_at,
      //   full_name: profile!.full_name,
      //   company: profile!.company,
      //   contact_details: profile!.contact_details,
      //   ice_breakers: profile!.ice_breakers,
      //   professional_overview: profile!.professional_overview,
      //   company_overview: profile!.company_overview,
      //   engagement_insights: profile!.engagement_insights,
      //   education: profile!.education,
      //   personality_and_interests: profile!.personality_and_interests,
      //   country: profile!.country,
      //   city: profile!.city,
      //   industry: profile!.industry,
      //   prompt: profile!.prompt,
      //   role: profile!.role,
      //   citations: profile!.citations
      //   // seo_title: profile!.seo_title,
      //   // seo_description: profile!.seo_description,
      //   // seo_keywords: profile!.seo_keywords
      // }}
      // lang: profile?.lang
      // initialCompletion={profile && profile.content}
      id={id}
      from_storage={from_storage}
      showLoginButton
    />
  );
};

