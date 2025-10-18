'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Calendar, Users, MapPin, Loader2, Clock, CheckCircle, Trash2, Eye, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 dark:from-gray-900 dark:to-pink-950 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Award className="w-10 h-10 text-pink-600 dark:text-pink-400" />
            Events Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage cleanup events and community activities</p>
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
                        {event.images && event.images.length > 0 && isValidImageUrl(event.images[0]) && (
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
                            <Button
                              onClick={() => openImagesDialog(event)}
                              variant="default"
                              size="sm"
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {event.images && event.images.length > 0 && (
                              <Button
                                onClick={() => openImagesDialog(event)}
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-700"
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
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Eye className="w-6 h-6 text-pink-600" />
                {selectedEvent?.title} - Event Gallery
              </DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-6">
                {/* Event Info Card */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      <div>
                        <span className="text-gray-600 text-sm">Organized by</span>
                        <p className="font-semibold text-gray-900">{selectedEvent.championId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-pink-600" />
                      <div>
                        <span className="text-gray-600 text-sm">Event Date</span>
                        <p className="font-semibold text-gray-900">{new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      <div>
                        <span className="text-gray-600 text-sm">Participants</span>
                        <p className="font-semibold text-gray-900">{selectedEvent.participants?.length || 0} people joined</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-sm">Location</span>
                      <p className="font-semibold text-gray-900">{selectedEvent.locationName || selectedEvent.location}</p>
                    </div>
                  </div>
                  {selectedEvent.wasteFocus && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-600" />
                      <Badge variant="outline" className="border-pink-300 text-pink-700 bg-white">
                        {selectedEvent.wasteFocus}
                      </Badge>
                    </div>
                  )}
                  {selectedEvent.description && (
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <span className="text-gray-600 text-sm font-medium">Description</span>
                      <p className="text-gray-700 mt-1 leading-relaxed">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>

                {/* Images Gallery */}
                {(() => {
                  // use normalized images from useMemo `validImages`
                  if (validImages.length === 0) {
                    return (
                      <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                        <Eye className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No valid images available</p>
                        <p className="text-sm mt-1">
                          {selectedEvent?.images && selectedEvent.images.length > 0 
                            ? `Found ${selectedEvent.images.length} image(s) but they have invalid URLs`
                            : 'No images have been uploaded for this event'}
                        </p>
                        {selectedEvent?.images && selectedEvent.images.length > 0 && (
                          <div className="mt-4 text-xs text-gray-400">
                            <p>Image URLs found:</p>
                            {selectedEvent.images.map((img, idx) => (
                              <p key={idx} className="font-mono">{img}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const currentImage = validImages[Math.min(currentImageIndex, validImages.length - 1)];

                  return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        <Eye className="w-5 h-5 text-pink-600" />
                        Event Photos ({validImages.length})
                      </h3>
                      <Badge variant="outline" className="text-sm">
                        {Math.min(currentImageIndex, validImages.length - 1) + 1} of {validImages.length}
                      </Badge>
                    </div>

                    {/* Main Image Viewer with Navigation */}
                    <div className="relative bg-black rounded-xl overflow-hidden group">
                      <div className="relative w-full h-[500px]">
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
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}

                        {/* Image Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
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
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {validImages.map((img: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden transition-all ${
                              index === currentImageIndex
                                ? 'ring-4 ring-pink-500 scale-105'
                                : 'ring-2 ring-gray-200 hover:ring-pink-300 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
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
