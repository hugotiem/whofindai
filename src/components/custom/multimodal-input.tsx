'use client';

import { Attachment, ChatRequestOptions } from 'ai';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent
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

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  attachments,
  setAttachments,
  completion,
  handleSubmit
}: {
  input: CompletionInput | undefined;
  setInput: Dispatch<SetStateAction<CompletionInput>>;
  isLoading: boolean;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  completion: string;
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      {completion?.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <>
            <div className="grid sm:grid-cols-2 gap-2 w-full md:px-0 mx-auto md:max-w-[600px]">
              <Input
                placeholder="fullName"
                value={input?.fullName}
                onChange={onFullNameChange}
                className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted"
              />
              <Input
                placeholder="Company"
                value={input?.company}
                onChange={onCompanyChange}
                className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted"
              />
            </div>
          </>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />
      <div className="flex flex-col gap-2 rounded-lg border border-input bg-secondary focus-within:ring-0 focus-within:ring-ring focus-within:ring-offset-1">
        <Textarea
          ref={textareaRef}
          placeholder="What i want to sell is..."
          value={input?.prompt}
          onChange={(value) => {
            setInput((prev) => ({ ...prev, prompt: value.target.value }));
            localStorage.setItem(
              'app.winanycall.com/prompt',
              value.target.value
            );
          }}
          className="overflow-hidden resize-none text-base bg-muted focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none overflow-scroll min-h-[48px] max-h-[150px]"
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
              value={input?.lang}
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
                handleSubmit(undefined, {
                  experimental_attachments: attachments
                });
                // submitForm();
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
