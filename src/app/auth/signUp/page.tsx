import { SignUpForm } from './sign-up-form';

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
