'use client';

import { signInWithGoogle } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../ui/button';
// import { useProgressBar } from '@/hooks/use-progress-bar';

interface GoogleButtonRrops {
  autoLogin?: boolean;
  onClick?: () => void;
}

const GoogleButton = ({ autoLogin = true, onClick }: GoogleButtonRrops) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const { showProgress } = useProgressBar();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // signInWithGoogle(() => showProgress())
    //   .then((_) => {
    //     router.replace('/api/auth/session/create');
    //   })
    //   .catch((e) => {
    //     setLoading(false);
    //   });
  };

  return (
    <Button
      className="relative"
      onSubmit={() => {}}
      onClick={autoLogin ? handleLogin : onClick}
      variant="outline"
      // size="appXlFull"
    >
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
