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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setCompletion(null);
    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...input, id })
      });
      if (!response.ok) throw Error('API Error', { cause: response.status });
      const data = await response.json();
      const profile = data.profile as APIProfile; //!session?.user ? data.substring(0, 500) : data;
      setCompletion(profile);
      if (session?.user) {
        router.replace(`/profile/${id}`);
        updateHistory(profile);
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
