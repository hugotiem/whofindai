'use client';

import { Attachment, Message } from 'ai';
import { useCompletion } from 'ai/react';
import { useState } from 'react';

import { Message as PreviewMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { Loader2 } from 'lucide-react';

export function Chat({
  id
  // initialMessages
}: {
  id?: string;
  initialMessages?: Array<Message>;
}) {
  const [fullName, setFullName] = useState<string>('');
  // const [saleService, setSaleService] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const {
    completion,
    handleSubmit,
    handleInputChange,
    input,
    setInput,
    isLoading,
    stop
  } = useCompletion({
    api: '/api/chat/',
    body: {
      id,
      fullName,
      company
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  });

  const [messagesContainerRef, ] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background container mx-auto">
      <div className="flex flex-col items-center gap-4 justify-center">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 items-center overflow-y-scroll"
        >
          {completion.length === 0 && <Overview />}

          {/* {messages.map((message) => ( */}
          {completion && (
            <PreviewMessage
              // key={message.id}
              role={'system'}
              content={completion}
              // attachments={message.experimental_attachments}
              // toolInvocations={message.toolInvocations}
            />
          )}
          {/* ))} */}

          {/* <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          /> */}
        </div>

        {isLoading && <Loader2 className='animate-spin'/>}

        {!completion && (
          <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
            <MultimodalInput
              setCompany={setCompany}
              setFullName={setFullName}
              handleInputChange={handleInputChange}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              completion={completion}
              // append={append}
            />
          </form>
        )}
      </div>
    </div>
  );
}
