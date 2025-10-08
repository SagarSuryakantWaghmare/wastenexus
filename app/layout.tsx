
'use client';
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google';
import './gloabal.css';

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  childern,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex h-screen overflow-hidden">
          {/* header */}
          <div className="flex flex-1">
            {/* <Sidebar/> */}
            <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
              {childern}
            </main>
          </div>

        </div>
        <Toaster />
      </body>
    </html>
  )
}