'use client';

import { useSession } from '@/hooks/use-session';
import { SidebarMenuButton } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Cog, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Settings } from './settings';

export const UserSidebarItem = () => {
  const { session, signOut } = useSession();
  const pathname = usePathname();

  const getFallback = () => {
    const displayName = session?.user?.displayName;
    if (!displayName || displayName.split(' ').length < 1) return '';
    const split = displayName.split(' ');
    const first = split[0];
    const second = split.length > 1 ? split[1] : '';
    return `${first[0]} ${second[0]}`;
  };

  return session?.user ? (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="h-fit flex">
            {session.user?.photoURL && (
              <Avatar>
                <AvatarImage
                  src={session.user.photoURL}
                  alt={`${session?.user.displayName}'s avatar`}
                />
                <AvatarFallback>{getFallback()}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {session.user?.displayName && (
                <div className="font-semibold">
                  {' '}
                  {session.user.displayName}{' '}
                </div>
              )}
              {session.user?.email && (
                <div className="text-xs font-bold"> {session.user.email} </div>
              )}
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Cog className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <Settings />
      </DialogContent>
    </Dialog>
  ) : (
    <SidebarMenuButton className="h-fit">
      <Link
        href={`/auth/signIn?redirect_path=${pathname}`}
        className="flex items-center gap-4 w-full"
      >
        <LogIn className="h-5 w-5" />
        <span>Log in</span>
      </Link>
    </SidebarMenuButton>
  );
};
