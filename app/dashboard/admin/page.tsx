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
  AlertCircle,
  Loader2
} from 'lucide-react';
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

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/activities?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRecentActivities();
    }
  }, [token, fetchRecentActivities]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}! Manage and monitor the WasteNexus platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">2,547</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12% from last month</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">New Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">87</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">↓ 3% from last week</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Actions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">5 require attention</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">89</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 5% from last month</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Access
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mb-12">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Latest actions across the platform
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-sm"
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
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">
                    <p>{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={fetchRecentActivities}
                    >
                      Retry
                    </Button>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No recent activities</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
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
