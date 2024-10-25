import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { loadSession } from '@/lib/firebase/session';
import { redirect } from 'next/navigation';

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900'
// });
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900'
// });

export const metadata: Metadata = {
  title: 'Search Who AI - Login',
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
