'use client';

import { logout } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/client';
import { signInWithCustomToken, updateProfile, User } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

interface SessionProviderContextType {
  session: { user: User | undefined } | undefined;
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
  initialSession?: string;
}) => {
  const [session, setSession] = useState<{ user: User | undefined }>({
    user: auth.currentUser || undefined
  });

  const pathname = usePathname();

  const signOut = async () => {
    logout().then(() => (window.location.href = '/api/auth/logout'));
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await user.delete();
    await signOut();
  };

  const updateDisplayName = async (displayName: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateProfile(user, { displayName });
    await user.reload();
    setSession({ user });
  };

  useEffect(() => {
    if (initialSession) {
      signInWithCustomToken(auth, initialSession).then((credentials) => {
        setSession({ user: credentials.user });
      });
    } else {
      localStorage.removeItem('app.winanycall.com/prompt');
      // window.location.href = `/auth/signIn${pathname && `?redirect_path=${pathname}`}`;
    }
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
