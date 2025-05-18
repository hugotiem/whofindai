import { Metadata } from 'next';
import { SignInForm } from './sign-in-form';
import Link from 'next/link';
import GoogleButton from '@/components/custom/buttons/GoogleButton';
import { signInWithGoogle } from '@/lib/supabase/auth';
import { signInWithLinkedin } from '@/lib/supabase/auth';
import LinkedinButton from '@/components/custom/buttons/LinkedinButton';
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Leedinsight - Sign In',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function Login() {
  return (
    <main className="h-dvh flex items-center justify-center bg-gradient-to-b from-background to-muted/50">
      <div className="w-full max-w-md px-8 py-10 bg-background rounded-lg shadow-lg border border-border/50">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.svg" alt="Leedinsight" width={40} height={40} />
            <span className="text-2xl font-bold">LeedInsight</span>
          </Link>
        </div>

        <SignInForm />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground">
            or
          </span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <div className="space-y-3">
          <form action={signInWithGoogle} className="w-full">
            <GoogleButton />
          </form>
          <form action={signInWithLinkedin} className="w-full">
            <LinkedinButton />
          </form>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account?</span>{' '}
          <Link
            href="/auth/signUp"
            className="font-medium text-primary hover:underline"
          >
            Create one now
          </Link>
        </div>
      </div>
    </main>
  );
}
