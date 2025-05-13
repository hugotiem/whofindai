'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../ui/button';
// import { useProgressBar } from '@/hooks/use-progress-bar';

const GoogleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <Button
      className="relative w-full bg-white text-black hover:bg-gray-100 border border-gray-300 shadow-sm transition-all duration-200"
      type="submit"
      // variant="outline"
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
      ) : (
        <div className="flex items-center justify-center gap-3">
          <FcGoogle className="h-5 w-5" />
          <span className="font-medium">Continue with Google</span>
        </div>
      )}
    </Button>
  );
};

export default GoogleButton;
