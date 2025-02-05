'use client';
import { LinkedInProfile } from '@/lib/definitions';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
export const LinkedinProfile = ({
  fullName,
  company,
  linkedinProfileUrl,
  initialLinkedinProfile
}: {
  fullName: string;
  company: string;
  linkedinProfileUrl?: string;
  initialLinkedinProfile?: LinkedInProfile;
}) => {
  const [linkedinProfile, setLinkedinProfile] = useState<
    LinkedInProfile | undefined
  >(initialLinkedinProfile);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      initialLinkedinProfile &&
      initialLinkedinProfile.url === linkedinProfileUrl
    )
      return;
    if ((linkedinProfileUrl || (fullName && company)) && !isLoading) {
      setIsLoading(true);
      fetch('api/linkedin/profile', {
        method: 'POST',
        body: JSON.stringify({ fullName, company, fromUrl: linkedinProfileUrl })
      })
        .then((res) => res.json())
        .then((data) => setLinkedinProfile(data))
        .finally(() => setIsLoading(false));
    }
  }, [linkedinProfileUrl]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-2 rounded-md bg-sidebar mx-4">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar w-fit mx-4">
          <div className="rounded-full overflow-hidden bg-secondary w-10 h-10">
            <img
              src={linkedinProfile?.profileImageUrl}
              alt="LinkedIn Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <h4 className="text-md font-bold">{linkedinProfile?.title}</h4>
            <p className="text-sm text-gray-500">
              {linkedinProfile?.url || linkedinProfileUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
