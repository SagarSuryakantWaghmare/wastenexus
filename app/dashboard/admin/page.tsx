'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Users, 
  BarChart3,
  FileText,
  Award,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminModules = [
    {
      title: 'Marketplace Management',
      description: 'Review and approve marketplace listings',
      icon: ShoppingBag,
      href: '/dashboard/admin/marketplace',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      stats: 'Pending reviews',
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/dashboard/admin/users',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      stats: 'Active users',
    },
    {
      title: 'Analytics & Reports',
      description: 'View platform statistics and insights',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      stats: 'Reports available',
    },
    {
      title: 'Waste Reports',
      description: 'Monitor waste collection reports',
      icon: FileText,
      href: '/dashboard/admin/reports',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      stats: 'New reports',
    },
    {
      title: 'Events Management',
      description: 'Manage cleanup events and activities',
      icon: Award,
      href: '/dashboard/admin/events',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      stats: 'Upcoming events',
    },
    {
      title: 'Jobs Management',
      description: 'Review and verify job postings',
      icon: Briefcase,
      href: '/dashboard/admin/jobs',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      stats: 'Pending jobs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-green-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Manage and monitor the WasteNexus platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                  <p className="text-4xl font-bold">2,547</p>
                  <p className="text-blue-100 text-xs mt-1">↑ 12% from last month</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Active Listings</p>
                  <p className="text-4xl font-bold">342</p>
                  <p className="text-green-100 text-xs mt-1">↑ 8% from last month</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Waste Reports</p>
                  <p className="text-4xl font-bold">1,234</p>
                  <p className="text-purple-100 text-xs mt-1">↑ 15% from last month</p>
                </div>
                <FileText className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Total Events</p>
                  <p className="text-4xl font-bold">89</p>
                  <p className="text-orange-100 text-xs mt-1">↑ 5% from last month</p>
                </div>
                <Award className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Administration Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.href}
                  className={`${module.bgColor} border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={module.href}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white`}
                      >
                        Open Module
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New marketplace item submitted', time: '5 minutes ago', type: 'marketplace' },
                  { action: 'User registered', time: '12 minutes ago', type: 'user' },
                  { action: 'Waste report created', time: '25 minutes ago', type: 'report' },
                  { action: 'Event created by champion', time: '1 hour ago', type: 'event' },
                  { action: 'Marketplace item approved', time: '2 hours ago', type: 'marketplace' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'marketplace' ? 'bg-blue-500' :
                        activity.type === 'user' ? 'bg-purple-500' :
                        activity.type === 'report' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`} />
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
