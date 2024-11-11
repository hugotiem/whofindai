import { Metadata } from 'next';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
  title: 'WinAnyCall.com - Sign up',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function SignUp({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <main className="h-dvh">
      <SignUpForm
        redirect_path={params['redirect_path'] as string | undefined}
      />
    </main>
  );
}
