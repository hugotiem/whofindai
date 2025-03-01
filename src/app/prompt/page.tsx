'use client';

import React, { useEffect, useState } from 'react';
import { userPrompt } from '../api/completion/prompt';
import { CompletionInput } from '@/hooks/use-completion-api';

import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/custom/progress-bar';
import { SessionProvider } from '@/providers/sessionProvider';
import Link from 'next/link';
import { APIProfile } from '../api/completion/prompt';
import { PromptEditor } from '@/components/custom/prompt-editor';
import { ProfileDetailsNew } from '@/components/custom/profile-details-new';
import { PromptSelector } from '@/components/custom/prompt-selector';
import { MultimodalInput } from '@/components/custom/multimodal-input';
import { ProfilePromptBuilder } from '@/lib/prompts/profile';
// import { ProfileData } from '@/app/api/completion/prompt';

// Import the Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

// Define stream message interface
interface StreamMessage {
  type: 'linkedin' | 'sources' | 'thinking' | 'profile' | 'error';
  status: 'loading' | 'success' | 'error';
  data?: {
    content?: string | unknown;
    name?: string;
    url?: string;
    pictureUrl?: string;
    [key: string]: string | string[] | unknown;
  };
  error?: string;
}

// Define source item interface
interface SourceItem {
  url?: string;
  title?: string;
  [key: string]: string | undefined;
}

// Define thinking state interface to match ProgressBar requirements
interface ThinkingState {
  status: string;
  content: string;
}

// Define LinkedIn data interface
interface LinkedInDataState {
  status: string;
  content: string;
}

// Define profile progress interface
interface ProfileProgressState {
  status: string;
  content: string;
}

// Define sources interface
interface SourcesState {
  status: string;
  content: string[];
}

export default function Prompt() {
  const [customPrompt, setCustomPrompt] = useState('');
  const [input, setInput] = useState<Partial<CompletionInput>>({
    fullName: 'John Doe',
    company: 'Acme Inc.',
    prompt: '',
    lang: 'english',
    linkedinProfile: {
      fullName: 'John Doe',
      company: 'Acme Inc.',
      pictureUrl: '',
      education: [],
      description: '',
      currentOccupation: 'CEO',
      headline: 'CEO at Acme Inc.',
      location: 'San Francisco, CA',
      experiences: []
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState<APIProfile | null>(null);

  // New state variables for streaming with proper types
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const [linkedInData, setLinkedInData] = useState<LinkedInDataState | null>(
    null
  );
  const [thinking, setThinking] = useState<ThinkingState | null>(null);
  const [sources, setSources] = useState<SourcesState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileProgress, setProfileProgress] =
    useState<ProfileProgressState | null>(null);

  useEffect(() => {
    // Initialize with default prompt
    const initialPrompt = localStorage.getItem('customPrompt');
    if (initialPrompt) {
      setCustomPrompt(initialPrompt);
    } else {
      // Use the default prompt from the ProfilePromptBuilder
      const defaultPrompt = ProfilePromptBuilder.buildPrompt();
      setCustomPrompt(defaultPrompt);
      localStorage.setItem('customPrompt', defaultPrompt);
    }
  }, []);

  const handlePromptChange = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleSavePrompt = (prompt: string) => {
    localStorage.setItem('customPrompt', prompt);
  };

  const handleSelectPrompt = (prompt: string) => {
    setCustomPrompt(prompt);
    localStorage.setItem('customPrompt', prompt);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setStatus('loading');
    setCompletion(null);
    setLinkedInData(null);
    setThinking(null);
    setSources(null);
    setError(null);
    setProfileProgress(null);

    try {
      const response = await fetch('/api/test/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sysPrompt: customPrompt,
          userPrompt: userPrompt(input.fullName || '', input.company || '')
            .replaceAll('${fullName}', input.fullName || '')
            .replaceAll('${company}', input.company || '')
            .replaceAll('${prompt}', input.prompt || '')
            .replaceAll('${lang}', input.lang || ''),
          id: Date.now().toString(),
          linkedinProfile: input.linkedinProfile,
          lang: input.lang || 'english'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate profile');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete messages in the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const message = JSON.parse(line) as StreamMessage;
            console.log('Received message:', message);

            switch (message.type) {
              case 'linkedin':
                if (message.status === 'success' && message.data) {
                  // Convert LinkedIn data to the expected format
                  setLinkedInData({
                    status: message.status,
                    content: `${message.data.name || 'Unknown'} (${message.data.url || 'No URL'})`
                  });
                }
                break;

              case 'sources':
                console.log('Sources message received:', message);
                // Convert sources data to the expected format
                if (message.data) {
                  const sourcesArray = Array.isArray(message.data)
                    ? message.data
                    : Array.isArray(message.data.content)
                      ? message.data.content
                      : [];

                  setSources({
                    status: message.status,
                    content: sourcesArray.map((source: SourceItem | string) => {
                      if (typeof source === 'string') return source;
                      return source?.url || '';
                    })
                  });
                }
                break;

              case 'thinking':
                if (message.data && typeof message.data === 'object') {
                  setThinking({
                    status:
                      message.status === 'error'
                        ? 'not-started'
                        : message.status,
                    content:
                      'content' in message.data &&
                      typeof message.data.content === 'string'
                        ? message.data.content
                        : ''
                  });
                }
                break;

              case 'profile':
                console.log('Profile message received:', message);
                if (
                  message.status === 'success' &&
                  message.data &&
                  message.data.content
                ) {
                  setCompletion(message.data.content as APIProfile);
                  setStatus('complete');
                  setProfileProgress(null); // Clear progress indicator
                } else {
                  setProfileProgress({
                    status: message.status,
                    content: 'Generating profile...'
                  });
                }
                break;

              case 'error':
                if (message.error) {
                  setError(message.error);
                  setStatus('error');
                }
                break;

              default:
                console.warn('Unknown message type:', message.type);
            }
          } catch (e) {
            console.error('Error parsing message:', line, e);
          }
        }
      }
    } catch (error) {
      console.error('Error generating profile:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionProvider>
      <div className="flex flex-col gap-4 mx-auto h-screen p-4">
        <div className="flex items-center justify-between bg-background py-2">
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold">Profile Prompt Editor</h1>
        </div>

        <Tabs defaultValue="editor" className="w-full relative">
          <div className="sticky top-4 z-40 pt-2 pb-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="editor">Prompt Editor</TabsTrigger>
              <TabsTrigger value="result">Result</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 sticky top-32 self-start h-fit">
                <PromptSelector onSelectPrompt={handleSelectPrompt} />
              </div>
              <div className="md:col-span-3">
                <PromptEditor
                  initialPrompt={customPrompt}
                  onPromptChange={handlePromptChange}
                  onSave={handleSavePrompt}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result">
            <div className={cn('w-full relative', isLoading && 'h-dvh')}>
              {status === 'loading' && (
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <div className="text-white">
                    <ProgressBar
                      linkedInData={linkedInData}
                      thinking={thinking}
                      completion={profileProgress}
                      sources={sources}
                    />
                  </div>
                </div>
              )}

              {completion && status === 'complete' && (
                <div className="space-y-6">
                  <ProfileDetailsNew initialProfile={completion} />
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setCompletion(null);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Generate New Profile
                    </button>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <div className="flex justify-center mt-4 p-4 bg-red-50 text-red-600 rounded-md">
                    <p>Error: {error || 'Failed to generate profile'}</p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {status === 'idle' && (
                <div className="flex justify-center mt-4">
                  <div className="w-full max-w-md">
                    <MultimodalInput
                      input={input as CompletionInput}
                      setInput={
                        setInput as React.Dispatch<
                          React.SetStateAction<CompletionInput>
                        >
                      }
                      isLoading={isLoading}
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SessionProvider>
  );
}
