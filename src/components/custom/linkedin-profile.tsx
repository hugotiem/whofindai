'use client';
import { LinkedInProfile } from '@/lib/definitions';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export const LinkedinProfile = ({
  // fullName,
  // company,
  // linkedinProfileUrl,
  initialLinkedinProfile
}: {
  fullName: string;
  company: string;
  // linkedinProfileUrl?: string;
  initialLinkedinProfile?: LinkedInProfile;
}) => {
  const [linkedinProfile] = useState<
    LinkedInProfile | undefined
  >(initialLinkedinProfile);
  const [isLoading] = useState(false);

  // const linkedInUrlPattern =
  //   /^https:\/\/(?:[\w-]+\.)*linkedin\.com\/in\/[\w\-\_À-ÿ%.]{4,}\/?$/i;

  useEffect(() => {
    // const cleanUrl = linkedinProfileUrl?.trim().split('?')[0];

    // if (!cleanUrl || !linkedInUrlPattern.test(cleanUrl)) {
    //   console.log('returning');
    //   return;
    // }

    // if (
    //   initialLinkedinProfile 
    //   // initialLinkedinProfile.url === linkedinProfileUrl
    // )
    //   return;
    // if ((fullName && company) && !isLoading) {
    //   setIsLoading(true);
    //   fetch('api/linkedin/profile', {
    //     method: 'POST',
    //     body: JSON.stringify({ fullName, company })
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       setLinkedinProfile(data.linkedin);
    //     })
    //     .finally(() => setIsLoading(false));
    // }
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-2 rounded-md bg-sidebar mx-4">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar w-fit mx-4">
          <div className="rounded-full overflow-hidden bg-secondary w-10 h-10">
            <Image
              src={linkedinProfile?.profileImageUrl || ''}
              alt="LinkedIn Profile"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h4 className="text-md font-bold">{linkedinProfile?.title}</h4>
            <p className="text-sm text-gray-500">
              {linkedinProfile?.url }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
