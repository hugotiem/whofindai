import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';

export const HistorySkeleton = () => {
  const items = ['', '', '', '', '', ''];

  return (
    <SidebarMenu>
      {items.map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton asChild className="h-fit pl-4">
            <div className="flex flex-col">
              <Skeleton className="w-3/4 h-[12px] rounded-full self-start" />
              <Skeleton className="w-1/2 h-[10px] rounded-full self-start" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
