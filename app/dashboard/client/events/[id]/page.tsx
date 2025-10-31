"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { LoaderCircle } from '@/components/ui/loader';
import { toast } from "sonner";
import Image from "next/image";

interface Participant {
  _id: string;
  name: string;
  email: string;
  profileImage?: {
    secure_url: string;
  };
}

interface EventDetails {
  id: string;
  champion: {
    _id: string;
    name: string;
    email: string;
    profileImage?: {
      secure_url: string;
    };
  };
  title: string;
  description: string;
  location: string;
  locationName?: string;
  locationAddress?: string;
  wasteFocus?: string;
  date: string;
  images?: string[];
  participants: Participant[];
  participantCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, token } = useAuth();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && user.role !== "client") {
      router.push("/dashboard/champion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchEventDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${params.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setEvent(data.event);
        // Check if current user is already a participant
        const userIsParticipant = data.event.participants.some(
          (p: Participant) => p._id === user?.id
        );
        setIsParticipant(userIsParticipant);
      } else {
        toast.error(data.error || "Failed to load event details");
        router.push("/dashboard/client/events");
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setJoining(true);
      const res = await fetch(`/api/events/${params.id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Successfully joined the event!");
        fetchEventDetails(); // Refresh to update participant count
      } else {
        toast.error(data.error || "Failed to join event");
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      toast.error("Failed to join event");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setJoining(true);
      const res = await fetch(`/api/events/${params.id}/join`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Successfully left the event");
        fetchEventDetails(); // Refresh to update participant count
      } else {
        toast.error(data.error || "Failed to leave event");
      }
    } catch (error) {
      console.error("Failed to leave event:", error);
      toast.error("Failed to leave event");
    } finally {
      setJoining(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="text-center">
          <LoaderCircle size="xl" className="mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!user || !event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <section className="max-w-5xl mx-auto">
          <BackButton href="/dashboard/client/events" label="Back to Events" />
          
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-600 text-white">
                    {event.status}
                  </Badge>
                  {event.wasteFocus && (
                    <Badge variant="outline">
                      {event.wasteFocus}
                    </Badge>
                  )}
                </div>
              </div>
              
              {event.status === "upcoming" && (
                <div>
                  {isParticipant ? (
                    <Button
                      onClick={handleLeaveEvent}
                      disabled={joining}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {joining ? (
                        <>
                          <LoaderCircle size="sm" className="mr-2" />
                          Leaving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Registered - Leave Event
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoinEvent}
                      disabled={joining}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {joining ? (
                        <>
                          <LoaderCircle size="sm" className="mr-2" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Users className="mr-2 h-4 w-4" />
                          Join Event
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Images */}
              {event.images && event.images.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="relative h-96 w-full">
                    <Image
                      src={event.images[0]}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              )}

              {/* Description */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Participants List */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Participants ({event.participantCount})
                  </CardTitle>
                  <CardDescription>People joining this event</CardDescription>
                </CardHeader>
                <CardContent>
                  {event.participants.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No participants yet. Be the first to join!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.participants.map((participant) => (
                        <div
                          key={participant._id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                        >
                          <UserAvatar
                            name={participant.name}
                            profileImage={participant.profileImage?.secure_url}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {participant.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {participant.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Date & Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {event.locationAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Location</p>
                        {event.locationName && (
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {event.locationName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.locationAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Participants</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.participantCount} {event.participantCount === 1 ? 'person' : 'people'} joined
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Organized By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={event.champion.name}
                      profileImage={event.champion.profileImage?.secure_url}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {event.champion.name}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        Champion
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
