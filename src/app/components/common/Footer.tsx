import Link from "next/link";
import { Button } from "@/components/ui/button"; // ShadCN Button

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Logo and description */}
          <div className="flex flex-col space-y-2">
            <span className="text-2xl font-bold text-green-700">WastePulse</span>
            <p className="text-sm max-w-xs">
              Smart waste management system for cleaner, greener, and sustainable cities. Join us to make a difference!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/" className="hover:text-green-700 font-medium">Home</Link>
            <Link href="/about" className="hover:text-green-700 font-medium">About</Link>
            <Link href="/features" className="hover:text-green-700 font-medium">Features</Link>
            <Link href="/contact" className="hover:text-green-700 font-medium">Contact</Link>
          </div>

          {/* Newsletter / Action */}
          <div className="flex flex-col space-y-2">
            <span className="font-medium">Join our newsletter</span>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-green-700 focus:border-green-700 outline-none"
              />
              <Button variant="default">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-6 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
          <span>© 2025 WastePulse. All rights reserved.</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="#" className="hover:text-green-700">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-700">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
