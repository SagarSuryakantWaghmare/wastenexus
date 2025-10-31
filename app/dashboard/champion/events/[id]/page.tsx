"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import { Calendar, MapPin, Users, Target, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { LoaderCircle } from '@/components/ui/loader';

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

export default function ChampionEventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, token } = useAuth();
  const { apiCall } = useApi();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && user.role !== "champion") {
      router.push("/dashboard/client");
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
      } else {
        toast.error(data.error || "Failed to load event details");
        router.push("/dashboard/champion");
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      await apiCall(`/api/events/${params.id}`, {
        method: "DELETE",
      });

      toast.success("Event deleted successfully!");
      router.push("/dashboard/champion");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="text-center">
          <LoaderCircle size="xl" className="mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!user || !event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <section className="max-w-6xl mx-auto">
          <BackButton href="/dashboard/champion" label="Back to Dashboard" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={
                    event.status === 'upcoming' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold' 
                      : event.status === 'ongoing'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold'
                  }>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                  {event.wasteFocus && (
                    <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 font-medium">
                      {event.wasteFocus}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push(`/dashboard/champion/events/${params.id}/edit`)}
                  variant="outline"
                  className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                >
                  {deleting ? (
                    <>
                      <LoaderCircle size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Total Participants</p>
              </div>
              <p className="text-3xl font-bold">{event.participantCount}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Event Status</p>
              </div>
              <p className="text-2xl font-bold capitalize">{event.status}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Waste Focus</p>
              </div>
              <p className="text-xl font-bold">{event.wasteFocus || "General"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Images */}
              {event.images && event.images.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
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
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                  <CardTitle className="text-gray-900 dark:text-gray-100">Event Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Participants List */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Registered Participants ({event.participantCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {event.participants.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        No participants yet
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        Participants will appear here once they join
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {event.participants.map((participant, index) => (
                        <div
                          key={participant._id}
                          className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">
                              #{index + 1}
                            </span>
                            <UserAvatar
                              name={participant.name}
                              profileImage={participant.profileImage?.secure_url}
                              size="sm"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
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
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                  <CardTitle className="text-gray-900 dark:text-gray-100">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Date & Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(event.date)}
                      </p>
                    </div>
                  </div>

                  {event.locationAddress && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Location</p>
                        {event.locationName && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                            {event.locationName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.locationAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Registration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.participantCount} {event.participantCount === 1 ? 'person has' : 'people have'} joined
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creation Info */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                  <CardTitle className="text-gray-900 dark:text-gray-100">Event Timeline</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(event.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Motivational Message */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 dark:border-green-400 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  🌱 Great work organizing this event! 
                  {event.participantCount > 0 && ` You have ${event.participantCount} ${event.participantCount === 1 ? 'participant' : 'participants'} ready to make a difference!`}
                  {event.participantCount === 0 && " Share this event to get more participants!"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
