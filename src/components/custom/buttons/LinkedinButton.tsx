'use client'; 

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { IoLogoLinkedin } from 'react-icons/io5';
import { useState } from 'react';
import Image from 'next/image';
import { signInWithLinkedin } from '@/lib/supabase/auth';
export default function LinkedinButton() {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <div
      className="w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        signInWithLinkedin();
      }}
      onFocus={() => setFocus(true)}
    >
      <Image
        src={
          hover
            ? '/linkedin/Sign-In-Small---Hover.png'
            : focus
            ? '/linkedin/Sign-In-Small---Focus.png'
            : '/linkedin/Sign-In-Small---Default.png'
        }
        alt="Linkedin"
        className="cursor-pointer"
        width={300}
        height={300}
      />
    </div>
    // <Button className="relative w-full" type="submit" variant="outline">
    //   <Loader2
    //     className="animate-spin absolute"
    //     style={{
    //       display: loading ? 'block' : 'none'
    //     }}
    //   />

    //   <div
    //     className="flex items-center space-x-3 justify-center"
    //     style={{ opacity: loading ? 0 : 1 }}
    //   >
    //     <IoLogoLinkedin size={30} color="#0173B1" className="bg-white" />
    //     <span>Continue With LinkedIn</span>
    //   </div>
    // </Button>
  );
}
