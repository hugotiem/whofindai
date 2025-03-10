import { Metadata } from 'next';
import { SignInForm } from './sign-in-form';
import Link from 'next/link';
import GoogleButton from '@/components/custom/buttons/GoogleButton';
import { signInWithGoogle } from '@/lib/supabase/auth';

export const metadata: Metadata = {
  title: 'Leedinsight - Log In',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function Login() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center mx-auto max-w-[300px] w-full space-y-3">
      <SignInForm />
      <form action={signInWithGoogle} className="w-full">
        <GoogleButton />
      </form>
      <div className="text-sm">
        <span className="opacity-50">You don&apos;t have an account? </span>
        <Link href="/auth/signUp" className="underline opacity-80">
          Sign up
        </Link>
      </div>
    </main>
  );
}
