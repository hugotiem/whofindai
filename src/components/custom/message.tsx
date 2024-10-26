'use client';

// import { Attachment, ToolInvocation } from "ai";
import { motion } from 'framer-motion';
import { HTMLAttributes, ReactNode } from 'react';

import { Markdown } from './markdown';
import { cn } from '@/lib/utils';
// import { PreviewAttachment } from "./preview-attachment";
// import { Weather } from "./weather";

interface MessageProps extends HTMLAttributes<HTMLElement> {
  role: string;
  textContent: string | ReactNode;
}

export const Message = ({
  // role,
  textContent,
  className,
  // ...props
  // toolInvocations,
  // attachments,
}: MessageProps) => {
  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();
  return (
    <motion.div
      // ref={messagesContainerRef}
      className={cn(
        `flex flex-row gap-4 px-4 max-w-[750px] w-max md:px-0 h-max overflow-scroll`,
        className
      )} //first-of-type:pt-20
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* <div className="size-[24px] flex flex-col justify-center items-center shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div> */}

      <div className="flex flex-col w-full p-10">
        {textContent && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{textContent as string}</Markdown>
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
        {/* <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" /> */}
      </div>
    </motion.div>
  );
};
