'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackButton } from '@/components/ui/back-button';
import { RewardsBreakdown } from '@/components/RewardsBreakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Trophy, Gift, Target } from 'lucide-react';
import { PageLoader } from '@/components/ui/loader';

interface UserStats {
  totalPoints: number;
  rank: number;
  totalUsers: number;
  reportsCount: number;
  jobsCount: number;
  marketplaceItemsCount: number;
  eventsJoined: number;
}

export default function RewardsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (user && user.role !== 'client') {
      router.push('/dashboard/champion');
    }
  }, [user, isLoading, router]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // Fetch user stats - you can create a dedicated API for this
      setStats({
        totalPoints: user?.totalPoints || 0,
        rank: 1,
        totalUsers: 100,
        reportsCount: 0,
        jobsCount: 0,
        marketplaceItemsCount: 0,
        eventsJoined: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <PageLoader message="Loading rewards..." />
      </div>
    );
  }

  if (!user) return null;

  const getNextMilestone = (points: number) => {
    const milestones = [100, 250, 500, 1000, 2500, 5000, 10000];
    return milestones.find(m => m > points) || 10000;
  };

  const nextMilestone = getNextMilestone(stats?.totalPoints || 0);
  const progress = ((stats?.totalPoints || 0) / nextMilestone) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <BackButton href="/dashboard/client" label="Back to Dashboard" />

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Rewards 🎯
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track your points and see how to earn more!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium opacity-90">Total Points</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{stats?.totalPoints || 0}</p>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Your Rank</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">#{stats?.rank || '-'}</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Activities</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {(stats?.reportsCount || 0) + (stats?.jobsCount || 0) + (stats?.marketplaceItemsCount || 0)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Events Joined</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats?.eventsJoined || 0}</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Milestone */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              Next Milestone: {nextMilestone} Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {stats?.totalPoints || 0} / {nextMilestone}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                🎯 {nextMilestone - (stats?.totalPoints || 0)} points until next milestone
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Breakdown */}
        <RewardsBreakdown />
      </main>
      <Footer />
    </div>
  );
}
