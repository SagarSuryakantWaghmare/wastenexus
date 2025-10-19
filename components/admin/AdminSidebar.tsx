'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProfileModal from '../ProfileModal';
import UserAvatar from '../UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingBag,
  Users,
  BarChart3,
  FileText,
  Award,
  Menu,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

interface AdminSidebarProps {
  userName?: string;
}

const adminRoutes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard/admin',
    color: 'text-sky-500',
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    href: '/dashboard/admin/marketplace',
    color: 'text-blue-500',
  },
  {
    label: 'User Management',
    icon: Users,
    href: '/dashboard/admin/users',
    color: 'text-purple-500',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/admin/analytics',
    color: 'text-green-500',
  },
  {
    label: 'Waste Reports',
    icon: FileText,
    href: '/dashboard/admin/reports',
    color: 'text-orange-500',
  },
  {
    label: 'Events',
    icon: Award,
    href: '/dashboard/admin/events',
    color: 'text-pink-500',
  },
  {
    label: 'Jobs Management',
    icon: Briefcase,
    href: '/dashboard/admin/jobs',
    color: 'text-teal-500',
  },
];

export function AdminSidebar({ userName = 'Admin' }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 dark:border-gray-800">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                WasteNexus
              </h1>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-300">Admin Panel</p>
            </div>
          )}
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-700 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <UserAvatar 
                name={user?.name || userName} 
                profileImage={user?.profileImage}
                size="md"
                className="ring-2 ring-green-400"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || userName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            {/* Profile Modal Trigger */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
            >
              Profile
            </button>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1 px-3">
            {adminRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all',
                    pathname === route.href
                      ? 'bg-white/10 dark:bg-white/5 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 dark:hover:bg-white/3 hover:text-white'
                  )}
                >
                  <route.icon className={cn('w-5 h-5', route.color)} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{route.label}</span>
                  )}
                  {pathname === route.href && !collapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto p-4 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
            <AnimatedThemeToggler
              className="text-gray-300 hover:text-white transition-colors h-5 w-5"
              aria-label="Toggle theme"
            />
            {!collapsed && <span className="text-sm font-medium">Toggle Theme</span>}
          </div>
          <button
            type="button"
            className="flex items-center gap-3 p-2 rounded-md bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-white transition-colors w-full"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
              }
            }}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 bg-gray-900 dark:bg-gray-950 text-white hover:bg-gray-800 dark:hover:bg-gray-900"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white border-gray-700 dark:border-gray-800">
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-700 dark:border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              WasteNexus
            </h1>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>

          {/* Mobile User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <UserAvatar 
                name={user?.name || userName} 
                profileImage={user?.profileImage}
                size="md"
                className="ring-2 ring-green-400"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || userName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            {/* Profile Modal Trigger (Mobile) */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
            >
              Profile
            </button>
          </div>

          {/* Mobile Navigation */}
          <ScrollArea className="h-[calc(100vh-200px)] py-4">
            <div className="space-y-1 px-3">
              {adminRoutes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all',
                      pathname === route.href
                        ? 'bg-white/10 dark:bg-white/5 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-white/5 dark:hover:bg-white/3 hover:text-white'
                    )}
                  >
                    <route.icon className={cn('w-5 h-5', route.color)} />
                    <span className="text-sm font-medium">{route.label}</span>
                    {pathname === route.href && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>

          {/* Mobile Footer */}
          <div className="absolute bottom-0 w-full p-3 border-t border-gray-700 dark:border-gray-800">
            <button
              type="button"
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-white transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/auth/signin';
                }
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
      {/* Profile Modal (shared for desktop & mobile) */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
