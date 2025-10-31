'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Calendar, Users, MapPin, Clock, CheckCircle, Trash2, Eye, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import Image from 'next/image';
import { toast } from 'sonner';

interface Event {
  _id: string;
  championId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  location: string;
  locationName?: string;
  wasteFocus?: string;
  date: string;
  images?: string[];
  participants: unknown[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
}

interface Stats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  totalParticipants: number;
}

export default function EventsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showImagesDialog, setShowImagesDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Validate image URL - accept Cloudinary URLs or valid absolute URLs
  const isValidImageUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://');
  };

  // Get valid images list for the selected event
  const validImages = useMemo(() => {
    if (!selectedEvent?.images) return [] as string[];
    return selectedEvent.images.filter(img => isValidImageUrl(img));
  }, [selectedEvent]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showImagesDialog && !isFullscreen) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape' && isFullscreen) {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showImagesDialog, isFullscreen, selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        setStats(data.stats || {});
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, status: string) => {
    try {
      setProcessing(eventId);
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, status }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Event status updated successfully!');
        fetchEvents();
      } else {
        toast.error('Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('An error occurred while updating event');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      setProcessing(eventId);
      const response = await fetch(`/api/admin/events?eventId=${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Event deleted successfully!');
        fetchEvents();
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('An error occurred while deleting event');
    } finally {
      setProcessing(null);
    }
  };

  const openImagesDialog = (event: Event) => {
    console.log('Opening dialog for event:', event.title);
    console.log('Event images:', event.images);
    console.log('Valid images:', event.images?.filter(img => isValidImageUrl(img)));
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setShowImagesDialog(true);
  };

  const nextImage = () => {
    if (selectedEvent?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedEvent?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedEvent.images!.length - 1 : prev - 1
      );
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage cleanup events and community activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Events</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.total || 0}</p>
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="mr-1">+12.5%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{Math.floor((stats?.total ?? 0) * 0.3)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Upcoming</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.upcoming || 0}</p>
                  <div className="flex items-center text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                    <span className="mr-1">+8.3%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium">+{Math.floor((stats?.upcoming ?? 0) * 0.4)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Ongoing</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.ongoing || 0}</p>
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                    <span className="mr-1">+5.7%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">+{Math.floor((stats?.ongoing ?? 0) * 0.2)}</span> from last week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Completed</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.completed || 0}</p>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="mr-1">+15.2%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{Math.floor((stats?.completed ?? 0) * 0.25)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Participants</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.totalParticipants || 0}</p>
                  <div className="flex items-center text-sm text-teal-600 dark:text-teal-400 font-medium">
                    <span className="mr-1">+22.8%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-teal-600 dark:text-teal-400 font-medium">+{Math.floor((stats?.totalParticipants || 0) * 0.35)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white text-lg font-semibold">All Events</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto horizontal-scroll pb-2 mb-6">
                <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 inline-flex min-w-max">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-emerald-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    All ({stats?.total || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upcoming" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Upcoming ({stats?.upcoming || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ongoing" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-orange-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Ongoing ({stats?.ongoing || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Completed ({stats?.completed || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
                      <p className="text-gray-500 dark:text-gray-400">No events found</p>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        key={event._id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                      >
                        {/* Image */}
                        {event.images && event.images.length > 0 && isValidImageUrl(event.images[0]) && (
                          <div className="relative w-full md:w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={event.images[0]}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{event.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{event.description}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Organized by: <span className="font-medium text-gray-900 dark:text-white">{event.championId?.name}</span>
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                event.status === 'upcoming'
                                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                  : event.status === 'ongoing'
                                  ? 'border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                  : 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{event.participants?.length || 0} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="truncate text-gray-700 dark:text-gray-300">{event.location}</span>
                            </div>
                            {event.wasteFocus && (
                              <div>
                                <Badge variant="outline" className="text-xs bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                                  {event.wasteFocus}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={() => openImagesDialog(event)}
                              variant="default"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {event.images && event.images.length > 0 && (
                              <Button
                                onClick={() => openImagesDialog(event)}
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-700 dark:border-emerald-400 dark:text-emerald-300 hover:bg-green-50 dark:hover:bg-emerald-900/20"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {event.images.length} {event.images.length === 1 ? 'Image' : 'Images'}
                              </Button>
                            )}
                            {event.status !== 'upcoming' && (
                              <Button
                                onClick={() => handleStatusChange(event._id, 'upcoming')}
                                disabled={processing === event._id}
                                variant="outline"
                                size="sm"
                              >
                                Mark Upcoming
                              </Button>
                            )}
                            {event.status !== 'ongoing' && (
                              <Button
                                onClick={() => handleStatusChange(event._id, 'ongoing')}
                                disabled={processing === event._id}
                                variant="outline"
                                size="sm"
                                className="border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              >
                                Mark Ongoing
                              </Button>
                            )}
                            {event.status !== 'completed' && (
                              <Button
                                onClick={() => handleStatusChange(event._id, 'completed')}
                                disabled={processing === event._id}
                                variant="outline"
                                size="sm"
                                className="border-emerald-500 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              >
                                Mark Completed
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDelete(event._id)}
                              disabled={processing === event._id}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Locations */}
        {locations.length > 0 && (
          <Card className="mt-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white text-lg font-semibold">
                Event Locations ({locations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
              <div className="relative w-full">
                {/* Gradient fade for scroll indicator */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10" />
                <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-8" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {locations.map((location, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-2 bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images Dialog */}
        <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-600 dark:text-emerald-400" />
                {selectedEvent?.title} - Event Gallery
              </DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-6">
                {/* Event Info Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-gray-600 text-sm">Organized by</span>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.championId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Event Date</span>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-gray-600 text-sm">Participants</span>
                        <p className="font-semibold text-gray-900 dark:text-white">{selectedEvent.participants?.length || 0} people joined</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-sm">Location</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedEvent.locationName || selectedEvent.location}</p>
                    </div>
                  </div>
                  {selectedEvent.wasteFocus && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300 bg-white dark:bg-gray-700">
                        {selectedEvent.wasteFocus}
                      </Badge>
                    </div>
                  )}
                  {selectedEvent.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Description</span>
                      <p className="text-gray-700 dark:text-gray-200 mt-2 leading-relaxed">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>

                {/* Images Gallery */}
                {(() => {
                  // use normalized images from useMemo `validImages`
                  if (validImages.length === 0) {
                    return (
                      <div className="text-center py-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No valid images available</p>
                        <p className="text-sm mt-1">
                          {selectedEvent?.images && selectedEvent.images.length > 0 
                            ? `Found ${selectedEvent.images.length} image(s) but they have invalid URLs`
                            : 'No images have been uploaded for this event'}
                        </p>
                      </div>
                    );
                  }

                  const currentImage = validImages[Math.min(currentImageIndex, validImages.length - 1)];

                  return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Event Photos ({validImages.length})
                      </h3>
                      <Badge variant="outline" className="text-sm border-emerald-300 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300">
                        {Math.min(currentImageIndex, validImages.length - 1) + 1} of {validImages.length}
                      </Badge>
                    </div>

                    {/* Main Image Viewer with Navigation */}
                    <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-700">
                      <div className="relative w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg">
                        <Image
                          src={currentImage}
                          alt={`${selectedEvent.title} - Image ${Math.min(currentImageIndex, validImages.length - 1) + 1}`}
                          fill
                          className="object-contain cursor-pointer transition-transform hover:scale-105"
                          onClick={openFullscreen}
                          priority
                        />
                        
                        {/* Navigation Arrows - Only show if more than 1 image */}
                        {validImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}

                        {/* Image Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 dark:bg-gray-900/90 text-white p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Photo {Math.min(currentImageIndex, validImages.length - 1) + 1} of {validImages.length}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={openFullscreen}
                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Full Size
                              </button>
                              <a
                                href={currentImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Grid - Only show if more than 1 valid image */}
                    {validImages.length > 1 && (
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-1">
                        {validImages.map((img: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative h-20 bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all border border-gray-200 dark:border-gray-700 ${
                              index === currentImageIndex
                                ? 'ring-2 ring-emerald-500 scale-105'
                                : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-emerald-300 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Keyboard Navigation Hint */}
                    {validImages.length > 1 && (
                      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
                          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
                          Navigate
                        </span>
                      </div>
                    )}
                  </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Fullscreen Image Viewer */}
        {isFullscreen && selectedEvent && (() => {
          const currentImage = validImages[Math.min(currentImageIndex, validImages.length - 1)];
          
          if (!currentImage) return null;
          
          return (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={currentImage}
                alt={`${selectedEvent.title} - Image ${Math.min(currentImageIndex, validImages.length - 1) + 1}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation in Fullscreen */}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Image Counter in Fullscreen */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium">
                {Math.min(currentImageIndex, validImages.length - 1) + 1} / {validImages.length}
              </div>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
}
