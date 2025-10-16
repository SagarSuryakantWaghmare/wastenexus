'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Leaf, FilePlus2, Users2, CalendarDays, User2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-pulse mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto px-2 sm:px-4 py-10 gap-8">
        {/* Sidebar: Profile Info */}
        <aside className="w-full md:w-1/3 bg-white rounded-3xl shadow-xl border border-green-100 p-6 flex flex-col items-center mb-8 md:mb-0">
          <div className="flex flex-col items-center gap-2">
            {/* Avatar */}
            {/* If you add avatar support, use Next.js <Image> here. For now, fallback to icon only. */}
            <User2 className="h-20 w-20 rounded-full text-green-400 bg-green-100 p-4 mb-2" />
            <h2 className="text-2xl font-bold text-green-700">{user?.name || 'User'}</h2>
            <p className="text-gray-500 text-base">{user?.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Role: {user?.role}</span>
              {user?.totalPoints !== undefined && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Points: {user.totalPoints}</span>
              )}
            </div>
          </div>
        </aside>
        {/* Main Dashboard Actions */}
        <section className="flex-1 bg-white rounded-3xl shadow-2xl border border-green-100 p-6 sm:p-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <Leaf className="h-14 w-14 text-green-600 mb-2 animate-pulse" />
            <h1 className="text-4xl font-extrabold text-green-700 mb-1 text-center tracking-tight">Client Dashboard</h1>
            <p className="text-gray-500 text-center text-lg max-w-2xl">Welcome! Manage your waste reports, view the leaderboard, and join upcoming events to make a positive impact in your community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-2">
            <button
              className="flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg px-8 py-8 font-semibold text-xl transition focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => router.push('/dashboard/client/report-waste')}
            >
              <FilePlus2 className="h-10 w-10" />
              Report Waste
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
          </div>
        </section>
      </main>
    </div>
  );
}
