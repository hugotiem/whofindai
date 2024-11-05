import type { Metadata } from 'next';
import '../globals.css';
import { loadSession } from '@/lib/firebase/session';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Search Who AI - Sign up',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await loadSession();

  if (session) return redirect('/');
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
