'use client';
import { toast } from 'sonner';

export const useShare = () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const copyLink = ({ path }: { path?: string }) => {
    const link = base + path;
    navigator.clipboard.writeText(link);
    toast.success('link copied to clipboard!');
  };

  return { copyLink };
};
