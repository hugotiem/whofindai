'use client';

import { HistoryItem } from '@/lib/definitions';
import { createContext, useState } from 'react';

interface HistoryProviderContextType {
  updateHistory: (profile: HistoryItem) => void;
  deleteHistory: (id: string) => void;
  init: (profiles: HistoryItem[]) => void;
  history: HistoryItem[];
}

export const HistoryProviderContext = createContext<
  HistoryProviderContextType | undefined
>(undefined);

export const HistoryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const updateHistory = (profile: HistoryItem) => {
    if (history.find((e) => e.id === profile.id)) {
      setHistory((prev) => [
        profile,
        ...prev.filter((e) => e.id !== profile.id)
      ]);
    } else {
      setHistory((prev) => [profile, ...prev]);
    }
  };

  const init = (profiles: HistoryItem[]) => {
    if (history.length === 0) {
      setHistory(profiles);
    }
  };

  const deleteHistory = (id: string) => {
    // TODO: delete history from supabase
    fetch('/api/history', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }).then(() => {
      setHistory((prev) => prev.filter((e) => e.id !== id));
    });
    // const docRef = doc(db, 'profiles/', id);
    // deleteDoc(docRef).then(() => {
    //   setHistory((prev) => prev.filter((e) => e.id !== id));
    // });
  };

  return (
    <HistoryProviderContext.Provider
      value={{ updateHistory, history, init, deleteHistory }}
    >
      {children}
    </HistoryProviderContext.Provider>
  );
};
