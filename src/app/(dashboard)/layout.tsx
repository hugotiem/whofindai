import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SessionProvider } from '@/providers/sessionProvider';
import { HistoryProvider } from '@/providers/historyProvider';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CompleteProfileDialog from '@/components/custom/dialog/CompleteProfileDialog';
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = await createClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user || user === null) {
    return redirect('/auth/signIn');
  }

  let currentUser = user;

  const completed: boolean =
    user?.user_metadata?.full_name !== undefined &&
    user?.user_metadata?.company_name !== undefined &&
    user?.user_metadata?.full_name !== '' &&
    user?.user_metadata?.company_name !== '';

  const userData = await prisma.user.findUnique({
    where: { id: user?.id }
  });

  if (userData?.plan && userData?.plan !== user?.user_metadata?.plan) {
    const updatedUser = await client.auth.updateUser({
      data: { plan: userData?.plan }
    });
    currentUser = updatedUser?.data?.user || user;
  }

  if (userData?.useExtension === false) {
    return redirect('/install-extension');
  }

  return (
    <SessionProvider initialSession={{ user: currentUser || undefined }}>
      <HistoryProvider>
        <SidebarProvider>
          <AppSidebar session={{ user: currentUser || undefined }} />
          <main className="flex h-dvh w-full flex-col relative">
            <div className="sticky top-3 ml-3 z-50">
              <SidebarTrigger />
            </div>
            {children}
            {!completed && <CompleteProfileDialog user={user} />}
          </main>
        </SidebarProvider>
      </HistoryProvider>
    </SessionProvider>
  );
}
