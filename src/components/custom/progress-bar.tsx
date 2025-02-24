'use client';

import { useEffect, useState } from 'react';
import { LinkedinProfile } from './linkedin-profile';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  linkedin: {
    url: string;
    name: string;
    pictureUrl: string;
  } | null;

  thinking: {
    status: 'loading' | 'success' | 'not-started';
    content: string;
  } | null;

  profile: {
    content: string;
  } | null;
}

export function ProfileProgressBar({
  linkedin,
  thinking,
  profile
}: ProgressBarProps) {
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-2">
      <div>
        {!linkedin ? (
          <div className="text-white flex justify-between items-center">
            <span className="opacity-60">Getting date from LinkedIn...</span>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <div className="text-white flex justify-between items-center">
            <div>
              <LinkedinProfile
                initialLinkedinProfile={{
                  profileImageUrl: linkedin.pictureUrl,
                  title: linkedin.name,
                  url: linkedin.url
                }}
              />
            </div>
            <div>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </div>
        )}
        {thinking && (
          <div className="text-white flex flex-col gap-2">
            {thinking.status === 'loading' && (
              <div className="flex justify-between items-center">
                <span className="opacity-60">Thinking...</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {thinking.status === 'success' && (
              <div className="flex justify-between items-center">
                <span className="opacity-60">Success!</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            )}
            {thinking.status === 'not-started' && (
              <span className="opacity-60">Thinking...</span>
            )}
            {thinking.content && (
              <span className="opacity-60 text-xs">{thinking.content}</span>
            )}
          </div>
        )}
        {profile && (
          <div className="text-white flex justify-between items-center">
            <span className="opacity-60">Generating profile...</span>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
