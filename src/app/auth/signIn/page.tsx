import { SignInForm } from './sign-in-form';

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
