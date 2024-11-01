'use client';

import { motion } from 'framer-motion';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';

import { Markdown } from './markdown';
import { cn } from '@/lib/utils';

interface MessageProps extends HTMLAttributes<HTMLElement> {
  role: string;
  textContent: string;
}

export const Message = ({ textContent, className }: MessageProps) => {
  return (
    <motion.div
      className={cn(
        `flex flex-row gap-4 px-4 max-w-[750px] w-max md:px-0 h-max overflow-scroll`,
        className
      )} //first-of-type:pt-20
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex flex-col w-full p-10">
        {textContent && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 relative w-full">
            <Markdown>{textContent}</Markdown>
            {/* <div className="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent to-background " /> */}
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
    </motion.div>
  );
};
