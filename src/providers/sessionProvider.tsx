'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SessionProviderContextType {
  session: { user: User | undefined; plan?: string } | undefined;
  signOut?: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
}

export const SessionProviderContext = createContext<
  SessionProviderContextType | undefined
>(undefined);

export const SessionProvider = ({
  children,
  initialSession
}: {
  children: React.ReactNode;
  initialSession?: { user: User | undefined; plan?: string };
}) => {
  const [session, setSession] = useState<
    { user: User | undefined; plan?: string } | undefined
  >(initialSession);

  const pathname = usePathname();

  const signOut = async () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        toast.success('Signed out');
        window.location.reload();
      });
    });
  };

  const deleteAccount = async () => {
    fetch('/api/auth', { method: 'DELETE' }).then(() => {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        toast.success('Account deleted');
        window.location.reload();
      });
    });
  };

  const updateDisplayName = async (displayName: string) => {
    const supabase = createClient();
    supabase.auth
      .updateUser({
        data: {
          full_name: displayName
        }
      })
      .then(({ error }) => {
        if (error) {
          toast.error('Error updating display name');
        } else {
          toast.success('Display name updated');
        }
      });
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        console.log('USER_UPDATED', session);
        setSession({
          user: session?.user,
          plan: session?.user.user_metadata.plan
        });
      }
    });
  }, [initialSession, pathname]);

  return (
    <SessionProviderContext.Provider
      value={{
        session,
        signOut,
        deleteAccount,
        updateDisplayName
      }}
    >
      {children}
    </SessionProviderContext.Provider>
  );
};
