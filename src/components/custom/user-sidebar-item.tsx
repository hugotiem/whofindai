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
import { StripePricingTableDialog } from './dialog/StripePricingTableDialog';
import { useState } from 'react';
export const UserSidebarItem = () => {
  const { session, signOut } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getFallback = () => {
    const displayName = session?.user?.user_metadata?.full_name;
    if (!displayName || displayName.split(' ').length < 1) return '';
    const split = displayName.split(' ');
    const first = split[0];
    const second = split.length > 1 ? split[1] : '';
    return `${first[0]} ${second[0]}`;
  };

  return session?.user ? (
    <>
      <StripePricingTableDialog open={open} setOpen={setOpen} />
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-fit flex">
              {session.user?.user_metadata?.avatar_url && (
                <Avatar>
                  <AvatarImage
                    src={session.user.user_metadata.avatar_url}
                    alt={`${session?.user.user_metadata.full_name}'s avatar`}
                  />
                  <AvatarFallback>{getFallback()}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {session.user?.user_metadata?.full_name && (
                  <div className="font-semibold">
                    {session.user.user_metadata.full_name}
                  </div>
                )}
                {session.user?.email && (
                  <div className="text-xs font-bold">{session.user.email}</div>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            {!session.plan && (
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Cog className="mr-2 h-4 w-4" />
                <span>View Plans</span>
              </DropdownMenuItem>
            )}
            {session.plan && (
              <DropdownMenuItem>
                <span>Current Plan: {session.plan}</span>
              </DropdownMenuItem>
            )}
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
          <Settings user={session.user} />
        </DialogContent>
      </Dialog>
    </>
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
