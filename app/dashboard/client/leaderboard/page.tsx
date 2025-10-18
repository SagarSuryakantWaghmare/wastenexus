"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Search, Zap, Crown } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="text-center">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-400 dark:border-green-500 border-t-transparent"></span>
          <p className="mt-4 text-green-300 dark:text-green-400 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  const getUserRank = () => {
    return leaderboard.findIndex((entry) => entry.id === user.id) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 py-12">
        <section className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Leaderboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">See the top environmental champions in your community!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Your Rank</p>
              </div>
              <p className="text-3xl font-bold">#{getUserRank()}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Your Points</p>
              </div>
              <p className="text-3xl font-bold">{user.totalPoints || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-6 w-6" />
                <p className="text-sm font-medium opacity-90">Total Contributors</p>
              </div>
              <p className="text-3xl font-bold">{leaderboard.length}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 rounded-xl shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {filteredLeaderboard.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16 text-lg font-medium">
                No contributors found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 grid grid-cols-12 gap-4 items-center font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-6">Name</div>
                  <div className="col-span-3 text-right">Points</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>

                {/* Rows */}
                {filteredLeaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      entry.id === user.id ? "bg-green-50/50 dark:bg-green-900/20" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 text-center">
                      {index < 3 ? (
                        <span className="text-3xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        <span className="font-bold text-lg text-gray-600 dark:text-gray-400">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="col-span-6 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                        {entry.name}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="col-span-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {entry.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-2 text-right">
                      {entry.id === user.id && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 dark:border-green-400 rounded-lg transition-colors duration-300">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              🌱 Keep making an impact! Every waste report brings you closer to the top. 
              {getUserRank() <= 3 && " You're in the top 3 - amazing work!"}
              {getUserRank() > 3 && getUserRank() <= 10 && " You're in the top 10 - keep it up!"}
              {getUserRank() > 10 && " Keep contributing to climb the ranks!"}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}