'use client';

import { createContext, useState } from 'react';

interface ProgressBarContextType {
  progress: number;
  isVisible: boolean;
  showProgress: () => void;
  hideProgress: () => void;
}

export const ProgressBarContext = createContext<ProgressBarContextType | null>(
  null
);

export const ProgressBarProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const showProgress = () => {
    setIsVisible(true);
    setProgress(0);
    setTimeout(() => {
      setProgress(30);
    }, 1000);
    setTimeout(() => {
      setProgress(50);
    }, 1500);
    setTimeout(() => {
      setProgress(70);
    }, 2000);
    setTimeout(() => {
      setProgress(95);
    }, 2500);
  };

  const hideProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 100);
  };

  return (
    <ProgressBarContext.Provider
      value={{ progress, isVisible, showProgress, hideProgress }}
    >
      {children}
    </ProgressBarContext.Provider>
  );
};
