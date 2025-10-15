'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Navbar } from '@/components/Navbar';
import { WasteReportForm } from '@/components/WasteReportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Calendar, Award, Leaf, MapPin } from 'lucide-react';
import { formatDate, getRewardTier } from '@/lib/helpers';
import Image from 'next/image';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { apiCall } = useApi();

  const [reports, setReports] = useState<any[]>([]);  // eslint-disable-line
  const [leaderboard, setLeaderboard] = useState<any[]>([]);  // eslint-disable-line
  const [events, setEvents] = useState<any[]>([]);  // eslint-disable-line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (user && user.role !== 'client') {
      router.push('/dashboard/champion');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    try {
      const [reportsData, leaderboardData, eventsData] = await Promise.all([
        apiCall('/api/reports'),
        apiCall('/api/leaderboard?limit=10'),
        apiCall('/api/events?status=upcoming'),
      ]);

      setReports(reportsData.reports);
      setLeaderboard(leaderboardData.leaderboard);
      setEvents(eventsData.events);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
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

  const userRank = leaderboard.findIndex((u: any) => u.id === user.id) + 1;  // eslint-disable-line
  const reward = getRewardTier(user.totalPoints);
  const verifiedReports = reports.filter((r: any) => r.status === 'verified');  // eslint-disable-line
  const pendingReports = reports.filter((r: any) => r.status === 'pending');  // eslint-disable-line

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{user.totalPoints}</div>
              <p className="text-xs text-gray-500">
                Rank #{userRank > 0 ? userRank : 'N/A'} on leaderboard
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Tier</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reward.badge} {reward.tier}
              </div>
              <p className="text-xs text-gray-500">Current achievement level</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{verifiedReports.length}</div>
              <p className="text-xs text-gray-500">{pendingReports.length} pending review</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{events.length}</div>
              <p className="text-xs text-gray-500">Events in your area</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Report Form */}
          <div className="lg:col-span-2">
            <WasteReportForm onSuccess={fetchData} />

            {/* My Reports */}
            <Card className="mt-6 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">My Reports</CardTitle>
                <CardDescription>Track your waste reporting history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No reports yet. Submit your first waste report above!
                    </p>
                  ) : (
                    reports.slice(0, 5).map((report: any) => (  // eslint-disable-line
                      <div
                        key={report.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-green-100 hover:bg-green-50 transition-colors"
                      >
                        {report.imageUrl && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={report.imageUrl}
                              alt="Waste"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 capitalize">
                                {report.type}
                              </h4>
                              <p className="text-sm text-gray-600">{report.weightKg} kg</p>
                              {report.location && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {report.location.address}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                report.status === 'verified'
                                  ? 'default'
                                  : report.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                              className={
                                report.status === 'verified'
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : ''
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">{formatDate(report.date)}</p>
                            {report.status === 'verified' && (
                              <p className="text-sm font-semibold text-green-600">
                                +{report.pointsAwarded} pts
                              </p>
                            )}
                          </div>
                          {report.aiClassification && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              AI: {report.aiClassification.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Leaderboard & Events */}
          <div className="space-y-6">
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Top Contributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((entry: any, index: number) => (  // eslint-disable-line
                        <div
                          key={entry.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            entry.id === user.id
                              ? 'bg-green-100 border border-green-300'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0 w-8 text-center">
                            {index < 3 ? (
                              <span className="text-2xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-600">
                                #{entry.rank}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {entry.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {entry.totalPoints} points
                            </p>
                          </div>
                          {entry.id === user.id && (
                            <Badge className="bg-green-600">You</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No upcoming events
                        </p>
                      ) : (
                        events.map((event: any) => (  // eslint-disable-line
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                          >
                            <h4 className="font-semibold text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Rewards Section */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rewards & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-6xl mb-2">{reward.badge}</div>
                    <p className="text-xl font-bold text-green-700">{reward.tier}</p>
                    <p className="text-sm text-gray-600 mt-1">{user.totalPoints} points</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm text-gray-700">Next Milestones:</h5>
                    {[
                      { tier: 'Bronze', points: 500, badge: '🥉' },
                      { tier: 'Silver', points: 1000, badge: '🥈' },
                      { tier: 'Gold', points: 2500, badge: '🥇' },
                      { tier: 'Platinum', points: 5000, badge: '🏆' },
                      { tier: 'Diamond', points: 10000, badge: '💎' },
                    ]
                      .filter((m) => m.points > user.totalPoints)
                      .slice(0, 3)
                      .map((milestone) => (
                        <div
                          key={milestone.tier}
                          className="flex items-center justify-between p-2 rounded bg-white"
                        >
                          <span className="flex items-center gap-2 text-sm">
                            <span className="text-xl">{milestone.badge}</span>
                            <span className="font-medium">{milestone.tier}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            {milestone.points - user.totalPoints} pts left
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
