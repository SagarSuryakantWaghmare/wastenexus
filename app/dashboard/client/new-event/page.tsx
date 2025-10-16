"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) return null;

  // Filter events by search (title, description, location)
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to create Google Calendar event link
  function getGoogleCalendarUrl(event: EventType) {
    const start = new Date(event.date);
    // Default 2 hour event
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center">Upcoming Events</h1>
        <p className="text-gray-500 text-center mb-6">Join upcoming waste management campaigns in your community!</p>
        <div className="flex justify-end mb-4">
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs border-green-200 focus:ring-green-200 rounded-lg shadow-sm"
          />
        </div>
        <Card className="border-green-200 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5" />
              Upcoming Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {filteredEvents.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-lg">No upcoming events</p>
              ) : (
                filteredEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl border-2 border-green-100 bg-white hover:bg-green-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-green-800 text-lg sm:text-xl mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <span className="flex items-center gap-1">
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                      <Button
                        asChild
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        <a
                          href={getGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar"
                        >
                          Add to Google Calendar
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
