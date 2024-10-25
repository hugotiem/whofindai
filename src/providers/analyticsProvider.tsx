'use client';

import { app } from '@/lib/firebase/client';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import React, { createContext, useEffect, useState } from 'react';

interface AnalyticsContextType {
  analytics: Analytics | undefined;
  deactivateAnalytics: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType | null>(
  null
);

export const AnalyticsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [analytics, setAnalytics] = useState<Analytics>();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      isSupported().then((supported) => {
        if (supported) {
          const analytics = getAnalytics(app);
          setAnalytics(analytics);
          console.log('Firebase Analytics initialized.');
        } else {
          console.log(
            'Firebase Analytics is not supported in this environment.'
          );
        }
      });
    } else {
      console.log('Firebase Analytics is not supported in this environment.');
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ analytics, deactivateAnalytics: () => {} }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
