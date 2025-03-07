'use client';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signUpWithEmail } from '@/lib/supabase/auth';
import { useFormState } from 'react-dom';

export const SignUpForm = () => {
  const initialState = {
    message: ''
  };

  const [, formAction] = useFormState(signUpWithEmail, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col justify-center items-center mx-auto max-w-[300px] w-full space-y-3"
    >
      <Input
        name="email"
        type="email"
        placeholder="Email"
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
      />
      <Button
        size="sm"
        className="w-full"
        variant="secondary"
        type="submit"
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
    </form>
  );
};
