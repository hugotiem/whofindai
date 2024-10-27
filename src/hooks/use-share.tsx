'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useShare = () => {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const [link, setLink] = useState(base);

  useEffect(() => {
    setLink(base + pathname);
  }, [pathname, base]);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.info('link copied to clipboard!');
  };

  return { copyLink, link };
};
