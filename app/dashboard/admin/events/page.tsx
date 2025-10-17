'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Calendar, Users, MapPin, Loader2, Clock, CheckCircle, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

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

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating event:', error);
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
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setProcessing(null);
    }
  };

  const openImagesDialog = (event: Event) => {
    setSelectedEvent(event);
    setShowImagesDialog(true);
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-10 h-10 text-pink-600" />
            Events Management
          </h1>
          <p className="text-gray-600 mt-2">Manage cleanup events and community activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium mb-1">Total Events</p>
                  <p className="text-4xl font-bold">{stats?.total || 0}</p>
                </div>
                <Award className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Upcoming</p>
                  <p className="text-4xl font-bold">{stats?.upcoming || 0}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Ongoing</p>
                  <p className="text-4xl font-bold">{stats?.ongoing || 0}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                  <p className="text-4xl font-bold">{stats?.completed || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Participants</p>
                  <p className="text-4xl font-bold">{stats?.totalParticipants || 0}</p>
                </div>
                <Users className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({stats?.total || 0})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({stats?.upcoming || 0})</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing ({stats?.ongoing || 0})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats?.completed || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No events found</p>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        key={event._id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Image */}
                        {event.images && event.images.length > 0 && (
                          <div className="relative w-full md:w-40 h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Organized by: <span className="font-medium">{event.championId?.name}</span>
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                event.status === 'upcoming'
                                  ? 'border-blue-500 text-blue-700'
                                  : event.status === 'ongoing'
                                  ? 'border-orange-500 text-orange-700'
                                  : 'border-green-500 text-green-700'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-600" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-600" />
                              <span>{event.participants?.length || 0} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            {event.wasteFocus && (
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {event.wasteFocus}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            {event.images && event.images.length > 0 && (
                              <Button
                                onClick={() => openImagesDialog(event)}
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-700"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Images ({event.images.length})
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
                                className="border-orange-500 text-orange-700"
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
                                className="border-green-500 text-green-700"
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Locations ({locations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {locations.map((location, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images Dialog */}
        <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedEvent?.title} - Event Images
              </DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-6">
                {/* Event Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Organized by:</span>
                      <p className="font-medium">{selectedEvent.championId?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Participants:</span>
                      <p className="font-medium">{selectedEvent.participants?.length || 0}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                  {selectedEvent.description && (
                    <div className="mt-3">
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium text-gray-700">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>

                {/* Images Gallery */}
                {selectedEvent.images && selectedEvent.images.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Event Photos ({selectedEvent.images.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEvent.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative h-80 bg-gray-100 rounded-lg overflow-hidden group"
                        >
                          <Image
                            src={img}
                            alt={`${selectedEvent.title} - Image ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                            Photo {index + 1} of {selectedEvent.images?.length || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No images available for this event</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
