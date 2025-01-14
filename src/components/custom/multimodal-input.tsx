'use client';

import { ChatRequestOptions } from 'ai';
import React, {
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react';
import { toast } from 'sonner';

import { ArrowUpIcon, StopIcon } from './icons';
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
            <StopIcon size={14} />
          </Button>
        ) : (
          <div className="flex justify-between items-center">
            <Select
              value={input?.lang || 'en'}
              onValueChange={(value) => {
                if (value !== input?.lang && value !== '') {
                  setInput((prev) => ({ ...prev, lang: value }));
                  localStorage.setItem('app.winanycall.com/lang', value);
                }
              }}
            >
              <SelectTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-ring hover:bg-sidebar hover:text-sidebar-primary-foreground">
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
            <Button
              className="rounded-full p-1.5 h-fit m-2"
              onClick={(event) => {
                event.preventDefault();
                handleSubmit(undefined);
              }}
              disabled={false}
            >
              <ArrowUpIcon size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
