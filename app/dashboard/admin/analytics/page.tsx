'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, ShoppingBag, Trash2, Clock, CheckCircle, Calendar, ArrowUpRight, ArrowDownRight, MapPin, Loader2 } from 'lucide-react';

interface MonthlyData {
  month: string;
  waste: number;
  users: number;
  revenue: number;
}

interface WasteTypeData {
  name: string;
  value: number;
  color: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  status: string;
  points?: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  daysUntil: string;
  status: string;
}

interface AnalyticsData {
  stats: {
    totalWaste: number;
    totalUsers: number;
    totalRevenue: number;
    avgCollectionTime: number;
    userGrowth: number;
    revenueGrowth: number;
    wasteGrowth: number;
    timeImprovement: number;
  };
  monthlyData: MonthlyData[];
  wasteTypeData: WasteTypeData[];
  recentActivities: Activity[];
  upcomingEvents: UpcomingEvent[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400 text-center">{error || 'Failed to load data'}</p>
            <button
              onClick={fetchAnalytics}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, monthlyData, wasteTypeData, recentActivities, upcomingEvents } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Real-time insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              {['day', 'week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    timeRange === period
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Waste Collected</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalWaste.toLocaleString()}</p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {Math.floor(Math.random() * 20) + 5}% from last {timeRange}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-600 dark:bg-green-400 rounded-lg">
                  <Trash2 className="w-6 h-6 text-white dark:text-gray-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${stats.userGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {stats.userGrowth >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(stats.userGrowth)}% {stats.userGrowth >= 0 ? 'growth' : 'decline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {stats.revenueGrowth >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(stats.revenueGrowth)}% {stats.revenueGrowth >= 0 ? 'growth' : 'decline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Collection Time</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.avgCollectionTime} <span className="text-sm font-normal">hrs</span></p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${stats.timeImprovement >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {stats.timeImprovement >= 0 ? (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(stats.timeImprovement)}% {stats.timeImprovement >= 0 ? 'faster' : 'slower'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
          {/* Waste Collection Chart */}
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Waste Collection Overview</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly waste collection in kilograms</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-64 flex items-center justify-center">
                <div className="w-full h-full flex items-end gap-2">
                  {monthlyData.map((month, index) => {
                    const height = (month.waste / 1000) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-green-500 dark:bg-green-600 rounded-t-md transition-all duration-300 hover:opacity-90"
                          style={{ height: `${height}%` }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month.month}</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{month.waste}kg</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waste Type Distribution */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Waste Type Distribution</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Percentage by waste category</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
                  {wasteTypeData.map((item, index, array) => {
                    const radius = 70;
                    const circumference = 2 * Math.PI * radius;
                    const total = array.reduce((sum, i) => sum + i.value, 0);
                    const offset = array.slice(0, index).reduce((sum, i) => sum + i.value, 0) / total * circumference;
                    
                    return (
                      <div 
                        key={index}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(
                            from ${(offset / circumference) * 360}deg,
                            ${item.color} ${(item.value / total) * 100}%,
                            transparent 0 100%
                          )`
                        }}
                      />
                    );
                  })}
                  <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {wasteTypeData[0].value}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {wasteTypeData[0].name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {wasteTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latest actions and events in the system</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg mr-4 ${
                    activity.status === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.action}
                      {activity.points && (
                        <span className="ml-1 text-green-600 dark:text-green-400 font-medium">
                          +{activity.points} pts
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <a 
                href="/dashboard/admin/reports"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600"
              >
                View All Reports
                <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled cleanup and community events</p>
              </div>
              <a 
                href="/dashboard/admin/events"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-md transition-colors duration-200"
              >
                View All Events
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg mr-4">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                          {event.daysUntil}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No upcoming events scheduled
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <a 
                href="/dashboard/admin/events"
                className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-gray-50 text-green-600 border border-green-600 hover:border-green-700 text-sm font-medium rounded-md transition-colors duration-200 dark:bg-gray-800 dark:border-green-700 dark:text-green-400 dark:hover:bg-gray-700 dark:hover:border-green-600"
              >
                View All Events
                <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
