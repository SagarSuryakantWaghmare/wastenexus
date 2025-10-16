'use client';

import { Leaf } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-green-200">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold text-green-700">Waste Nexus</span>
          </div>
          <p className="text-gray-600 text-sm max-w-md">
            Transforming waste into opportunity. Together for a sustainable future.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 text-sm font-medium">
            &copy; {currentYear} Waste Nexus. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8 text-sm">
            <a href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}