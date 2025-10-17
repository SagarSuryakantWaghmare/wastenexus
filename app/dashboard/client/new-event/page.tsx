"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Clock, Users, ArrowRight } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  type EventType = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  };
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      const res = await fetch("/api/events?status=upcoming");
      const data = await res.json();
      setEvents(data.events);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="text-center">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-400 border-t-transparent"></span>
          <p className="mt-4 text-green-300 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase())
  );

  function getGoogleCalendarUrl(event: EventType) {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const details = [
      `action=TEMPLATE`,
      `text=${encodeURIComponent(event.title)}`,
      `dates=${format(start)}/${format(end)}`,
      `details=${encodeURIComponent(event.description)}`,
      `location=${encodeURIComponent(event.location)}`,
    ].join('&');
    return `https://calendar.google.com/calendar/render?${details}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Upcoming Events</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Join waste management campaigns in your community and make a collective impact!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-md mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events by name, description, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="py-16 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No events found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or check back later for upcoming campaigns</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event, index) => (
              <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    
                    {/* Event Number Badge */}
                    <div className="hidden md:flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="font-medium">
                            {new Date(event.date).toLocaleString(undefined, { 
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          Join the campaign
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col gap-3 md:flex-shrink-0 md:items-end justify-center">
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 w-full md:w-auto justify-center md:justify-end"
                      >
                        <a
                          href={getGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar"
                        >
                          <Calendar className="h-4 w-4" />
                          Add to Calendar
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                      <p className="text-xs text-gray-500 text-center md:text-right">
                        Opens in Google Calendar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-lg">
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Attending an Event?</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Add upcoming events to your calendar so you don&apos;t miss them. Each event contribution helps reduce waste and earn points towards rewards!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}