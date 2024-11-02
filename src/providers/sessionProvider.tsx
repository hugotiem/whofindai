'use client';

import { logout } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/client';
import { signInWithCustomToken, User } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

interface SessionProviderContextType {
  session: { user: User } | undefined;
  signOut?: () => Promise<void>;
}

export const SessionProviderContext = createContext<
  SessionProviderContextType | undefined
>(undefined);

export const SessionProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session?: string;
}) => {
  const [user, setUser] = useState<User | undefined>(
    auth.currentUser || undefined
  );

  const pathname = usePathname();

  const signOut = async () => {
    logout().then(() => (window.location.href = '/api/auth/logout'));
  };

  useEffect(() => {
    if (session) {
      signInWithCustomToken(auth, session).then((credentials) => {
        setUser(credentials.user);
      });
    } else {
      // window.location.href = `/auth/signIn${pathname && `?redirect_path=${pathname}`}`;
    }
  }, [session, pathname]);

  return (
    <SessionProviderContext.Provider
      value={{ session: user && { user }, signOut }}
    >
      {children}
    </SessionProviderContext.Provider>
  );
};
