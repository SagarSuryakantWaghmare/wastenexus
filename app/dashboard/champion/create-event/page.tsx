"use client";

import { useRouter } from "next/navigation";
import { ChampionEventCreator } from "@/components/champion/ChampionEventCreator";
import { Navbar } from "@/components/Navbar";

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Create New Event</h1>
          <p className="text-gray-600 text-lg">Fill out the form below to organize a new community event.</p>
        </div>
        <ChampionEventCreator
          onEventCreated={() => {
            router.push("/dashboard/champion");
          }}
        />
      </div>
    </div>
  );
}
