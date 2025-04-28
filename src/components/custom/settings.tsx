'use client';

import { useSession } from '@/hooks/use-session';
import { Input } from '../ui/input';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import linkedin from '@/lib/linkedin/client';

export const Settings = ({ user }: { user: User }) => {
  const { session, deleteAccount, updateUserInfo } = useSession();

  const [displayName, setDisplayName] = useState<string | undefined>(
    user.user_metadata.full_name
  );
  const [companyName, setCompanyName] = useState<string | undefined>(
    user.user_metadata.company_name
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
                disabled={session.user.identities?.[0]?.provider === 'google'}
                // onChange={(e) => {

                // }}
                value={session.user.email as string | undefined}
                placeholder="Email"
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
                {/* <Button
                  disabled={
                    user.user_metadata.full_name === displayName?.trim() &&
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
                </Button> */}
              </div>
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company"
              />
            </div>
            {/* <div>
              <Button variant="outline" size="sm" onClick={async () => {
                const response = await fetch('/api/auth/linkedin');
                const data = await response.json();
                window.open(data.url, '_blank');
              }}>
                Link your LinkedIn profile  
              </Button>
            </div> */}
            <div className="flex justify-end">    
              <Button
                className="w-fit self-end"
                disabled={
                  user.user_metadata.full_name === displayName?.trim() &&
                  user.user_metadata.company_name === companyName?.trim()
                }
                onClick={(e) => {
                  e.preventDefault();
                  updateUserInfo(displayName!.trim(), companyName!.trim());
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Themes */}
        {/* <div className="flex justify-between items-center">
          <Label>Theme</Label>
          <ThemeToggle />
        </div> */}

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
