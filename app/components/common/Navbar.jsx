"use client";

import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Menu, X, Recycle, Leaf } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [];
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-green-200/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm">
              WN
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                WasteNexus
              </span>
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* No nav items shown */}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <SignInButton>
                <button className="inline-flex items-center justify-center rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50 hover:border-green-400 transition-all duration-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {role === 'government' && (
                <OrganizationSwitcher
                  afterCreateOrganizationUrl="/"
                  afterLeaveOrganizationUrl="/"
                  afterSelectOrganizationUrl="/"
                  afterSelectPersonalUrl="/"
                />
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-lg border-2 border-green-200 hover:border-green-300 transition-colors",
                    userButtonPopoverCard: "shadow-xl border-green-100",
                    userButtonPopoverActionButton: "hover:bg-green-50"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* No nav items shown */}
              <div className="pt-4 space-y-2">
                <SignedOut>
                  <SignInButton>
                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="px-3 py-2">
                    {role === 'government' && (
                      <OrganizationSwitcher
                        afterCreateOrganizationUrl="/"
                        afterLeaveOrganizationUrl="/"
                        afterSelectOrganizationUrl="/"
                        afterSelectPersonalUrl="/"
                      />
                    )}
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;