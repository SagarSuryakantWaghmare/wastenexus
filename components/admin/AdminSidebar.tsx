'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
} from 'lucide-react';

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
];

export function AdminSidebar({ userName = 'Admin' }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                WasteNexus
              </h1>
              <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
            </div>
          )}
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
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
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
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
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
        <div className="p-3 border-t border-gray-700">
          <Link href="/auth/signin">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-all">
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 bg-gray-900 text-white hover:bg-gray-800"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white border-gray-700">
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              WasteNexus
            </h1>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>

          {/* Mobile User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
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
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
          <div className="absolute bottom-0 w-full p-3 border-t border-gray-700">
            <Link href="/auth/signin">
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-all">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </div>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
