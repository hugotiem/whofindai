'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { MoonIcon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      className="cursor-pointer rounded-full transition-all duration-100"
      variant="secondary"
      size="icon"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      {theme === 'dark' ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      {/* {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`} */}
    </Button>
  );
}
