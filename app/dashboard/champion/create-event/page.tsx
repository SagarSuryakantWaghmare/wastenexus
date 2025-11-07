"use client";

import { useRouter } from "next/navigation";
import { ChampionEventCreator } from "@/components/champion/ChampionEventCreator";
import { Navbar } from "@/components/Navbar";

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Return to Dashboard Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-start items-start gap-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white text-base sm:text-lg font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full sm:w-auto"
            onClick={() => router.push("/dashboard/champion")}
          >
            ← <span className="ml-1">Return to Dashboard</span>
          </button>
        </div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Event</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Fill out the form below to organize a new community event.</p>
        </div>
        <div className="w-full">
          <ChampionEventCreator
            onEventCreated={() => {
              router.push("/dashboard/champion");
            }}
          />
        </div>
      </div>
    </div>
  );
}
