'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar';
import { Ellipsis, Share, Trash2 } from 'lucide-react';
import { useShare } from '@/hooks/use-share';
import { useHistory } from '@/hooks/use-history';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HistoryItemProps {
  fullName: string;
  company: string;
  id: string;
}

export const HistoryItem = ({ fullName, company, id }: HistoryItemProps) => {
  const { deleteHistory } = useHistory();
  const { copyLink } = useShare();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="h-fit pl-4" asChild>
        <Link
          href={`/profile/${id}`}
          className={cn(
            'w-full text-ellipsis flex justify-between items-center',
            pathname === `/profile/${id}` ? 'bg-secondary' : ''
          )}
        >
          <div>
            <div className="font-bold">{fullName}</div>
            <div className="text-xs opacity-80">{company}</div>
          </div>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover className="bottom-0">
                <Ellipsis className="h-4 w-4" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {id && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      copyLink({ path: `/profile/${id}` });
                    }}
                  >
                    <Share className="h-4 w-4 mr-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      deleteHistory(id);
                      if (pathname.includes(id)) {
                        router.replace('/');
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
