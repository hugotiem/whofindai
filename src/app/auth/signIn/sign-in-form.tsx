'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from '@/lib/supabase/auth';
import { useActionState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export const SignInForm = () => {
  const initialState = {
    message: ''
  };
  const [state, formAction] = useActionState(signInWithEmail, initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setLoading(true);
    formAction(formData);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
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
          </div>
        </div>

        <Button
          size="lg"
          variant="default"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};
