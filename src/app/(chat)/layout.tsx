import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SessionProvider } from '@/providers/sessionProvider';
import { loadSession } from '@/lib/firebase/session';
import { redirect } from 'next/navigation';
import { HistoryProvider } from '@/providers/historyProvider';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await loadSession();

  if (!session) return redirect('/auth/signIn');

  return (
    <SessionProvider session={session}>
      <HistoryProvider>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </HistoryProvider>
    </SessionProvider>
  );
}
