'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Trash2, AlertCircle } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import Link from 'next/link';

interface Activity {
  id: string;
  action: string;
  type: string;
  details: string;
  user: string;
  timestamp: string;
  time: string;
}

interface ApiResponse {
  data: Activity[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export default function ActivityLog() {
  const { token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/activities?page=${pagination.page}&limit=${pagination.limit}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data: ApiResponse = await response.json();
      setActivities(data.data);
      setPagination({
        ...pagination,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, token]);



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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activity Log
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 ml-9">
            View all activities across the platform
          </p>
        </div>

        {/* Activity List */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Activities
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Complete history of all platform activities
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Filters</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <LoaderCircle size="lg" />
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={fetchActivities}
                  >
                    Retry
                  </Button>
                </div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No activities found</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full ${getActivityColor(activity.type)}/10 flex items-center justify-center`}>
                        <div className={getActivityColor(activity.type) + ' w-2 h-2 rounded-full'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {activity.details}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>By {activity.user}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
