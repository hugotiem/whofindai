'use client';

import GoogleButton from '@/components/custom/buttons/GoogleButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signInWithPassword } from '@/lib/firebase/auth';
import Link from 'next/link';
import { useState } from 'react';

interface SignInFormProps {
  redirect_path?: string;
}

export const SignInForm = ({ redirect_path }: SignInFormProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="flex flex-col h-full justify-center items-center mx-auto max-w-[300px] space-y-3">
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <Button
        size="sm"
        variant="secondary"
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          signInWithPassword(email, password, { redirect_path });
        }}
      >
        Log in
      </Button>
      <div className="w-full">
        <Separator
          orientation="horizontal"
          className="flex flex-col items-center my-4"
        >
          <div className="translate-y-[-12px] bg-background w-min px-2">or</div>
        </Separator>
      </div>
      <GoogleButton redirect_path={redirect_path} />
      <div className="text-sm">
        <span className="opacity-50">You don&apos;t have an account? </span>
        <Link href="/auth/signUp" className="underline opacity-80">
          Sign up
        </Link>
      </div>
    </div>
  );
};
