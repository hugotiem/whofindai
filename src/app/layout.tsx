import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ProgressBarProvider } from '@/providers/progressBarProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/custom/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Search Who AI - Know Your Prospects Like Never Before',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProvider>
            {children}
            <Toaster />
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
