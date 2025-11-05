'use client';

import { useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Trophy, ChevronDown, Menu, X, User, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserAvatar from './UserAvatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Image from 'next/image';

// Dynamic import for ProfileModal (code splitting)
const ProfileModal = lazy(() => import('./ProfileModal'));

// Dropdown menu using Radix UI primitives (or fallback to custom if not available)
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardLink = user?.role === 'client' ? '/dashboard/client' :
    user?.role === 'worker' ? '/dashboard/worker' :
    user?.role === 'admin' ? '/dashboard/admin' :
    user?.role === 'champion' ? '/dashboard/champion' :
    '/dashboard/client';

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900 shadow-lg backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
              <Image 
                src="/assets/logo/recycle-symbol.png" 
                alt="WasteNexus Logo" 
                width={28} 
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-300 dark:hover:to-emerald-300 transition-all duration-200">
              Waste Nexus
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <>
              {/* Desktop Menu - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Dashboard Link */}
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* Points for all roles */}
                {user.totalPoints !== undefined && user.role !== 'admin' && (
                  <Link 
                    href="/dashboard/client/rewards"
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 px-4 py-2 border-2 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      {user.totalPoints.toLocaleString()} pts
                    </span>
                  </Link>
                )}

                {/* Theme Toggle */}
                <AnimatedThemeToggler
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md p-2"
                  aria-label="Toggle theme"
                />

                {/* Account Dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label="Account menu"
                    >
                      <UserAvatar 
                        name={user.name} 
                        profileImage={user.profileImage}
                        size="sm"
                        className="ring-2 ring-green-500 dark:ring-green-400"
                      />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
                      <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 font-medium px-2.5 py-1 capitalize">
                        {user.role}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="min-w-[200px] rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50"
                  >
                    <DropdownMenu.Item
                      onSelect={() => setShowProfileModal(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer text-sm font-medium focus:outline-none"
                    >
                      <User className="h-4 w-4" />
                      <span>Your Account</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenu.Item
                      onSelect={logout}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer text-sm font-medium focus:outline-none"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Image 
                          src="/assets/logo/recycle-symbol.png" 
                          alt="WasteNexus Logo" 
                          width={24} 
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                        <span className="text-lg font-bold text-green-700 dark:text-green-400">Waste Nexus</span>
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    {/* User Info */}
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-3 mb-2">
                        <UserAvatar 
                          name={user.name} 
                          profileImage={user.profileImage}
                          size="md"
                          className="ring-2 ring-green-500 dark:ring-green-400"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 capitalize">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex-1 space-y-3">
                      <SheetClose asChild>
                        <Link
                          href={dashboardLink}
                          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </SheetClose>

                      {user.totalPoints !== undefined && user.role !== 'admin' && (
                        <SheetClose asChild>
                          <Link
                            href="/dashboard/client/rewards"
                            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 hover:from-amber-200 hover:to-yellow-200 dark:hover:from-amber-900/60 dark:hover:to-yellow-900/60 border-2 border-amber-300 dark:border-amber-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                          >
                            <div className="flex items-center gap-3">
                              <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              <span className="text-amber-700 dark:text-amber-300">Rewards</span>
                            </div>
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                              {user.totalPoints.toLocaleString()} pts
                            </span>
                          </Link>
                        </SheetClose>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200 font-medium"
                      >
                        <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Your Account
                      </button>

                      <div className="px-4 py-3 flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                        <AnimatedThemeToggler
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md p-2"
                          aria-label="Toggle theme"
                        />
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Desktop - Not logged in */}
              <div className="hidden sm:flex items-center gap-4">
                <AnimatedThemeToggler
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg p-2"
                  aria-label="Toggle theme"
                />
                <Button
                  variant="outline"
                  className="border-2 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 font-semibold transition-all duration-200 rounded-lg px-6"
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-6"
                  onClick={() => router.push('/auth/signup')}
                >
                  Sign Up
                </Button>
              </div>

              {/* Mobile - Not logged in */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Image 
                          src="/assets/logo/recycle-symbol.png" 
                          alt="WasteNexus Logo" 
                          width={24} 
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                        <span className="text-lg font-bold text-green-700 dark:text-green-400">Waste Nexus</span>
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                        <AnimatedThemeToggler
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-md p-2"
                          aria-label="Toggle theme"
                        />
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-all duration-200"
                        onClick={() => {
                          router.push('/auth/signin');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => {
                          router.push('/auth/signup');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {user && showProfileModal && (
        <Suspense fallback={null}>
          <ProfileModal 
            isOpen={showProfileModal} 
            onClose={() => setShowProfileModal(false)} 
          />
        </Suspense>
      )}
    </nav>
  );
}