"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { PageLoader } from "@/components/ui/loader";

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

export default function EventsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && user.role !== "client") {
      router.push("/dashboard/champion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events?status=upcoming");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event: Event) => {
    router.push(`/dashboard/client/events/${event.id}`);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <PageLoader message="Loading events..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <section className="max-w-7xl mx-auto">
          <BackButton href="/dashboard/client" label="Back to Dashboard" />
          
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CalendarIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                Community Events
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Join waste management events and make a difference in your community!
            </p>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No events available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for upcoming community events
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
                  onClick={() => handleViewDetails(event)}
                >
                  {/* Event Image */}
                  {event.images && event.images.length > 0 ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={event.images[0]}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-600 text-white">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-48 w-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                      <CalendarIcon className="h-20 w-20 text-emerald-600 dark:text-emerald-400 opacity-50" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-600 text-white">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {event.wasteFocus && (
                      <Badge variant="outline" className="w-fit mt-2">
                        {event.wasteFocus}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>

                      {event.locationName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="line-clamp-1">{event.locationName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{event.participantCount} participants</span>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(event);
                      }}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
