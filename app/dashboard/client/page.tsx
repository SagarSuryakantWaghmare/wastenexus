'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import UserAvatar from '@/components/UserAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FilePlus2, 
  CalendarDays, 
  Briefcase, 
  ShoppingBag, 
  TrendingUp, 
  Award,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { LoaderOne } from '@/components/ui/loader';
import { getRewardTier } from '@/lib/helpers';

interface DashboardStats {
  totalPoints: { count: number; growth: number; isPositive: boolean };
  userRank: { rank: number; total: number; change: number; isImproved: boolean };
  totalReports: { count: number; verified: number; growth: number; isPositive: boolean };
  activeJobs: { count: number; completed: number; growth: number; isPositive: boolean };
  totalWasteCollected: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user, isLoading, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    if (!token) return;

    try {
      setStatsLoading(true);
      const response = await fetch('/api/client/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token, fetchDashboardStats]);

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
          <LoaderOne />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      title: 'Report Waste',
      description: 'Submit new waste report',
      icon: FilePlus2,
      href: '/dashboard/client/report-waste',
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Post a Job',
      description: 'Create collection job',
      icon: Briefcase,
      href: '/dashboard/client/create-job',
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'My Rewards',
      description: 'Track points & earn more',
      icon: Award,
      href: '/dashboard/client/rewards',
      color: 'from-yellow-500 to-amber-600',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Leaderboard',
      description: 'View top contributors',
      icon: Award,
      href: '/dashboard/client/leaderboard',
      color: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Events',
      description: 'Join community events',
      icon: CalendarDays,
      href: '/dashboard/client/events',
      color: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Marketplace',
      description: 'Buy & sell items',
      icon: ShoppingBag,
      href: '/marketplace',
      color: 'from-indigo-500 to-blue-600',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Here&apos;s your environmental impact dashboard
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Total Points Card */}
            {statsLoading ? (
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-3 sm:h-4 bg-white/20 rounded animate-pulse w-16 sm:w-20"></div>
                      <div className="h-6 sm:h-8 bg-white/20 rounded animate-pulse w-12 sm:w-16"></div>
                      <div className="h-2 sm:h-3 bg-white/20 rounded animate-pulse w-20 sm:w-24"></div>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium opacity-90">Total Points</p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">{stats?.totalPoints.count.toLocaleString() || 0}</p>
                      <p className="text-xs mt-1 flex items-center gap-1">
                        {stats?.totalPoints.isPositive ? (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            <span>↑ {Math.abs(stats?.totalPoints.growth || 0)}% from last week</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            <span>↓ {Math.abs(stats?.totalPoints.growth || 0)}% from last week</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Rank Card */}
            {statsLoading ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg animate-pulse">
                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Rank</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        #{stats?.userRank.rank || 0}
                      </p>
                      <p className={`text-xs mt-1 ${stats?.userRank.isImproved ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {stats?.userRank.isImproved ? (
                          <>↑ Up {stats?.userRank.change} places</>
                        ) : (stats?.userRank.change || 0) < 0 ? (
                          <>↓ Down {Math.abs(stats?.userRank.change || 0)} places</>
                        ) : (
                          <>No change</>
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports Card */}
            {statsLoading ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg animate-pulse">
                      <FilePlus2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reports</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {stats?.totalReports.count || 0}
                      </p>
                      <p className={`text-xs mt-1 ${stats?.totalReports.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats?.totalReports.isPositive ? '↑' : '↓'} {Math.abs(stats?.totalReports.growth || 0)}% from last week
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FilePlus2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Jobs Card */}
            {statsLoading ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg animate-pulse">
                      <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {stats?.activeJobs.count || 0}
                      </p>
                      <p className={`text-xs mt-1 ${stats?.activeJobs.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats?.activeJobs.isPositive ? '↑' : '↓'} {Math.abs(stats?.activeJobs.growth || 0)}% from last week
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.href}
                className="group cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${action.iconBg}`}>
                      <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Profile Section */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Profile</h2>
            <div className="flex items-center gap-4">
              <UserAvatar
                name={user?.name || 'User'}
                profileImage={user?.profileImage}
                size="lg"
                className="ring-2 ring-green-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">
                    {user?.role}
                  </Badge>
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                    {user?.totalPoints || 0} points
                  </Badge>
                  {(() => {
                    const rewardTier = getRewardTier(user?.totalPoints || 0);
                    return (
                      <Badge className={`${rewardTier.color} bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold`}>
                        {rewardTier.badge} {rewardTier.tier}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
