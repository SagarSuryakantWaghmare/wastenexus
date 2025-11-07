"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ChampionEventEditor } from "@/components/champion/ChampionEventEditor";
import { LoaderCircle } from '@/components/ui/loader';
import { toast } from "sonner";

interface EventData {
  title: string;
  description: string;
  wasteFocus: string;
  eventDate: string;
  locationName?: string;
  locationAddress?: string;
  imageUrl?: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

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
        setEvent({
          title: data.event.title,
          description: data.event.description,
          wasteFocus: data.event.wasteFocus,
          eventDate: data.event.date,
          locationName: data.event.locationName,
          locationAddress: data.event.locationAddress,
          imageUrl: data.event.images?.[0],
        });
      } else {
        toast.error(data.error || "Failed to load event details");
        router.push("/dashboard/champion");
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      toast.error("Failed to load event details");
      router.push("/dashboard/champion");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Return to Event Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-start items-start gap-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white text-base sm:text-lg font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full sm:w-auto"
            onClick={() => router.push(`/dashboard/champion/events/${params.id}`)}
          >
            ← <span className="ml-1">Back to Event</span>
          </button>
        </div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit Event</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Update your event details below</p>
        </div>
        <ChampionEventEditor
          eventId={params.id as string}
          initialData={event}
          onEventUpdated={() => {
            toast.success("Redirecting to event details...");
            router.push(`/dashboard/champion/events/${params.id}`);
          }}
        />
      </div>
    </div>
  );
}
