'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../ui/button';
// import { useProgressBar } from '@/hooks/use-progress-bar';

const GoogleButton = () => {
  const [loading] = useState(false);

  return (
    <Button className="relative w-full" type="submit" variant="outline">
      <Loader2
        className="animate-spin absolute"
        style={{
          display: loading ? 'block' : 'none'
        }}
      />

      <div
        className="flex items-center space-x-3 justify-center"
        style={{ opacity: loading ? 0 : 1 }}
      >
        <FcGoogle size={30} />
        <span>Continue With Google</span>
      </div>
    </Button>
  );
};

export default GoogleButton;
