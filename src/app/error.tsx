'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-red-600">
          Something went wrong
        </h1>
        <div className="p-4 bg-red-50 rounded-md text-left">
          <p className="text-red-800 font-medium">
            Error: {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-sm text-red-600 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. You can try refreshing the page or
          return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={reset}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
