'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FaLinkedinIn } from 'react-icons/fa';

const LinkedinButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <Button
      className="relative w-full bg-[#0077B5] text-white hover:bg-[#006097] transition-all duration-200"
      type="submit"
      variant="outline"
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : (
        <div className="flex items-center justify-center gap-3">
          <FaLinkedinIn className="h-5 w-5" />
          <span className="font-medium">Continue with LinkedIn</span>
        </div>
      )}
    </Button>
  );
};

export default LinkedinButton;
