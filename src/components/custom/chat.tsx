'use client';

import { useEffect } from 'react';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { cn } from '@/lib/utils';
import { useCompletionAPI } from '@/hooks/use-completion-api';
import { useSession } from '@/hooks/use-session';
import { RefreshCw, Share } from 'lucide-react';
import { useShare } from '@/hooks/use-share';

import { useRouter } from 'next/navigation';
// import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { UpgradeDialog } from './dialog/UpgradeDialog';
import { ProfileDetails } from './profile-details';
import { APIProfile } from '@/app/api/completion/prompt';

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
  const { copyLink } = useShare();
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
    const initialPrompt = localStorage.getItem('app.winanycall.com/prompt');
    const initialLang = localStorage.getItem('app.winanycall.com/lang');

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
      <div className="flex justify-end sticky top-10 items-center mb-6 container mx-auto">
        {profile && (
          <div className="flex gap-2">
            <button
              onClick={() => copyLink({ path: `/profile/${id}` })}
              className={`inline-flex sticky top-0 items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#1C2128] hover:bg-[#1C2128]/80`}
            >
              <Share className={`w-4 h-4 mr-2`} />
              Share
            </button>
            <button
              onClick={() => fetchCompletion()}
              className={`inline-flex sticky top-0 items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#7FFFD4] text-[#0D1117] hover:bg-[#6CE9C1]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2`} />
              Update Profile
            </button>
          </div>
        )}
      </div>
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
            {!isLoading && !completion && <Overview />}

            <div
              className={cn(
                'gap-4 w-full relative',
                isLoading && !completion && 'h-dvh'
              )}
              // ref={messagesContainerRef}
            >
              {/* {isLoading && completion.length === 0 && <ChatSkeleton />} */}
              {isLoading && !completion && (
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <div className=" text-white">
                    {/* <ProgressBar
                      linkedInData={linkedInData}
                      thinking={thinking}
                      completion={null}
                      sources={null}
                    /> */}
                  </div>
                </div>
              )}

              {completion && (
                <>
                  <ProfileDetails initialProfile={profile} />
                </>
              )}
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

          {/* {isLoading && !completion && <Loader2 className="animate-spin" />} */}

          {!completion && !isLoading && (
            <form className="flex flex-row my-auto gap-2 relative items-end w-full md:max-w-[600px] max-w-[calc(100dvw-32px) px-4 md:px-0">
              <MultimodalInput
                input={input}
                // setInput={setInput}
                handleSubmit={() => {
                  fetchCompletion();
                }}
                isLoading={isLoading}
              />
            </form>
          )}
        </div>
      </div>
      {/* {completion && !isLoading && (
        <div className="sticky left-[50%] translate-x-[-50%] mx-auto bottom-8 z-50 bg-background border border-border rounded-full w-fit p-2">
          <TooltipProvider>
            {profile?.userId === session?.user?.uid && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full p-1.5 h-fit m-0.5"
                    onClick={() => fetchCompletion()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-secondary">
                  Regenerate
                </TooltipContent>
              </Tooltip>
            )}
            {session?.user && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-full p-1.5 h-fit m-0.5"
                    variant="ghost"
                    onClick={() => copyLink({ path: `/profile/${id}` })}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-secondary">
                  Share
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      )} */}
    </>
  );
}
