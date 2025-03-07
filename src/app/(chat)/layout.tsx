import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SessionProvider } from '@/providers/sessionProvider';
import { HistoryProvider } from '@/providers/historyProvider';
import { createClient } from '@/lib/supabase/server';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = await createClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  return (
    <SessionProvider initialSession={{ user: user || undefined }}>
      <HistoryProvider>
        <SidebarProvider>
          <AppSidebar session={{ user: user || undefined }} />
          <main className="flex h-dvh w-full flex-col relative">
            <div className="sticky top-3 ml-3 z-50">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </HistoryProvider>
    </SessionProvider>
  );
}
