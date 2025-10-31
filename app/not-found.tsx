'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, MapPin, Package, Award } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Oops! The page you&apos;re looking for seems to have been recycled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Link href="/">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Home className="w-4 h-4" />
                Home Page
              </Button>
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/marketplace">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Marketplace</div>
                    <div className="text-xs text-gray-500">Buy & sell sustainably</div>
                  </div>
                </Button>
              </Link>
              <Link href="/rewards">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Rewards</div>
                    <div className="text-xs text-gray-500">Track your points</div>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/client/report-waste">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Report Waste</div>
                    <div className="text-xs text-gray-500">Report & earn rewards</div>
                  </div>
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                  <Search className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Sign In</div>
                    <div className="text-xs text-gray-500">Access your account</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>Need help? Contact us at <a href="mailto:support@wastenexus.com" className="text-green-600 hover:underline">support@wastenexus.com</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
