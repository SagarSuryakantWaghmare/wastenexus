'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, LogOut, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  // AnimatedThemeToggler manages theme toggling and animation on its own
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400 text-2xl gap-3" />
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200">
              Waste Nexus
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Link */}
              <Link
                href={
                  user.role === 'client' ? '/dashboard/client' :
                  user.role === 'worker' ? '/dashboard/worker' :
                  user.role === 'admin' ? '/dashboard/admin' :
                  user.role === 'champion' ? '/dashboard/champion' :
                  '/dashboard/client'
                }
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 font-medium px-2.5 py-1 capitalize">
                  {user.role}
                </Badge>
              </div>

              {user.role === 'client' && user.totalPoints !== undefined && (
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 border border-green-300 dark:border-green-700 shadow-sm">
                  <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">
                    {user.totalPoints} pts
                  </span>
                </div>
              )}

              {/* Theme Toggle (animated) */}
              <AnimatedThemeToggler
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md p-2"
                aria-label="Toggle theme"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300 transition-all duration-200 font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Theme Toggle for non-logged-in users */}
              <AnimatedThemeToggler
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md p-2"
                aria-label="Toggle theme"
              />
              
              <Button
                variant="outline"
                className="border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-all duration-200"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => router.push('/auth/signup')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}