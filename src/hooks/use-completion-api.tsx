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
  id?: string;
}

export const useCompletionAPI = ({
  id,
  initialCompletion
}: UseCompletionAPIProps = {}) => {
  const [completion] = useState<string>(initialCompletion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<CompletionInput>({
    fullName: '',
    company: '',
    prompt: ''
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
      // const data = await response.json();
      // setCompletion((prev) => data.completion || prev);
      // window.history.pushState({}, '', `/profile/${id}`);
      router.replace(`/profile/${id}`);
      updateHistory({
        id,
        userId: session?.user?.uid,
        fullName: input.fullName,
        company: input.company
      });
      // setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return { completion, isLoading, input, fetchCompletion, setInput };
};
