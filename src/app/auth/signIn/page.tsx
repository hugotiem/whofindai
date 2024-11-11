import { Metadata } from 'next';
import { SignInForm } from './sign-in-form';


export const metadata: Metadata = {
  title: 'WinAnyCall.com - Log In',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function Login({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <main className="h-dvh">
      <SignInForm
        redirect_path={params['redirect_path'] as string | undefined}
      />
    </main>
  );
}
