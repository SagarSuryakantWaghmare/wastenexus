"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 py-8 sm:py-12 mt-12 sm:mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">

          {/* Logo & Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/assets/logo/recycle-symbol.png"
                alt="WasteNexus Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">WasteNexus</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center sm:text-left">
              &copy; {currentYear} WasteNexus. All rights reserved.
            </p>
          </div>

          {/* If NOT signed in → Show CTAs */}
          {!user && (
            <>
              {/* Get Started Links */}
              <div className="flex flex-col items-center sm:items-start">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Get Started</h3>
                <div className="flex flex-col gap-2 items-center sm:items-start">
                  <Link href="/auth/signin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Sign Up
                  </Link>
                  <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    About Us
                  </Link>
                </div>
              </div>

              {/* Join As Links */}
              <div className="flex flex-col items-center sm:items-start">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Join As</h3>
                <div className="flex flex-col gap-2 items-center sm:items-start">
                  <Link href="/auth/signup?role=client" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Client
                  </Link>
                  <Link href="/auth/signup?role=worker" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Worker
                  </Link>
                  <Link href="/auth/signup?role=champion" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Champion
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* If signed in → Show motivational message + quote card */}
          {user && (
            <div className="flex flex-col items-start p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 justify-self-center sm:justify-self-end gap-3">
              <div>
                <h3 className="text-base font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  You&apos;re Already Creating Impact 🌱
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left leading-relaxed">
                  Thank you for being part of the WasteNexus revolution.
                </p>
              </div>
            </div>
          )}

          {
            user && (
              <div className="w-full bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-700 rounded-md p-3">
                <blockquote className="text-sm italic text-gray-700 dark:text-gray-300 mb-2">
                  “Let’s make the future green — every small action adds up.”
                </blockquote>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Share the site with others or inspire the community.</p>
                  <button
                    type="button"
                    onClick={async () => {
                      const url = 'https://wastenexus.vercel.app/';
                      try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          await navigator.clipboard.writeText(url);
                        } else {
                          const textarea = document.createElement('textarea');
                          textarea.value = url;
                          document.body.appendChild(textarea);
                          textarea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textarea);
                        }
                        toast.success('Link copied to clipboard');
                      } catch (err) {
                        console.error('Copy failed', err);
                        toast.error('Failed to copy link');
                      }
                    }}
                    aria-label="Copy WasteNexus link"
                    title="Copy WasteNexus link"
                    className="ml-3 inline-block text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md"
                  >
                    Share
                  </button>
                </div>
              </div>
            )
          }

        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 text-center">
            Transforming waste into opportunity. Together for a sustainable future.
          </p>
        </div>

      </div>
    </footer>
  );
}
