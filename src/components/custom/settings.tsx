'use client';

import { useSession } from '@/hooks/use-session';
import { Input } from '../ui/input';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { ThemeToggle } from './theme-toggle';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useState } from 'react';

export const Settings = () => {
  const { session, deleteAccount, updateDisplayName } = useSession();

  const [displayName, setDisplayName] = useState(
    session?.user?.displayName || undefined
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col justify-center gap-4">
        {/* user information */}
        {session?.user && (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                disabled={
                  session.user.providerData[0].providerId === 'google.com'
                }
                // onChange={(e) => {

                // }}
                value={session.user.email as string | undefined}
                placeholder="Name Surname"
              />
            </div>
            <div>
              <Label>Name</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Name Surname"
                />
                <Button
                  disabled={
                    session.user.displayName === displayName?.trim() &&
                    displayName !== undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    updateDisplayName(displayName!.trim());
                  }}
                  type="submit"
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Themes */}
        <div className="flex justify-between items-center">
          <Label>Theme</Label>
          <ThemeToggle />
        </div>

        {/* app info */}
        <div></div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            deleteAccount();
          }}
          variant="ghost"
          className="hover:bg-destructive/90 text-destructive hover:text-destructive-foreground"
        >
          Delete Account
        </Button>
      </div>
    </>
  );
};
