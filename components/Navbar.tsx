'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, LogOut, Trophy } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-green-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <Link href="/" className="text-2xl font-bold text-green-700">
              Waste Nexus
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {user.role}
                </Badge>
              </div>

              {user.role === 'client' && (
                <div className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1 border border-green-200">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {user.totalPoints} pts
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
