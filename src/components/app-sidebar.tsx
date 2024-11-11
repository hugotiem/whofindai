import { CirclePlus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { UserSidebarItem } from './custom/user-sidebar-item';
import { HistorySidebarItem } from './custom/history-sidebar-item';
import { Suspense } from 'react';
import Link from 'next/link';
import { HistorySkeleton } from './custom/history-skeleton';

const items = [
  {
    title: 'New profile',
    url: '/',
    icon: CirclePlus
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div>Winanycall.com</div>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
              ))}
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
