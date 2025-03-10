'use client';

import { SessionProviderContext } from '@/providers/sessionProvider';
import { useContext } from 'react';

export const useSession = () => {
  const context = useContext(SessionProviderContext);
  if (!context)
    throw new Error('useSession must be used within a SessionProvider');
  return context;
};
