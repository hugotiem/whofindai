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
import { Cog, LogIn, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Settings } from './settings';
import { StripePricingTableDialog } from './dialog/StripePricingTableDialog';
import { useEffect, useState } from 'react';
export const UserSidebarItem = () => {
  const { session, signOut } = useSession();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const getFallback = () => {
    const displayName = session?.user?.user_metadata?.full_name;
    if (!displayName || displayName.split(' ').length < 1) return '';
    const split = displayName.split(' ');
    const first = split[0];
    const second = split.length > 1 ? split[1] : '';
    return `${first[0]} ${second[0]}`;
  };

  useEffect(() => {
    if (searchParams.get('ntod') === 'pricing') {
      setOpen(true);
    }
    if (searchParams.get('ntod') === 'settings') {
      setOpenSettings(true);
    }
  }, [searchParams]);

  return session?.user ? (
    <>
      <StripePricingTableDialog
        open={open}
        setOpen={(value) => {
          setOpen(value);
          if (!value) {
            router.replace('/');
          }
        }}
      />
      <Dialog
        open={openSettings}
        onOpenChange={(value) => {
          setOpenSettings(value);
          if (!value) {
            router.replace('/');
          }
        }}
      >
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
            {!session.user.user_metadata.plan && (
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Cog className="mr-2 h-4 w-4" />
                <span>View Plans</span>
              </DropdownMenuItem>
            )}
            {session.user.user_metadata.plan && (
              <DropdownMenuItem
                onClick={() => router.push('/api/stripe/checkout')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <div className="flex justify-between w-full">
                  <span>Manage Plan </span>
                  <span className="text-xs font-bold text-[#7FFFD4]">
                    {session.user.user_metadata.plan.replaceAll('_', ' ')}
                  </span>
                </div>
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
