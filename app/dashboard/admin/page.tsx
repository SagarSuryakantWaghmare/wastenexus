"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Users, 
  BarChart3,
  FileText,
  Award,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import Link from 'next/link';

interface Activity {
  id: string;
  action: string;
  type: string;
  details: string;
  user: string;
  time: string;
  timestamp: string;
}

interface DashboardStats {
  totalUsers: { count: number; growth: number; isPositive: boolean };
  newReports: { count: number; growth: number; isPositive: boolean };
  pendingActions: { count: number; urgent: number };
  totalEvents: { count: number; growth: number; isPositive: boolean };
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/admin/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/activities?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.data);
      }

      if (!statsResponse.ok && !activitiesResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  // Removed unused getActivityIcon function

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'marketplace':
        return 'bg-blue-500';
      case 'user':
        return 'bg-purple-500';
      case 'report':
        return 'bg-green-500';
      case 'event':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const adminModules = [
    {
      title: 'Marketplace Management',
      description: 'Review and approve marketplace listings',
      icon: ShoppingBag,
      href: '/dashboard/admin/marketplace',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-900/30',
      stats: 'Pending reviews',
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/dashboard/admin/users',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-900/30',
      stats: 'Active users',
    },
    {
      title: 'Analytics & Reports',
      description: 'View platform statistics and insights',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-900/30',
      stats: 'Reports available',
    },
    {
      title: 'Waste Reports',
      description: 'Monitor waste collection reports',
      icon: FileText,
      href: '/dashboard/admin/reports',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-900/30',
      stats: 'New reports',
    },
    {
      title: 'Events Management',
      description: 'Manage cleanup events and activities',
      icon: Award,
      href: '/dashboard/admin/events',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-900/30',
      stats: 'Upcoming events',
    },
    {
      title: 'Jobs Management',
      description: 'Review and verify job postings',
      icon: Briefcase,
      href: '/dashboard/admin/jobs',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-900/30',
      stats: 'Pending jobs',
    },
    {
      title: 'Worker Applications',
      description: 'Review and approve worker registrations',
      icon: Users,
      href: '/dashboard/admin/workers',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-900/30',
      stats: 'Pending applications',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}! Manage and monitor the WasteNexus platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading && !stats ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                      </div>
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse">
                        <div className="w-6 h-6"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Users</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.totalUsers.count.toLocaleString() || 0}</p>
                      <div className={`flex items-center text-sm font-medium ${stats?.totalUsers.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className="mr-1">{stats?.totalUsers.isPositive ? '+' : '-'}{Math.abs(stats?.totalUsers.growth || 0)}%</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={stats?.totalUsers.isPositive ? "M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" : "M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z"} clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className={`font-medium ${stats?.totalUsers.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stats?.totalUsers.isPositive ? '+' : '-'}{Math.floor((stats?.totalUsers.count || 0) * (stats?.totalUsers.growth || 0) / 100)}
                        </span> from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Reports</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.newReports.count.toLocaleString() || 0}</p>
                      <div className={`flex items-center text-sm font-medium ${stats?.newReports.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className="mr-1">{stats?.newReports.isPositive ? '+' : '-'}{Math.abs(stats?.newReports.growth || 0)}%</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={stats?.newReports.isPositive ? "M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" : "M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z"} clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className={`font-medium ${stats?.newReports.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stats?.newReports.isPositive ? '+' : '-'}{Math.floor((stats?.newReports.count || 0) * (stats?.newReports.growth || 0) / 100)}
                        </span> from last week
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Actions</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.pendingActions.count || 0}</p>
                      <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        <span className="mr-1">⚠</span>
                        <span>{stats?.pendingActions.urgent || 0} urgent</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats?.pendingActions.urgent || 0}</span> require immediate attention
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Events</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.totalEvents.count || 0}</p>
                      <div className={`flex items-center text-sm font-medium ${stats?.totalEvents.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className="mr-1">{stats?.totalEvents.isPositive ? '+' : '-'}{Math.abs(stats?.totalEvents.growth || 0)}%</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={stats?.totalEvents.isPositive ? "M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" : "M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z"} clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className={`font-medium ${stats?.totalEvents.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stats?.totalEvents.isPositive ? '+' : '-'}{Math.floor((stats?.totalEvents.count || 0) * (stats?.totalEvents.growth || 0) / 100)}
                        </span> from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Admin Modules */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Quick Access
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminModules.map((module, index) => (
              <Link href={module.href} key={index} className="group block h-full">
                <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600">
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4`}>
                      <module.icon className={`w-6 h-6 ${
                        module.color.includes('blue') ? 'text-blue-600 dark:text-blue-400' :
                        module.color.includes('purple') ? 'text-purple-600 dark:text-purple-400' :
                        module.color.includes('green') && !module.color.includes('emerald') ? 'text-green-600 dark:text-green-400' :
                        module.color.includes('emerald') ? 'text-emerald-600 dark:text-emerald-400' :
                        module.color.includes('pink') ? 'text-pink-600 dark:text-pink-400' :
                        module.color.includes('orange') ? 'text-orange-600 dark:text-orange-400' :
                        'text-teal-600 dark:text-teal-400'
                      }`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                      View {module.stats} →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8 sm:mb-12">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Latest actions across the platform
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs sm:text-sm w-full sm:w-auto"
                  onClick={() => window.location.href = '/dashboard/admin/activity'}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <div className="flex justify-center items-center p-6">
                    <LoaderCircle size="md" />
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">
                    <p className="text-sm sm:text-base">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={fetchDashboardData}
                    >
                      Retry
                    </Button>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm sm:text-base">No recent activities</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getActivityColor(activity.type)}`} />
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
