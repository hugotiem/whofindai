'use client';

import { useEffect, useState } from 'react';
import {
  systemPrompt,
  userPrompt,
  promptContext
} from '../api/completion/prompt';
import { Textarea } from '@/components/ui/textarea';
import { MultimodalInput } from '@/components/custom/multimodal-input';
import { CompletionInput } from '@/hooks/use-completion-api';

import { ChatSkeleton } from '@/components/custom/chat-skeletion';
import { cn } from '@/lib/utils';
import { Message } from '@/components/custom/message';
import { ProgressBar } from '@/components/custom/progress-bar';
import { SessionProvider } from '@/providers/sessionProvider';
import Link from 'next/link';
import { ProfileDetails } from '@/components/custom/profile-details';
import { APIProfile } from '../api/completion/route';

export default function Prompt() {
  // const context = promptContext;

  const [usrPrompt, setUserPrompt] = useState('');
  const [sysPrompt, setSystemPrompt] = useState('');
  const [input, setInput] = useState<CompletionInput>({
    fullName: 'John Doe',
    company: 'Acme Inc.',
    prompt:
      'ai tool to help sales professionals prepare for calls or meetings by creating profiles of prospects',
    lang: 'en'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState<APIProfile | null>(null);

  useEffect(() => {
    const initialSysPrompt = localStorage.getItem('sysPrompt');
    setSystemPrompt(
      initialSysPrompt ||
        systemPrompt('${fullName}', '${company}', '${prompt}', '${lang}')
    );
    const initialUserPrompt = localStorage.getItem('userPrompt');
    setUserPrompt(initialUserPrompt || userPrompt('${fullName}', '${company}'));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const completion = await fetch('/api/test/completion', {
      method: 'POST',
      body: JSON.stringify({
        sysPrompt,
        userPrompt: usrPrompt
          .replaceAll('${fullName}', input.fullName)
          .replaceAll('${company}', input.company)
          .replaceAll('${prompt}', input.prompt)
          .replaceAll('${lang}', input.lang)
      })
    });
    const data = await completion.json();
    setCompletion(data.profile as APIProfile);
    setIsLoading(false);
  };

  return (
    <SessionProvider>
      <div className="flex gap-4 mx-auto justify-center h-screen">
        <Link href="/">Back</Link>
        <div className="flex flex-col gap-4 justify-center items-center w-full container">
          <Textarea
            value={sysPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
              localStorage.setItem('context', e.target.value);
            }}
            rows={20}
          />
          <Textarea
            value={usrPrompt}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              localStorage.setItem('prompt', e.target.value);
            }}
            rows={20}
          />
        </div>
        <div
          className={cn(
            'w-full container overflow-y-scroll flex flex-col items-center',
            completion === null && 'justify-center'
          )}
        >
          <div className={cn('gap-4 w-full relative', isLoading && 'h-dvh')}>
            {isLoading && <ChatSkeleton />}
            {isLoading && (
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className=" text-white">
                  <ProgressBar />
                </div>
              </div>
            )}

            {completion && !isLoading && (
              <ProfileDetails initialProfile={completion} />
            )}
          </div>
          <div className="max-w-[750px] mx-auto">
            <MultimodalInput
              input={input}
              setInput={setInput}
              isLoading={false}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
