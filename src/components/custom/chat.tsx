'use client';

import { Attachment, Message } from 'ai';
import { useCompletion } from 'ai/react';
import { useState } from 'react';

import { Message as PreviewMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Chat({
  id
  // initialMessages
}: {
  id?: string;
  initialMessages?: Array<Message>;
}) {
  const [fullName, setFullName] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const userInfos = useCompletion({
    api: '/api/completion/user-info',
    body: {
      id,
      fullName,
      company
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  });

  const companyInfo = useCompletion({
    api: '/api/completion/company-info',
    body: {
      id,
      fullName,
      company
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  });

  const meetingInfo = useCompletion({
    api: '/api/completion/meeting',
    body: {
      id,
      fullName,
      company
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  });

  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    // <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background container mx-auto">
    <div className="flex flex-col items-center justify-center container h-screen mx-auto gap-4">
      <div
        // ref={messagesContainerRef}
        className={cn(
          'flex flex-col items-center',
          userInfos.completion && 'h-full mx-48'
        )}
      >
        {userInfos.completion.length === 0 && <Overview />}

        <div className="grid grid-cols-2 gap-4 w-full h-1/2">
          {userInfos.completion && (
            <PreviewMessage
              // key={message.id}
              role={'system'}
              textContent={userInfos.completion}
              // attachments={message.experimental_attachments}
              // toolInvocations={message.toolInvocations}
            />
          )}
          {companyInfo.completion && (
            <PreviewMessage
              // key={message.id}
              role={'system'}
              textContent={companyInfo.completion}
              // attachments={message.experimental_attachments}
              // toolInvocations={message.toolInvocations}
            />
          )}
        </div>
        <div className="h-1/2 row-span-2">
          {meetingInfo.completion && (
            <PreviewMessage
              className="md"
              // key={message.id}
              role={'system'}
              textContent={meetingInfo.completion}
              // attachments={message.experimental_attachments}
              // toolInvocations={message.toolInvocations}
            />
          )}
        </div>

        {/* {messages.map((message) => ( */}

        {/* ))} */}

        {/* <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          /> */}
      </div>

      {userInfos.isLoading && !userInfos.completion && (
        <Loader2 className="animate-spin" />
      )}

      {!userInfos.completion && (
        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[600px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            setCompany={setCompany}
            setFullName={setFullName}
            handleInputChange={(e) => {
              userInfos.handleInputChange(e);
              companyInfo.handleInputChange(e);
              meetingInfo.handleInputChange(e);
            }}
            input={userInfos.input}
            setInput={(e) => {
              userInfos.setInput(e);
              companyInfo.setInput(e);
              meetingInfo.setInput(e);
            }}
            handleSubmit={(e) => {
              userInfos.handleSubmit(e);
              companyInfo.handleSubmit(e);
              meetingInfo.handleSubmit(e);
            }}
            isLoading={userInfos.isLoading}
            stop={userInfos.stop}
            attachments={attachments}
            setAttachments={setAttachments}
            completion={userInfos.completion}
            // append={append}
          />
        </form>
      )}
    </div>
    // </div>
  );
}
