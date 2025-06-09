import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/custom/theme-provider';
import { AnalyticsProvider } from '@/providers/analyticsProvider';
import Script from 'next/script';
// import { Squares } from '@/components/ui/squares-background';
// import { memo } from 'react';

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
  title: 'Leedinsight - Know Your Prospects Like Never Before',
  description:
    'Elevate your sales game with AI-powered insights that boost your meetings.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
    shortcut: '/icon.svg'
  },
  openGraph: {
    title: 'Leedinsight - Know Your Prospects Like Never Before',
    description:
      'Elevate your sales game with AI-powered insights that boost your meetings.',
    url: process.env.BASE_URL,
    locale: 'en-US',
    type: 'website'
  }
};

// const MemoizedSquares = memo(Squares)

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {/* <div className="fixed inset-0 z-0 will-change-transform">
        <MemoizedSquares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#2a2b34"
          hoverFillColor="#1a1b24"
        />
      </div> */}
        <AnalyticsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AnalyticsProvider>
        <footer>
          <Script id="linkedin-partner-setup" strategy="afterInteractive">
            {`
            _linkedin_partner_id = "7186458";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
          </Script>
          <Script id="linkedin-tracking" strategy="afterInteractive">
            {`
            (function(l) {
              if (!l){
                window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]
              }
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";
              b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src="https://px.ads.linkedin.com/collect/?pid=7186458&fmt=gif"
            />
          </noscript>
        </footer>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_SA_MEASUREMENT_ID!} />
    </html>
  );
}
