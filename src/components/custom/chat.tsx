'use client';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { useCompletionAPI } from '@/hooks/use-completion-api';
import { useSession } from '@/hooks/use-session';

import { useRouter } from 'next/navigation';
// import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { UpgradeDialog } from './dialog/UpgradeDialog';
import { ProfileDetailsNew } from './profile-details-new';
import { APIProfile } from '@/app/api/completion/prompt';
import { BottomBar } from './bottom-bar';
export function Chat({
  id,
  profile,
  from_storage
}: {
  id?: string;
  initialCompletion?: APIProfile;
  from_storage?: boolean;
  profile?: APIProfile;
}) {
  const {
    completion,
    isLoading,
    fetchCompletion,
    input,
    setInput,
    setCompletion,
    updateHistory,
    showUpgradeDialog,
    setShowUpgradeDialog
  } = useCompletionAPI({
    initialCompletionInput: profile,
    initialCompletion: profile,
    id
  });

  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (from_storage) {
      const profile = localStorage.getItem(`/profile/${id}`);
      if (profile) {
        const obj = JSON.parse(profile);
        setCompletion(obj as APIProfile);
        fetch('/api/completion/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ profile: obj })
        }).then(({ ok }) => {
          if (!ok) router.replace('/');
          window.history.replaceState({}, '', `/profile/${id}`);
          localStorage.removeItem(`/profile/${id}`);
          updateHistory(obj);
        });
      }
    }
    const initialPrompt = localStorage.getItem('app.leedinsight.com/prompt');
    const initialLang = localStorage.getItem('app.leedinsight.com/lang');

    if (input && initialPrompt && (!input.prompt || input.prompt === '')) {
      setInput((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          prompt: initialPrompt
        };
      });
    }

    if (input && initialLang && (!input.lang || input.lang === '')) {
      setInput((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lang: initialLang
        };
      });
    }
  }, [setInput, input, from_storage, id, router, setCompletion, updateHistory]);

  return (
    <>
      {showUpgradeDialog && (
        <UpgradeDialog
          open={showUpgradeDialog}
          setOpen={setShowUpgradeDialog}
        />
      )}
      <div
        className={cn(
          'w-full flex flex-col relative',
          (!completion || isLoading) && 'h-full'
        )}
      >
        {session?.user && !session.user.email_confirmed_at && (
          <div className="w-full bg-foreground text-background p-4 text-sm font-semibold">
            <div>
              Your email {session?.user?.email} is not verified. Please verify
              it by clicking on the link sent to your email. If you have not
              received the email, click{' '}
              <span
                className="cursor-pointer underline"
                onClick={(e) => {
                  e.preventDefault();
                  // sendEmailAddressVerification(session.user!);
                }}
              >
                here
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center container mx-auto gap-4 my-auto ">
          <div
            // ref={messagesContainerRef}
            className={cn(
              'flex flex-col items-center w-full',
              completion && ''
            )}
          >
            <div
              className={cn(
                'gap-4 w-full relative',
                isLoading && !completion && 'h-dvh'
              )}
              // ref={messagesContainerRef}
            >
              {completion && <ProfileDetailsNew initialProfile={completion} />}
              {/* <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              /> */}
            </div>

            {/* {completion && !isLoading && (
          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        )} */}
          </div>
        </div>
      </div>
      <div className=" bottom-4 mt-8 flex justify-center sticky top-10 items-center mb-6 container mx-auto">
        {profile && (
          <div className="flex gap-2">
            <div className=" bottom-8 z-50 flex justify-center">
              <BottomBar fetchCompletion={fetchCompletion} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
