'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Leaf, FilePlus2, Users2, CalendarDays, User2, Briefcase } from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (user && user.role !== 'client') {
      router.push('/dashboard/champion');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 dark:text-green-400 animate-pulse mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar: Profile Info */}
        <aside className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-green-100 dark:border-gray-700 p-6 flex flex-col items-center h-fit transition-colors duration-300">
          <div className="flex flex-col items-center gap-2">
            {/* Avatar */}
            {/* If you add avatar support, use Next.js <Image> here. For now, fallback to icon only. */}
            <User2 className="h-20 w-20 rounded-full text-green-400 dark:text-green-500 bg-green-100 dark:bg-green-900/30 p-4 mb-2" />
            <h2 className="text-2xl font-bold text-green-700 dark:text-gray-100">{user?.name || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">{user?.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">Role: {user?.role}</span>
              {user?.totalPoints !== undefined && (
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">Points: {user.totalPoints}</span>
              )}
            </div>
          </div>
        </aside>
        {/* Main Dashboard Actions */}
        <section className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-green-100 dark:border-gray-700 p-6 sm:p-12 flex flex-col items-center transition-colors duration-300">
          <div className="flex flex-col items-center mb-8">
            <Leaf className="h-14 w-14 text-green-600 dark:text-green-400 mb-2 animate-pulse" />
            <h1 className="text-4xl font-extrabold text-green-700 dark:text-gray-100 mb-1 text-center tracking-tight">Client Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center text-lg max-w-2xl">Welcome! Manage your waste reports, view the leaderboard, and join upcoming events to make a positive impact in your community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-2">
            <button
              className="flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => router.push('/dashboard/client/report-waste')}
            >
              <FilePlus2 className="h-10 w-10" />
              Report Waste
            </button>
            <button
              className="flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => router.push('/dashboard/client/create-job')}
            >
              <Briefcase className="h-10 w-10" />
              Post a Job
            </button>
            <button
              className="flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => router.push('/dashboard/client/leaderboard')}
            >
              <Users2 className="h-10 w-10" />
              Leaderboard
            </button>
            <button
              className="flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => router.push('/dashboard/client/new-event')}
            >
              <CalendarDays className="h-10 w-10" />
              New Event
            </button>
            <button
              className="flex flex-col items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => router.push('/marketplace')}
            >
              <Users2 className="h-10 w-10" />
              Marketplace
            </button>
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
