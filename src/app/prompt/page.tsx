'use client';

import { useEffect, useState } from 'react';
import { customPrompt, promptContext } from '../api/completion/prompt';
import { Textarea } from '@/components/ui/textarea';
import { MultimodalInput } from '@/components/custom/multimodal-input';
import { CompletionInput } from '@/hooks/use-completion-api';

import { ChatSkeleton } from '@/components/custom/chat-skeletion';
import { cn } from '@/lib/utils';
import { Message } from '@/components/custom/message';
import { ProgressBar } from '@/components/custom/progress-bar';
import { SessionProvider } from '@/providers/sessionProvider';
import Link from 'next/link';

export default function Prompt() {
  // const context = promptContext;

  const [context, setContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [input, setInput] = useState<CompletionInput>({
    fullName: 'John Doe',
    company: 'Acme Inc.',
    prompt:
      'ai tool to help sales professionals prepare for calls or meetings by creating profiles of prospects',
    lang: 'en'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState('');

  useEffect(() => {
    const context = localStorage.getItem('context');
    setContext(context || promptContext);
    const prompt = localStorage.getItem('prompt');
    setPrompt(
      prompt ||
        customPrompt('${fullName}', '${company}', '${prompt}', '${lang}')
    );
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const completion = await fetch('/api/test/completion', {
      method: 'POST',
      body: JSON.stringify({
        context,
        prompt: prompt
          .replaceAll('${fullName}', input.fullName)
          .replaceAll('${company}', input.company)
          .replaceAll('${prompt}', input.prompt)
          .replaceAll('${lang}', input.lang)
      })
    });
    const data = await completion.json();
    setCompletion(data.completion);
    setIsLoading(false);
  };

  return (
    <SessionProvider>
      <div className="flex gap-4 mx-auto justify-center">
        <Link href="/">Back</Link>
        <div className="flex flex-col gap-4 justify-center items-center w-full container">
          <Textarea
            value={context}
            onChange={(e) => {
              setContext(e.target.value);
              localStorage.setItem('context', e.target.value);
            }}
          />
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              localStorage.setItem('prompt', e.target.value);
            }}
            rows={40}
          />
        </div>
        <div className="w-full container h-screen overflow-y-scroll flex flex-col justify-center items-center">
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
              <Message
                showLoginButton={false}
                id={undefined}
                role={'system'}
                textContent={completion}
              />
            )}
          </div>
          <div className="max-w-[750px] mx-auto">
            <MultimodalInput
              input={input}
              setInput={setInput}
              isLoading={false}
              completion={''}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}