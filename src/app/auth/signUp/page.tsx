import { Metadata } from 'next';
import { SignUpForm } from './sign-up-form';
import GoogleButton from '@/components/custom/buttons/GoogleButton';
import Link from 'next/link';
import { signInWithGoogle } from '@/lib/supabase/auth';

export const metadata: Metadata = {
  title: 'WinAnyCall.com - Sign up',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function SignUp() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center mx-auto max-w-[300px] w-full space-y-3">
      <SignUpForm />
      <form action={signInWithGoogle} className="w-full">
        <GoogleButton />
      </form>
      <div className="text-sm">
        <span className="opacity-50">You already have an account? </span>
        <Link href="/auth/signIn" className="underline opacity-80">
          Log in
        </Link>
      </div>
    </main>
  );
}
