"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Search, Zap, Crown, Award, ChevronUp, Star, Flame, Leaf } from "lucide-react";
import { PageLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <PageLoader message="Loading leaderboard..." />
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

  const getUserPoints = () => {
    const userEntry = leaderboard.find(entry => entry.id === user.id);
    return userEntry?.totalPoints || 0;
  };

  const getNextRankPoints = () => {
    const userRank = getUserRank();
    if (userRank <= 1) return 0;
    const nextRankUser = leaderboard[userRank - 2]; // -2 because array is 0-indexed and we want the user above
    return nextRankUser ? nextRankUser.totalPoints - getUserPoints() : 0;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-all duration-500">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 py-8 md:py-12"
      >
        <section className="w-full max-w-5xl space-y-8">
          <BackButton href="/dashboard/client" label="Back to Dashboard" />
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div 
              className="inline-flex items-center justify-center gap-3 mb-4 p-1 px-4 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 tracking-tight">
                Leaderboard
              </h1>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto">
              Compete with fellow environmental champions and climb the ranks with every contribution! 🌱
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <p className="text-sm font-medium text-white/90">Your Rank</p>
                </div>
                <p className="text-3xl font-bold flex items-center">
                  #{getUserRank()}
                  {getUserRank() <= 3 && (
                    <span className="ml-2 text-yellow-300">
                      <Star className="h-5 w-5 fill-current" />
                    </span>
                  )}
                </p>
                {getUserRank() > 1 && (
                  <div className="mt-2 text-xs text-white/80">
                    {getNextRankPoints()} points to next rank
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <p className="text-sm font-medium text-white/90">Your Points</p>
                </div>
                <p className="text-3xl font-bold">
                  {getUserPoints().toLocaleString()}
                </p>
                <div className="mt-2 text-xs text-white/80">
                  {getUserPoints() >= 1000 ? (
                    <span className="flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-yellow-300" /> Top Contributor
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Leaf className="h-3 w-3 mr-1 text-green-300" /> Keep going!
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <p className="text-sm font-medium text-white/90">Total Contributors</p>
                </div>
                <p className="text-3xl font-bold">{leaderboard.length}</p>
                <div className="mt-2 text-xs text-white/80">
                  You're in the top {Math.round((getUserRank() / leaderboard.length) * 100)}%!
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search contributors by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 rounded-xl shadow-sm transition-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    ✕
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            {filteredLeaderboard.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No matches found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 grid grid-cols-12 gap-4 items-center font-semibold text-gray-700 dark:text-gray-300 text-sm border-b border-gray-100 dark:border-gray-700">
                  <div className="col-span-1 text-center text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</div>
                  <div className="col-span-6 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Contributor</div>
                  <div className="col-span-3 text-right text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Points</div>
                  <div className="col-span-2 text-right text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</div>
                </div>

                {/* Rows */}
                <AnimatePresence>
                  {filteredLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={cn(
                        "group relative px-6 py-4 grid grid-cols-12 gap-4 items-center transition-all duration-200",
                        entry.id === user.id 
                          ? "bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/20" 
                          : "hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                      )}
                    >
                      {/* Animated border highlight for current user */}
                      {entry.id === user.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-400/5 dark:to-emerald-400/5 border-l-4 border-green-500 dark:border-green-400 rounded-r"></div>
                      )}

                      {/* Rank */}
                      <div className="col-span-1 flex justify-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          getRankBadge(index + 1),
                          index < 3 ? "text-lg" : "text-base"
                        )}>
                          {index < 3 ? (
                            <span className="text-xl">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <span className="font-bold">{entry.rank}</span>
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <div className="col-span-6 min-w-0 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                            {entry.name}
                            {index < 3 && (
                              <span className="ml-2 text-yellow-500">
                                <Star className="h-3.5 w-3.5 inline-block" fill="currentColor" />
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="col-span-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative">
                            <Zap className={cn(
                              "h-4 w-4 transition-transform duration-300 group-hover:scale-125",
                              index < 3 ? "text-yellow-400" : "text-yellow-500 dark:text-yellow-400"
                            )} />
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                            {entry.totalPoints.toLocaleString()}
                          </span>
                        </div>
                        {index > 0 && (
                          <div className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
                            {entry.totalPoints - (leaderboard[index - 1]?.totalPoints || 0)} points ahead
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="col-span-2 text-right">
                        {entry.id === user.id ? (
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 500,
                              damping: 20
                            }}
                          >
                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-3 py-1 text-xs shadow-md shadow-green-500/20 dark:shadow-green-900/30">
                              You • #{getUserRank()}
                            </Badge>
                          </motion.div>
                        ) : index < 3 ? (
                          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            {index === 0 ? 'Champion' : index === 1 ? 'Runner Up' : 'Top 3'}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Motivational Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 shadow-sm border border-green-100 dark:border-green-900/30"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/10 dark:bg-green-500/10 rounded-full"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  {getUserRank() <= 3 ? (
                    <Trophy className="h-6 w-6 text-yellow-500" fill="currentColor" />
                  ) : getUserRank() <= 10 ? (
                    <Award className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Leaf className="h-6 w-6 text-green-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {getUserRank() <= 3 
                      ? "🏆 You're a Top Performer!" 
                      : getUserRank() <= 10 
                        ? "🌟 You're Doing Great!" 
                        : "🌱 Keep Going!"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getUserRank() <= 3 
                      ? `Amazing work maintaining your position in the top 3! You're an inspiration to others.` 
                      : getUserRank() <= 10 
                        ? `You're in the top 10% of contributors! Just ${leaderboard[2].totalPoints - (user.totalPoints || 0) + 1} more points to break into the top 3.` 
                        : `You're currently #${getUserRank()} out of ${leaderboard.length} contributors. Every report brings you closer to the top!`}
                  </p>
                  
                  {getUserRank() > 1 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                      className="mt-4"
                    >
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress to next rank</span>
                        <span>{Math.min(100, Math.round(((user.totalPoints || 0) / (leaderboard[getUserRank() - 2]?.totalPoints || (user.totalPoints || 0) + 1)) * 100))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round(((user.totalPoints || 0) / (leaderboard[getUserRank() - 2]?.totalPoints || (user.totalPoints || 0) + 1)) * 100))}%`,
                            transition: 'width 1.5s ease-out'
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <motion.div 
                className="mt-4 pt-4 border-t border-green-100 dark:border-green-900/30 flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button className="px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  Report Waste
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-green-500/20">
                  View Challenges
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </motion.main>
      
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </div>
  );
}