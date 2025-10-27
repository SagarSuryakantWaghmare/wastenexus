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
import { LoaderOne } from '@/components/ui/loader';

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
        <div className="text-center">
          <LoaderOne />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading rewards...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <BackButton href="/dashboard/client" label="Back to Dashboard" />

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your points and see how to earn more!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Total Points</p>
                  <p className="text-3xl font-bold">{stats?.totalPoints || 0}</p>
                </div>
                <Award className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Your Rank</p>
                  <p className="text-3xl font-bold">#{stats?.rank || '-'}</p>
                </div>
                <Trophy className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Activities</p>
                  <p className="text-3xl font-bold">
                    {(stats?.reportsCount || 0) + (stats?.jobsCount || 0) + (stats?.marketplaceItemsCount || 0)}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Events Joined</p>
                  <p className="text-3xl font-bold">{stats?.eventsJoined || 0}</p>
                </div>
                <Gift className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Milestone */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              Next Milestone: {nextMilestone} Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {stats?.totalPoints || 0} / {nextMilestone}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nextMilestone - (stats?.totalPoints || 0)} points until next milestone
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
