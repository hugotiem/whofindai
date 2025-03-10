import { CirclePlus, Edit } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { UserSidebarItem } from './custom/user-sidebar-item';
import { HistorySidebarItem } from './custom/history-sidebar-item';
import { Suspense } from 'react';
import Link from 'next/link';
import { HistorySkeleton } from './custom/history-skeleton';
import { User } from '@supabase/supabase-js';

export function AppSidebar({
  session
}: {
  session: { user: User | undefined };
}) {
  const items = [
    {
      title: 'New profile',
      url: '/prompt',
      icon: CirclePlus
    },
    ...(session?.user?.email &&
    ['edouard@tiemh.com', 'hugotiem@gmail.com'].includes(session.user.email)
      ? [
          {
            title: 'Edit prompt',
            url: '/prompt',
            icon: Edit
          }
        ]
      : [])
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="sticky top-0 z-50 bg-sidebar">
          <div className="z-50 bg-sidebar py-4 px-2">
            <Link href={'/'}>
            {/* add app green color */}
              <h1 className="text-2xl font-bold text-[#7FFFD4]">Leedinsight</h1>
              {/* <AppIcon /> */}
            </Link>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {session ? (
                items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={{
                        pathname: item.url,
                        query: { init: true }
                      }}
                      as={item.url}
                      className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                ))
              ) : (
                <UserSidebarItem />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<HistorySkeleton />}>
              <HistorySidebarItem />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserSidebarItem />
      </SidebarFooter>
    </Sidebar>
  );
}
