'use client';

import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [randInt, setRandInt] = useState(0);

  useEffect(() => {
    setRandInt(Math.floor(Math.random() * (40 - 20 + 1)) + 20);
    // Fonction de mise à jour de la progression avec possibilité de pause
    const updateProgress = () => {
      setProgress((value) => {
        if (value >= 100) return 100; // Arrêter à 100%

        // Incrément de base rapide
        const baseIncrement = 1;

        // Simuler des pauses longues pour certaines sources (30% de chance)
        const isLongPause = Math.random() > 0.7;
        const increment = isLongPause ? 0 : baseIncrement; // Pause ou incrémentation normale

        return Math.min(value + increment, 100);
      });
    };

    // Fonction pour définir les délais, avec des pauses prolongées
    const startLoading = () => {
      const randomDelay = Math.random() > 0.7 ? 500 : 100; // 30% de chance de pause prolongée de 1 seconde
      const interval = setInterval(updateProgress, randomDelay);

      // Nettoyer et réinitialiser l'intervalle après chaque étape pour ajuster la vitesse
      return () => clearInterval(interval);
    };

    const interval = startLoading();

    return () => interval();
  }, []);

  return (
    <>
      <Progress value={progress} className="w-40" />
      <div className="text-sm font-semibold opacity-60 text-foreground">
        {progress < 10
          ? 'Loading'
          : ` ${(randInt * ((progress - 10) / 100)).toFixed()} sources browsed`}{' '}
      </div>
    </>
  );
}
