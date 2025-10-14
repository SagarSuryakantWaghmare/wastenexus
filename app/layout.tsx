
'use client';
import { useEffect, useState } from "react";
import { Inter } from 'next/font/google';
import './globals.css';

import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import { getUserBalance, getUserByEmail } from "@/utils/db/action";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  useEffect(()=>{
    const fetchTotalEarnings=async()=>{
      try {
        const userEmail=localStorage.getItem('userEmail');
        if(userEmail){
          const user=await getUserByEmail(userEmail);
            if(user){
              const balance = await getUserBalance(user.id);
              setTotalEarnings(balance);
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
      <body className={`${inter.className} bg-gray-50`}>
        <Header onMenuClick={() => {}} totalEarnings={totalEarnings} />
        <main className="w-full pt-16">
          {children}
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}