'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, LogOut, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md backdrop-blur-sm bg-opacity-95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-8 w-8 text-green-600" />
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-green-700 hover:text-green-800 transition-colors duration-200">
              Waste Nexus
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium px-2.5 py-1">
                  {user.role}
                </Badge>
              </div>

              {user.role === 'client' && (
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 border border-green-300 shadow-sm">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">
                    {user.totalPoints} pts
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-200 font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 font-medium transition-all duration-200"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
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