'use client';

import { HistoryProviderContext } from '@/providers/historyProvider';
import { useContext } from 'react';

export const useHistory = () => {
  const context = useContext(HistoryProviderContext);
  if (!context)
    throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};
