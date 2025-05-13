'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/lib/supabase/auth';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { Lock, Mail, Info } from 'lucide-react';

export const SignUpForm = () => {
  const initialState = {
    message: ''
  };

  const [state, formAction] = useFormState(signUpWithEmail, initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setLoading(true);
    formAction(formData);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-muted-foreground">
          Join LeedInsight to power up your sales
        </p>
      </div>

      {state.message && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {state.message}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col w-full space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              className="pl-10 bg-muted/50"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="pl-10 bg-muted/50"
              required
            />
            <p className="text-xs text-muted-foreground mt-1 ml-1">
              Must be at least 8 characters
            </p>
          </div>

          <div className="relative">
            <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="pl-10 bg-muted/50"
              required
            />
          </div>
        </div>

        <Button
          size="lg"
          variant="default"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
};
