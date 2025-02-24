import { useState } from 'react';
import { useHistory } from './use-history';
import { useSession } from './use-session';
import { useRouter } from 'next/navigation';
import { APIProfile } from '@/app/api/completion/prompt';

export interface CompletionInput {
  fullName: string;
  company: string;
  prompt: string;
  lang: string;
  linkedinUrl?: string;
}

interface UseCompletionAPIProps {
  initialCompletion?: APIProfile;
  initialCompletionInput?: APIProfile;
  id?: string;
}

export const useCompletionAPI = ({
  id,
  initialCompletion,
  initialCompletionInput
}: UseCompletionAPIProps = {}) => {
  const [completion, setCompletion] = useState<APIProfile | null>(
    initialCompletion || null
  );
  const [linkedInData, setLinkedInData] = useState<{
    url: string;
    name: string;
    pictureUrl: string;
  } | null>(null);
  const [sources, setSources] = useState<Array<{ url: string }>>([]);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState<{
    status: 'loading' | 'success' | 'not-started';
    content: string;
  } | null>({
    status: 'not-started',
    content: ''
  });
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [input, setInput] = useState<CompletionInput>({
    fullName: initialCompletionInput?.full_name || '',
    company: initialCompletionInput?.company || '',
    prompt: '',
    lang: 'en',
    linkedinUrl: initialCompletionInput?.contact_details?.linkedin || ''
  });

  const { updateHistory } = useHistory();
  const { session } = useSession();
  const router = useRouter();

  const fetchCompletion = async () => {
    if (!input || !input.prompt || !input.company || !input.fullName) return;

    setStatus('loading');
    setCompletion(null);
    setError(null);

    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...input, id })
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const messages = chunk.split('\n').filter(Boolean);

          for (const messageText of messages) {
            const message = JSON.parse(messageText);

            console.log('message', message.type);

            switch (message.type) {
              case 'linkedin':
                if (message.status === 'success') {
                  setLinkedInData(message.data);
                }
                break;

              case 'sources':
                if (message.status === 'success') {
                  setSources(message.data);
                }
                break;

              case 'thinking':
                // if (message.status === 'success') {
                console.log('message.data', message.status);
                const thinking = {
                  status: message.status,
                  content: message.data?.content || ''
                };
                setThinking(thinking);
                // }
                break;

              // case 'profile':
              //   if (message.status === 'success') {
              //     setCompletion(message.data);
              //     setStatus('complete');

              //     if (session?.user) {
              //       router.replace(`/profile/${id}`);
              //       updateHistory(message.data);
              //     }
              //   }
              //   break;

              case 'error':
                setError(message.error);
                setStatus('error');
                break;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');

      if (error instanceof Error && 'cause' in error && error.cause === 402) {
        setShowUpgradeDialog(true);
      }
    }
  };

  return {
    completion,
    linkedInData,
    sources,
    status,
    error,
    isLoading: status === 'loading',
    input,
    fetchCompletion,
    setInput,
    setCompletion,
    updateHistory,
    showUpgradeDialog,
    setShowUpgradeDialog,
    thinking
  };
};
