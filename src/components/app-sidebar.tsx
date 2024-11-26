import { CirclePlus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { UserSidebarItem } from './custom/user-sidebar-item';
import { HistorySidebarItem } from './custom/history-sidebar-item';
import { Suspense } from 'react';
import Link from 'next/link';
import { HistorySkeleton } from './custom/history-skeleton';
import AppIcon from './custom/icons/app-icon';

const items = [
  {
    title: 'New profile',
    url: '/',
    icon: CirclePlus
  }
];

export function AppSidebar({ session }: { session: string | undefined }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="sticky top-0 z-50 bg-sidebar py-4">
            <Link href={'/'}>
              <AppIcon />
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
                    <SidebarMenuButton asChild>
                      <Link
                        href={{
                          pathname: item.url,
                          query: { init: true }
                        }}
                        as={item.url}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
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
