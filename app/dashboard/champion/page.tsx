'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Calendar, Users } from 'lucide-react';
import { formatDateTime, calculatePoints } from '@/lib/helpers';
import { ChampionEventCreator } from '@/components/champion/ChampionEventCreator';
import { ChampionEventList } from '@/components/champion/ChampionEventList';
import { toast } from 'sonner';

interface Report {
  id: string;
  user: {
    name: string;
    email: string;
  };
  type: string;
  weightKg: number;
  status: string;
  pointsAwarded: number;
  createdAt: string;
}

interface Event {
  id: string;
  championId?: string;
  title: string;
  description: string;
  location: string;
  locationName?: string;
  locationAddress?: string;
  wasteFocus?: string;
  date: string;
  images?: string[];
  participantCount: number;
  status: string;
}

export default function ChampionDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { apiCall } = useApi();
  
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [processingReport, setProcessingReport] = useState<string | null>(null);
  // Removed showEventCreator state; event creation will be on a separate page

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'champion')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchMyEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const reportsData = await apiCall('/api/reports?status=pending');
      setPendingReports(reportsData.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingData(false);
    }
  };

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

  const handleVerifyReport = async (reportId: string, status: 'verified' | 'rejected') => {
    try {
      setProcessingReport(reportId);
      await apiCall(`/api/reports/${reportId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      toast.success(`Report ${status} successfully!`);
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error('Failed to process report');
    } finally {
      setProcessingReport(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Champion Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage reports and organize community events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-orange-700">{pendingReports.length}</p>
                <CheckCircle2 className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-700">{myEvents.length}</p>
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-purple-700">
                  {myEvents.reduce((sum, e) => sum + (e.participantCount || 0), 0)}
                </p>
                <Users className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reports */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Pending Verification</CardTitle>
            <CardDescription>Review and verify waste reports submitted by clients</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : pendingReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending reports to review</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Est. Points</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{report.user?.email || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell>{report.weightKg} kg</TableCell>
                      <TableCell className="text-green-700 font-semibold">
                        {calculatePoints(report.weightKg, report.type)} pts
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDateTime(new Date(report.createdAt))}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleVerifyReport(report.id, 'verified')}
                            disabled={processingReport === report.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingReport === report.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <><CheckCircle2 className="mr-1 h-4 w-4" />Verify</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleVerifyReport(report.id, 'rejected')}
                            disabled={processingReport === report.id}
                          >
                            <XCircle className="mr-1 h-4 w-4" />Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Event Management Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-700">Event Management</h2>
            <Button
              onClick={() => router.push('/dashboard/champion/create-event')}
              className="bg-green-600 hover:bg-green-700"
            >
              Create New Event
            </Button>
          </div>

          {/* Event List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Events</h3>
            <ChampionEventList
              events={myEvents}
              loading={loadingEvents}
              onRefresh={fetchMyEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
