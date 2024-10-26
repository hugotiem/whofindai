'use client';

import { Profile } from '@/lib/definitions';
import { db } from '@/lib/firebase/client';
import { deleteDoc, doc } from 'firebase/firestore';
import { createContext, useState } from 'react';

interface HistoryProviderContextType {
  updateHistory: (profile: Profile) => void;
  deleteHistory: (id: string) => void;
  init: (profiles: Profile[]) => void;
  history: Profile[];
}

export const HistoryProviderContext = createContext<
  HistoryProviderContextType | undefined
>(undefined);

export const HistoryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<Profile[]>([]);

  const updateHistory = (profile: Profile) => {
    setHistory((prev) => [profile, ...(prev || [])]);
  };

  const init = (profiles: Profile[]) => {
    setHistory(profiles);
  };

  const deleteHistory = (id: string) => {
    const docRef = doc(db, 'profiles/', id);
    deleteDoc(docRef).then(() => {
      setHistory((prev) => prev.filter((e) => e.id !== id));
    });
  };

  return (
    <HistoryProviderContext.Provider
      value={{ updateHistory, history, init, deleteHistory }}
    >
      {children}
    </HistoryProviderContext.Provider>
  );
};
