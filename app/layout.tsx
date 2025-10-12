
'use client';
import { useEffect, useState } from "react";
import { Inter } from 'next/font/google';
import './globals.css';

import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getAvailableRewards } from "@/utils/db/action";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings] = useState(0);
  useEffect(()=>{
    const fetchTotalEarnings=async()=>{
      try {
        const userEmail=localStorage.getItem('userEmail');
        if(userEmail){
          const user=await getUserByEmail(userEmail);
            if(user){
              const availableRewards=(await getAvailableRewards(
                user.id))as any;
              setTotalEarnings(availableRewards);

            }
          
        }
      } catch (error) {
        console.log("Error in the fetching total earnings of user",error);
      }
    };
    fetchTotalEarnings();
  },[]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} totalEarnings={totalEarnings} />
        <div className="min-h-screen flex h-screen">
          {/* header */}
          <div className="flex flex-1">
            <Sidebar open={sidebarOpen}/>
            <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
              {children}
            </main>
          </div>

        </div>
        <Toaster />
      </body>
    </html>
  )
}