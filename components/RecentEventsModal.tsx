'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Event {
  id: string;
  champion: {
    name: string;
    email: string;
  };
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
  createdAt: string;
}

interface RecentEventsModalProps {
  show: boolean;
  onClose: () => void;
}

export default function RecentEventsModal({ show, onClose }: RecentEventsModalProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      fetchRecentEvents();
    }
  }, [show]);

  const fetchRecentEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events?status=upcoming&limit=1');
      const data = await res.json();
      // Sort by createdAt to get most recent first
      const sortedEvents = (data.events || []).sort(
        (a: Event, b: Event) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setEvents(sortedEvents.slice(0, 1)); // Show only 1 most recent event
    } catch (error) {
      console.error('Failed to fetch recent events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = (eventId: string) => {
    onClose();
    router.push(`/dashboard/client/events/${eventId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            Recent Community Event
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No recent events
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for new community events
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    {/* Event Image */}
                    {event.images && event.images.length > 0 ? (
                      <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={event.images[0]}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full md:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center rounded-lg">
                        <Calendar className="h-16 w-16 text-emerald-600 dark:text-emerald-400 opacity-50" />
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {event.title}
                          </h3>
                          <Badge className="bg-emerald-600 text-white flex-shrink-0">
                            {event.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-3">
                          {event.wasteFocus && (
                            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mr-2">
                              {event.wasteFocus}
                            </Badge>
                          )}
                          
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            
                            {(event.locationName || event.locationAddress) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="line-clamp-1">
                                  {event.locationName || event.locationAddress}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span>{event.participantCount} participants</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Organized by {event.champion.name}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleJoinEvent(event.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Join Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  router.push('/dashboard/client/events');
                }}
                className="border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold"
              >
                See More Events
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
