'use client';

import { ChatRequestOptions } from 'ai';
import React, {
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  useState
} from 'react';
import { toast } from 'sonner';

import { StopIcon } from '@radix-ui/react-icons';
import useWindowSize from '../../hooks/use-window-size';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { CompletionInput } from '@/hooks/use-completion-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Label } from '../ui/label';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { LinkedinProfile } from './linkedin-profile';
import { Stars } from 'lucide-react';
import { LinkedInProfile } from '@/lib/definitions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';
import { cn } from '@/lib/utils';
export function MultimodalInput({
  input,
  setInput,
  isLoading,
  handleSubmit
}: {
  input: CompletionInput | undefined;
  setInput: Dispatch<SetStateAction<CompletionInput>>;
  isLoading: boolean;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
}) {
  const [isFinding, setIsFinding] = useState(false);
  const [linkedinProfile, setLinkedinProfile] = useState<
    LinkedInProfile | undefined
  >(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [input?.prompt]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const onFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput((prev) => ({ ...prev, fullName: event.target.value }));

  const onCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput((prev) => ({ ...prev, company: event.target.value }));

  const submitForm = useCallback(() => {
    handleSubmit(undefined);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, width]);

  return (
    <TooltipProvider>
      <div className="relative w-full flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-2 w-full md:px-0 mx-auto md:max-w-[600px]">
          <Input
            placeholder="Prospect's full name"
            value={input?.fullName}
            onChange={onFullNameChange}
            className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted"
          />
          <Input
            placeholder="Prospect's company"
            value={input?.company}
            onChange={onCompanyChange}
            className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted"
          />
        </div>

        {/* <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      /> */}
        <Label className="ml-4">What&apos;s your offer?</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-input bg-secondary focus-within:ring-0 focus-within:ring-ring focus-within:ring-offset-1">
          <Textarea
            ref={textareaRef}
            placeholder="Please describe what the company is selling and the benefits it provides"
            value={input?.prompt}
            onChange={(value) => {
              setInput((prev) => ({ ...prev, prompt: value.target.value }));
              localStorage.setItem(
                'app.winanycall.com/prompt',
                value.target.value
              );
            }}
            className="overflow-hidden resize-none text-base bg-muted focus-visible:ring-0 placeholder:italic focus-visible:ring-offset-0 focus:outline-none overflow-scroll min-h-[48px] max-h-[150px]"
            rows={1}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();

                if (isLoading) {
                  toast.error(
                    'Please wait for the model to finish its response!'
                  );
                } else {
                  submitForm();
                }
              }
            }}
          />

          {isLoading ? (
            <Button
              className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5"
              onClick={(event) => {
                event.preventDefault();
                stop();
              }}
            >
              <StopIcon className="size-4" />
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder="LinkedIn URL"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-ring hover:text-sidebar-primary-foreground text-muted-foreground rounded-full"
                  value={input?.linkedinUrl}
                  onChange={(event) => {
                    setInput((prev) => ({
                      ...prev,
                      linkedinUrl: event.target.value
                    }));
                  }}
                />
                <Tooltip>
                  <TooltipTrigger
                    className={cn(
                      !input?.fullName || !input?.company || isFinding
                        ? 'cursor-not-allowed'
                        : ''
                    )}
                  >
                    <Button
                      disabled={
                        !input?.fullName || !input?.company || isFinding
                      }
                      type="button"
                      className={cn(
                        'rounded-full hover:bg-sidebar hover:text-sidebar-primary-foreground text-muted-foreground ',
                        !input?.fullName || !input?.company || isFinding
                          ? 'cursor-not-allowed'
                          : ''
                      )}
                      variant="ghost"
                      onClick={(event) => {
                        event.preventDefault();

                        setIsFinding(true);
                        fetch('api/linkedin/profile', {
                          method: 'POST',
                          body: JSON.stringify({
                            fullName: input?.fullName,
                            company: input?.company
                          })
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            const profile = data.linkedin;
                            setInput((prev) => ({
                              ...prev,
                              linkedinUrl: profile.url
                            }));
                            setIsFinding(false);
                            setLinkedinProfile(profile);
                          });
                      }}
                    >
                      <span>Find</span>
                      <Stars className="ml-1 size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-sidebar text-sidebar-primary-foreground">
                    {!input?.fullName || !input?.company || isFinding ? (
                      <p>
                        You need to provide the full name and company of the
                        <br />
                        prospect to find their LinkedIn profile.
                      </p>
                    ) : (
                      <p>
                        Find LinkedIn profile for {input?.fullName} at{' '}
                        {input?.company}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>

              {input?.linkedinUrl && (
                <LinkedinProfile
                  fullName={input?.fullName}
                  company={input?.company}
                  // linkedinProfileUrl={input?.linkedinUrl}
                  initialLinkedinProfile={linkedinProfile}
                />
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Select
                    value={input?.lang || 'en'}
                    onValueChange={(value) => {
                      if (value !== input?.lang && value !== '') {
                        setInput((prev) => ({ ...prev, lang: value }));
                        localStorage.setItem('app.winanycall.com/lang', value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-ring hover:bg-sidebar hover:text-sidebar-primary-foreground text-muted-foreground rounded-full">
                      <SelectValue placeholder="Language" />
                      <div className="w-2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Button
                  type="button"
                  className="rounded-full hover:bg-sidebar hover:text-sidebar-primary-foreground text-muted-foreground "
                  variant="ghost"
                  onClick={(event) => {
                    event.preventDefault();
                    setShowLinkedinUrl((e) => !e);
                  }}
                >
                  {showLinkedinUrl ? 'Hide' : 'Add'} LinkedIn URL
                </Button> */}
                </div>
                <Button
                  type="submit"
                  className="rounded-full bg-[#7FFFD4] text-[#0D1117] hover:bg-[#6CE9C1] m-2 flex items-center gap-2 font-semibold"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubmit(undefined);
                  }}
                  // disabled={false}
                >
                  <span>Generate</span>
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
