'use client';

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

import { Share, RefreshCw } from 'lucide-react';
import { useShare } from '@/hooks/use-share';
import { usePathname } from 'next/navigation';

interface BottomBarProps {
  fetchCompletion: () => void;
}

export const BottomBar = ({ fetchCompletion }: BottomBarProps) => {
  const { copyLink } = useShare();
  const pathname = usePathname();

  return (
    <motion.div layout className="max-w-xl mx-auto w-full">
      <div className="bg-background/90 backdrop-blur-md border rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between gap-2">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg hover:bg-muted flex items-center gap-2"
                onClick={() => {
                  copyLink({ path: pathname });
                  // if (!showCopyToast) {
                  //   setShowCopyToast(true);
                  //   setTimeout(() => setShowCopyToast(false), 2000);
                  // }
                }}
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#0D1117] border-[#7FFFD4] text-[#7FFFD4] font-medium px-3 py-1.5"
              sideOffset={8}
            >
              <div className="flex items-center gap-2">
                {/* <Share className="h-4 w-4" /> */}
                <span>Copy profile link to clipboard</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="rounded-lg  bg-[#7FFFD4] text-[#0D1117] hover:bg-[#6CE9C1] flex items-center gap-2"
                onClick={() => {
                  fetchCompletion();
                  // setShowBanner(false);
                }}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#0D1117] border-[#7FFFD4] text-[#7FFFD4] font-medium px-3 py-1.5"
              sideOffset={8}
            >
              <div className="flex items-center gap-2">
                <span>Regenerate the profile</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};
