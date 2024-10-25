import { SessionProviderContext } from '@/providers/sessionProvider';
import { useContext } from 'react';

export const useSession = () => {
  const context = useContext(SessionProviderContext);
  if (!context)
    throw new Error('useProgressBar must be used within a ProgressBarProvider');
  return context;
};
