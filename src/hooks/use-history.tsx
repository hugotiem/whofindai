import { HistoryProviderContext } from '@/providers/historyProvider';
import { useContext } from 'react';

export const useHistory = () => {
  const context = useContext(HistoryProviderContext);
  if (!context)
    throw new Error('useProgressBar must be used within a HistoryProvider');
  // if (initialHistory) context.init(initialHistory);
  return context;
};
