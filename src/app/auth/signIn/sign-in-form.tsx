'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signInWithEmail } from '@/lib/supabase/auth';
import { useActionState } from 'react';

export const SignInForm = () => {
  const initialState = {
    message: ''
  };
  const [, formAction] = useActionState(signInWithEmail, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col justify-center items-center mx-auto max-w-[300px] w-full space-y-3"
    >
      <div className="flex flex-col justify-center items-center mx-auto max-w-[300px] w-full space-y-3">
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button
          size="sm"
          variant="secondary"
          type="submit"
          className="w-full"
          // onClick={(e) => {
          //   e.preventDefault();
          //   signInWithPassword(email, password, { redirect_path });
          // }}
        >
          Log in
        </Button>
        <div className="w-full">
          <Separator
            orientation="horizontal"
            className="flex flex-col items-center my-4"
          >
            <div className="translate-y-[-12px] bg-background w-min px-2">
              or
            </div>
          </Separator>
        </div>
      </div>
    </form>
  );
};
