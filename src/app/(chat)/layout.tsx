import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SessionProvider } from '@/providers/sessionProvider';
import { loadSession } from '@/lib/firebase/session';
import { HistoryProvider } from '@/providers/historyProvider';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await loadSession();

  return (
    <SessionProvider initialSession={session}>
      <HistoryProvider>
        <SidebarProvider>
          <AppSidebar />

          <main className="flex h-screen w-full flex-col overflow-y-auto relative">
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
