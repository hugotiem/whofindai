'use client';

import { motion } from 'framer-motion';
import { HTMLAttributes } from 'react';

import { Markdown } from './markdown';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useShare } from '@/hooks/use-share';
import { Share } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import Link from 'next/link';

interface MessageProps extends HTMLAttributes<HTMLElement> {
  role: string;
  textContent: string;
  id: string | undefined;
}

export const Message = ({ textContent, className, id }: MessageProps) => {
  const { copyLink } = useShare();
  const { session } = useSession();

  return (
    <motion.div
      className={cn(
        `flex flex-col gap-4 px-4 max-w-[750px] mx-auto w-full md:px-0 h-max overflow-scroll relative`,
        className
      )} //first-of-type:pt-20
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex flex-col w-full p-10">
        {textContent && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 relative w-full">
            <Markdown>{textContent}</Markdown>
            {!session && (
              <div className="absolute bottom-0 h-full w-full bg-gradient-to-b from-transparent to-background flex flex-col justify-center items-center" />
            )}
          </div>
        )}

        {/* {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={result} />
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "getWeather" ? <Weather /> : null}
                  </div>
                );
              }
            })}
          </div>
        )} */}

        {/* {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )} */}
      </div>
      {session && (
        <Button
          className="rounded-full p-1.5 h-fit m-0.5 absolute top-10 right-8"
          variant="outline"
          onClick={() => copyLink({ path: `/profile/${id}` })}
          disabled={false}
        >
          <Share className="h-4 w-4" />
        </Button>
      )}
      <div className="flex flex-col items-center font-semibold max-w-xs mx-auto">
        <div className="text-center">
          If you want to unlock this content, you need to
          <Link href={'/auth/signIn'} className="mx-1 underline">
            log in
          </Link>
          or{' '}
          <Link href={'/auth/signUp'} className="mx-1 underline">
            sign up
          </Link>
          .
        </div>
      </div>
    </motion.div>
  );
};
