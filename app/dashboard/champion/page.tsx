'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { ChampionEventList } from '@/components/champion/ChampionEventList';
import { LoaderOne } from '@/components/ui/loader';
import { getRewardTier } from '@/lib/helpers';


interface Event {
  id: string;
  championId: string;
  title: string;
  description: string;
  wasteFocus: string;
  locationName: string;
  locationAddress: string;
  eventDate: string;
  imageUrl: string;
  participantCount: number;
  status: string;
  createdAt: string;
}

export default function ChampionDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { apiCall } = useApi();
  
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  // Removed showEventCreator state; event creation will be on a separate page

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'champion')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      setLoadingEvents(true);
      const eventsData = await apiCall('/api/events/mine');
      setMyEvents(eventsData.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Report verification removed from champion dashboard per request

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <LoaderOne />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Champion Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Organize and manage community events</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-lg py-2 px-4">
                {user?.totalPoints || 0} points
              </Badge>
              {(() => {
                const rewardTier = getRewardTier(user?.totalPoints || 0);
                return (
                  <Badge className={`${rewardTier.color} bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg py-2 px-4`}>
                    {rewardTier.badge} {rewardTier.tier}
                  </Badge>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{myEvents.length}</p>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Calendar className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                  {myEvents.reduce((sum, e) => sum + (e.participantCount || 0), 0)}
                </p>
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Users className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending reports section removed per request */}

        {/* Event Management Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Management</h2>
            <Button
              onClick={() => router.push('/dashboard/champion/create-event')}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md"
            >
              Create New Event
            </Button>
          </div>

          {/* Event List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">My Events</h3>
            <ChampionEventList
              events={myEvents}
              loading={loadingEvents}
              onRefresh={fetchMyEvents}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
