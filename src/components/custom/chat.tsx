'use client';

import { Attachment } from 'ai';
import { useState } from 'react';

import { Message as PreviewMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompletionAPI } from '@/hooks/use-completion-api';

export function Chat({
  id,
  initialCompletion
}: {
  id?: string;
  initialCompletion?: string;
}) {
  const { completion, isLoading, fetchCompletion, input, setInput } =
    useCompletionAPI({
      initialCompletion,
      id
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    // <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background container mx-auto">
    <div className="flex flex-col items-center justify-center container h-screen mx-auto gap-4">
      <div
        ref={messagesContainerRef}
        className={cn('flex flex-col items-center', completion && 'h-full')}
      >
        {completion.length === 0 && <Overview />}

        <div className="gap-4 w-full">
          {completion && !isLoading && (
            <PreviewMessage
              // key={message.id}
              role={'system'}
              textContent={completion}
            />
          )}
          </div>

        {/* {completion && !isLoading && (
          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        )} */}
      </div>

      {isLoading && !completion && <Loader2 className="animate-spin" />}

      {!completion && (
        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[600px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={(e) => {
              fetchCompletion();
              // handleSubmit(e);
              // companyInfo.handleSubmit(e);
              // meetingInfo.handleSubmit(e);
            }}
            isLoading={isLoading}
            // stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            completion={completion}
            // append={append}
          />
        </form>
      )}
    </div>
  );
}
