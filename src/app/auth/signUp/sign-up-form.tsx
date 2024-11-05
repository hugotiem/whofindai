'use client';

import GoogleButton from '@/components/custom/buttons/GoogleButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signUpWithPassword } from '@/lib/firebase/auth';
import Link from 'next/link';
import { useState } from 'react';

interface SignUpFormProps {
  redirect_path?: string;
}

export const SignUpForm = ({ redirect_path }: SignUpFormProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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
      <Input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Confirm password"
      />
      <Button
        size="sm"
        className='w-full'
        variant='secondary'
        onClick={(e) => {
          e.preventDefault();
          if (password === confirmPassword) {
            signUpWithPassword(email, password, { redirect_path });
          }
        }}
      >
        Sign Up
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
        <span className="opacity-50">You already have an account? </span>
        <Link href="/auth/signIn" className="underline opacity-80">
          Log in
        </Link>
      </div>
    </div>
  );
};
