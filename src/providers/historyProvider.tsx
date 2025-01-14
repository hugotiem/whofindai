'use client';

import { APIProfile } from '@/app/api/completion/route';
import { db } from '@/lib/firebase/client';
import { deleteDoc, doc } from 'firebase/firestore';
import { createContext, useState } from 'react';

interface HistoryProviderContextType {
  updateHistory: (profile: APIProfile) => void;
  deleteHistory: (id: string) => void;
  init: (profiles: APIProfile[]) => void;
  history: APIProfile[];
}

export const HistoryProviderContext = createContext<
  HistoryProviderContextType | undefined
>(undefined);

export const HistoryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<APIProfile[]>([]);

  const updateHistory = (profile: APIProfile) => {
    if (history.find((e) => e.id === profile.id)) {
      setHistory((prev) => [
        profile,
        ...prev.filter((e) => e.id !== profile.id)
      ]);
    } else {
      setHistory((prev) => [profile, ...prev]);
    }
  };

  const init = (profiles: APIProfile[]) => {
    if (history.length === 0) {
      setHistory(profiles);
    }
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
