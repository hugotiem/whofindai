'use client';

import { useEffect } from 'react';

import { Message as PreviewMessage } from '@/components/custom/message';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { cn } from '@/lib/utils';
import { useCompletionAPI } from '@/hooks/use-completion-api';
import { useSession } from '@/hooks/use-session';
import { sendEmailAddressVerification } from '@/lib/firebase/auth';
import { ProgressBar } from './progress-bar';
import { Button } from '../ui/button';
import { RefreshCw, Share } from 'lucide-react';
import { useShare } from '@/hooks/use-share';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';
import { useRouter } from 'next/navigation';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { UpgradeDialog } from './dialog/UpgradeDialog';
import { ProfileDetails } from './profile-details';
import { APIProfile } from '@/app/api/completion/route';

export function Chat({
  id,
  profile,
  // showLoginButton,
  // initialCompletion,
  from_storage
}: {
  id?: string;
  showLoginButton: boolean;
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

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

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
    if (initialPrompt && (!input.prompt || input.prompt === '')) {
      setInput((prev) => ({
        ...prev,
        prompt: initialPrompt
      }));
    }
    if (initialLang && (!input.lang || input.lang === '')) {
      setInput((prev) => ({
        ...prev,
        lang: initialLang
      }));
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [
    setInput,
    input,
    from_storage,
    id,
    router,
    setCompletion,
    updateHistory,
    messagesContainerRef
  ]);

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
        {session?.user && !session.user.emailVerified && (
          <div className="w-full bg-foreground text-background p-4 text-sm font-semibold">
            <div>
              Your email {session?.user?.email} is not verified. Please verify
              it by clicking on the link sent to your email. If you have not
              received the email, click{' '}
              <span
                className="cursor-pointer underline"
                onClick={(e) => {
                  e.preventDefault();
                  sendEmailAddressVerification(session.user!);
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
              ref={messagesContainerRef}
            >
              {/* {isLoading && completion.length === 0 && <ChatSkeleton />} */}
              {isLoading && !completion && (
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <div className=" text-white">
                    <ProgressBar />
                  </div>
                </div>
              )}

              {completion && (
                <>
                  {/* <PreviewMessage
                    showLoginButton={showLoginButton}
                    id={id}
                    role={'system'}
                    textContent={completion}
                  /> */}
                  <ProfileDetails initialProfile={profile} />
                </>
              )}
              <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              />
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
                setInput={setInput}
                handleSubmit={() => {
                  fetchCompletion();
                  // handleSubmit(e);
                  // companyInfo.handleSubmit(e);
                  // meetingInfo.handleSubmit(e);
                }}
                isLoading={isLoading}
                // stop={stop}
                // append={append}
              />
            </form>
          )}
        </div>
      </div>
      {completion && !isLoading && (
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
      )}
    </>
  );
}
