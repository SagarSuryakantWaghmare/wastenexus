'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Loader2, Plus, Calendar, Users } from 'lucide-react';
import { formatDateTime, calculatePoints } from '@/lib/helpers';

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
  title: string;
  description: string;
  location: string;
  date: string;
  participantCount: number;
  status: string;
}

export default function ChampionDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { apiCall } = useApi();
  
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [processingReport, setProcessingReport] = useState<string | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'champion')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [reportsData, eventsData] = await Promise.all([
        apiCall('/api/reports?status=pending'),
        apiCall('/api/events'),
      ]);
      
      setPendingReports(reportsData.reports || []);
      setEvents(eventsData.events || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleVerifyReport = async (reportId: string, status: 'verified' | 'rejected') => {
    try {
      setProcessingReport(reportId);
      await apiCall(`/api/reports/${reportId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error verifying report:', error);
      alert('Failed to process report');
    } finally {
      setProcessingReport(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCreatingEvent(true);

    try {
      await apiCall('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventForm),
      });

      // Reset form and close dialog
      setEventForm({ title: '', description: '', location: '', date: '' });
      setDialogOpen(false);
      
      // Refresh data
      await fetchData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setCreatingEvent(false);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Champion Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage reports and create events</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Organize a new waste collection campaign
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                    placeholder="e.g., Community Beach Cleanup"
                    className="border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    required
                    placeholder="Describe the event..."
                    rows={3}
                    className="border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    required
                    placeholder="e.g., Central Park"
                    className="border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                    className="border-green-200"
                  />
                </div>

                {formError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creatingEvent}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {creatingEvent ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Event'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200">
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

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-700">{events.length}</p>
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-purple-700">
                  {events.reduce((sum, e) => sum + (e.participantCount || 0), 0)}
                </p>
                <Users className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reports */}
        <Card className="mb-8">
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

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Events you have created and organized</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No events yet. Create your first one!</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>📍 {event.location}</span>
                          <span>📅 {formatDateTime(new Date(event.date))}</span>
                          <span>👥 {event.participantCount} participants</span>
                        </div>
                      </div>
                      <Badge
                        variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'outline' : 'secondary'}
                        className={
                          event.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : event.status === 'ongoing'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
