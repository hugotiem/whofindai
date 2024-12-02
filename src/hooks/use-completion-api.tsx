import { useState } from 'react';
import { useHistory } from './use-history';
import { useSession } from './use-session';
import { useRouter } from 'next/navigation';

export interface CompletionInput {
  fullName: string;
  company: string;
  prompt: string;
  lang: string;
}

interface UseCompletionAPIProps {
  initialCompletion?: string;
  initialCompletionInput?: CompletionInput;
  id?: string;
}

export const useCompletionAPI = ({
  id,
  initialCompletion,
  initialCompletionInput
}: UseCompletionAPIProps = {}) => {
  const [completion, setCompletion] = useState<string>(initialCompletion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [input, setInput] = useState<CompletionInput>({
    fullName: initialCompletionInput?.fullName || '',
    company: initialCompletionInput?.company || '',
    prompt: initialCompletionInput?.prompt || '',
    lang: initialCompletionInput?.lang || ''
  });

  const { updateHistory } = useHistory();
  const { session } = useSession();
  const router = useRouter();

  const fetchCompletion = async () => {
    if (!input || !input.prompt || !input.company || !input.fullName) return;
    setIsLoading(true);
    setCompletion('');
    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...input, id })
      });
      if (!response.ok) throw Error('API Error', { cause: response.status });

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      let data = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        data += decoder.decode(value, { stream: true });

        const completion = !session?.user ? data.substring(0, 500) : data;
        setCompletion(completion);
      }
      if (session?.user) {
        router.replace(`/profile/${id}`);
        updateHistory({
          id,
          userId: session?.user?.uid,
          fullName: input.fullName,
          company: input.company,
          prompt: input.prompt,
          lang: input.lang
        });
      }

      if (!session?.user) {
        window.history.replaceState({}, '', `/profile/${id}`);
        localStorage.setItem(
          `/profile/${id}`,
          JSON.stringify({
            id,
            userId: session?.user?.uid,
            fullName: input.fullName,
            company: input.company,
            prompt: input.prompt,
            content: data,
            lang: input.lang
          })
        );
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        if (error.cause === 402) {
          setShowUpgradeDialog(true);
        }
      } else {
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  return {
    completion,
    isLoading,
    input,
    fetchCompletion,
    setInput,
    setCompletion,
    updateHistory,
    showUpgradeDialog,
    setShowUpgradeDialog
  };
};
