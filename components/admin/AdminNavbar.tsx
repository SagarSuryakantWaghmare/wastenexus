'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu button */}
        <div className="flex items-center gap-3">
          {/* Menu button for mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Right side - Logo and Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight select-none">
              WasteNexus
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
