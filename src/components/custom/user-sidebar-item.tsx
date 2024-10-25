'use client';

import { useSession } from '@/hooks/use-session';
import { SidebarMenuButton } from '../ui/sidebar';
import Image from 'next/image';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '../ui/alert-dialog';

export const UserSidebarItem = () => {
  const { session } = useSession();

  const getFallback = () => {
    const displayName = session?.user.displayName;
    if (!displayName || displayName.split(' ').length < 1) return '';
    const split = displayName.split(' ');
    const first = split[0];
    const second = split.length > 1 ? split[1] : '';
    return `${first[0]} ${second[0]}`;
  };

  return (
    session && (
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-fit flex">
              {session.user.photoURL && (
                <Avatar>
                  <AvatarImage
                    src={session.user.photoURL}
                    alt={`${session?.user.displayName}'s avatar`}
                  />
                  <AvatarFallback>{getFallback()}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {session.user.displayName && (
                  <div className="font-semibold">
                    {' '}
                    {session.user.displayName}{' '}
                  </div>
                )}
                {session.user.email && (
                  <div className="text-xs font-bold">
                    {' '}
                    {session.user.email}{' '}
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent></AlertDialogContent>
      </AlertDialog>
    )
  );
};
