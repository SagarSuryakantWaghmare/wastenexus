'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white">
            Something Went Wrong
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. An unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error.message && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              onClick={reset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>
              If this problem persists, please contact support at{' '}
              <a href="mailto:support@wastenexus.com" className="text-green-600 hover:underline">
                support@wastenexus.com
              </a>
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-gray-400">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
