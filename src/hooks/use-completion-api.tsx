import { useState } from 'react';
import { useHistory } from './use-history';
import { useSession } from './use-session';
import { useRouter } from 'next/navigation';

export interface CompletionInput {
  fullName: string;
  company: string;
  prompt: string;
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
  const [input, setInput] = useState<CompletionInput>({
    fullName: initialCompletionInput?.fullName || '',
    company: initialCompletionInput?.company || '',
    prompt: initialCompletionInput?.prompt || ''
  });

  const { updateHistory } = useHistory();
  const { session } = useSession();
  const router = useRouter();

  const fetchCompletion = async () => {
    if (!input || !input.prompt || !input.company || !input.fullName) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...input, id })
      });
      if (!response.ok) throw Error('API Error');
      const data = await response.json();
      // setCompletion((prev) => data.completion || prev);
      // window.history.pushState({}, '', `/profile/${id}`);
      router.replace(`/profile/${id}`);
      if (initialCompletion) {
        setIsLoading(false);
        setCompletion(data.completion);
      }
      updateHistory({
        id,
        userId: session?.user?.uid,
        fullName: input.fullName,
        company: input.company,
        prompt: input.prompt
      });
      // setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return { completion, isLoading, input, fetchCompletion, setInput };
};
