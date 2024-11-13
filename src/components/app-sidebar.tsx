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
import AppIcon from './custom/icons/app-icon';

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
        <Link href={'/'} className='w-fit p-4'>
          <AppIcon />
        </Link>
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
