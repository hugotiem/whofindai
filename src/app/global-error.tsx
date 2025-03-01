'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold text-red-600">Critical Error</h1>
            <div className="p-4 bg-red-50 rounded-md text-left">
              <p className="text-red-800 font-medium">
                Error: {error.message || 'A critical error occurred'}
              </p>
              {error.digest && (
                <p className="text-sm text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. The application encountered a
              critical error. Please try refreshing the page.
            </p>
            <div className="flex justify-center pt-4">
              <Button
                onClick={reset}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh Application
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
