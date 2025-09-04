"use client";

import * as React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // ShadCN Sheet
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Menu, X } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-700">
            WastePulse
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-700 font-medium">About</Link>
            <Link href="/features" className="text-gray-700 hover:text-green-700 font-medium">Features</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-700 font-medium">Contact</Link>
          </div>

          {/* Mobile Menu using Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-green-700">WastePulse</span>
                  <SheetTrigger asChild>
                    <Button variant="ghost">
                      <X size={24} />
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-700 font-medium">About</Link>
                  <Link href="/features" className="text-gray-700 hover:text-green-700 font-medium">Features</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-green-700 font-medium">Contact</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
