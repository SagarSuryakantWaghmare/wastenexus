"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
// Removed unused Card imports
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  type LeaderboardEntry = {
    id: string;
    name: string;
    totalPoints: number;
    rank: number;
  };
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
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
      fetchLeaderboard();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard?limit=10");
      const data = await res.json();
      setLeaderboard(data.leaderboard);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-400 border-t-transparent"></span>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  // Filter leaderboard by search
  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 py-8">
        <section className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 border border-green-100 mt-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-1 text-center tracking-tight">Leaderboard</h1>
          <p className="text-gray-500 text-center mb-6 text-lg">See the top contributors in your community!</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-7 w-7 text-yellow-500" />
              <span className="font-bold text-green-700 text-xl">Top Contributors</span>
            </div>
            <div className="flex-1 flex justify-end">
              <Input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs border-green-200 focus:ring-green-200 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div className="bg-green-50/60 rounded-2xl p-2 sm:p-4">
            {filteredLeaderboard.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-lg">No contributors found.</div>
            ) : (
              <div className="space-y-3">
                {filteredLeaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl border-2 transition-colors shadow-sm ${
                      entry.id === user.id
                        ? "bg-green-100 border-green-400"
                        : "bg-white border-green-100 hover:border-green-200"
                    }`}
                  >
                    <div className="flex-shrink-0 w-full sm:w-10 text-center">
                      {index < 3 ? (
                        <span className="text-3xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-600 text-lg">#{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p className="font-semibold text-gray-900 truncate text-lg sm:text-xl">{entry.name}</p>
                      <p className="text-sm text-green-700 font-medium">{entry.totalPoints} points</p>
                    </div>
                    {entry.id === user.id && <Badge className="bg-green-600 text-white px-4 py-1 text-base">You</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
