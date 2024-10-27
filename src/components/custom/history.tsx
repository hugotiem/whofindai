'use client';

import { Profile } from '@/lib/definitions';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import Link from 'next/link';
import { useHistory } from '@/hooks/use-history';
import { useEffect, useState } from 'react';
import { Ellipsis, Share, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useShare } from '@/hooks/use-share';

interface HistoryProps {
  initialHistory: Profile[];
}

export const History = ({ initialHistory }: HistoryProps) => {
  const { init, history, deleteHistory } = useHistory();
  const [hoveredItem, setHoveredItem] = useState<string>();
  const { copyLink } = useShare();

  useEffect(() => {
    init(initialHistory);
  }, [initialHistory, init]);

  return (
    history.length > 0 && (
      <SidebarMenu>
        {history.map((profile) => (
          <DropdownMenu key={profile.id}>
            <SidebarMenuItem
              key={profile.id}
              onMouseEnter={() => setHoveredItem(profile.id)}
              onMouseLeave={() => setHoveredItem(undefined)}
            >
              <SidebarMenuButton className="h-fit pl-4">
                <Link
                  href={`/profile/${profile.id}`}
                  className="w-full text-ellipsis flex justify-between"
                >
                  <div>
                    <div className="font-bold">{profile.fullName}</div>
                    <div className="text-xs opacity-80">{profile.company}</div>
                  </div>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        hoveredItem === profile.id ? 'block' : 'hidden'
                      }
                    >
                      <Ellipsis className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <DropdownMenuContent>
              {profile.id && (
                <>
                  <DropdownMenuItem
                    onClick={() => copyLink({ path: `/profile/${profile.id}` })}
                  >
                    <Share className="h-4 w-4 mr-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteHistory(profile.id!)}>
                    <Trash2 className="h-4 w-4 mr-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </SidebarMenu>
    )
  );
};
