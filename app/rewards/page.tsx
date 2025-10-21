'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, TrendingUp, Award, Zap, Star, Gift, Target, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface RewardHistory {
  _id: string;
  type: string;
  weightKg?: number;
  pointsAwarded: number;
  status: string;
  date: string;
  createdAt: string;
}

interface RewardStats {
  totalPoints: number;
  totalReports?: number;
  totalWeight?: number;
  verifiedReports?: number;
  pendingReports?: number;
  totalTasks?: number;
  completedTasks?: number;
  totalEvents?: number;
  participatedEvents?: number;
  rank?: number;
  nextMilestone?: number;
}

export default function RewardsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [stats, setStats] = useState<RewardStats | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    fetchRewardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRewardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's reports as reward history
      const reportRes = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (reportRes.ok) {
        const data = await reportRes.json();
        setHistory(data.reports || []);
        
        // Calculate stats
        const totalReports = data.reports?.length || 0;
        const verifiedReports = data.reports?.filter((r: RewardHistory) => r.status === 'verified').length || 0;
        const pendingReports = data.reports?.filter((r: RewardHistory) => r.status === 'pending').length || 0;
        const totalWeight = data.reports?.reduce((sum: number, r: RewardHistory) => sum + (r.weightKg || 0), 0) || 0;
        
        // Calculate next milestone
        const currentPoints = user?.totalPoints || 0;
        const milestones = [100, 250, 500, 1000, 2500, 5000, 10000];
        const nextMilestone = milestones.find(m => m > currentPoints) || (currentPoints + 1000);

        setStats({
          totalPoints: user?.totalPoints || 0,
          totalReports,
          totalWeight: Math.round(totalWeight * 10) / 10,
          verifiedReports,
          pendingReports,
          nextMilestone,
          rank: Math.floor((currentPoints / 100)) + 1,
        });
      }
    } catch (error) {
      console.error('Error fetching reward data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneProgress = () => {
    if (!stats) return 0;
    const currentPoints = stats.totalPoints;
    const nextMilestone = stats.nextMilestone || currentPoints + 100;
    const previousMilestone = nextMilestone === 100 ? 0 : 
      [0, 100, 250, 500, 1000, 2500, 5000, 10000].reverse().find(m => m < nextMilestone) || 0;
    
    const progress = ((currentPoints - previousMilestone) / (nextMilestone - previousMilestone)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getBadgeLevel = () => {
    const points = stats?.totalPoints || 0;
    if (points >= 10000) return { name: 'Eco Legend', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: Star };
    if (points >= 5000) return { name: 'Eco Master', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: Award };
    if (points >= 2500) return { name: 'Eco Expert', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: Zap };
    if (points >= 1000) return { name: 'Eco Warrior', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: Trophy };
    if (points >= 500) return { name: 'Eco Champion', color: 'bg-gradient-to-r from-green-400 to-green-500', icon: Target };
    if (points >= 250) return { name: 'Eco Contributor', color: 'bg-gradient-to-r from-teal-400 to-teal-500', icon: CheckCircle };
    if (points >= 100) return { name: 'Eco Starter', color: 'bg-gradient-to-r from-emerald-400 to-green-400', icon: Gift };
    return { name: 'Eco Beginner', color: 'bg-gradient-to-r from-gray-400 to-gray-500', icon: Trophy };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
      </div>
    );
  }

  if (!user) return null;

  const badgeLevel = getBadgeLevel();
  const BadgeIcon = badgeLevel.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
            My Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your environmental impact and earn rewards</p>
        </div>

        {/* Badge & Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Badge */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Your Badge</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full ${badgeLevel.color} flex items-center justify-center mb-4 shadow-lg`}>
                <BadgeIcon className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{badgeLevel.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rank #{stats?.rank || 1}</p>
              
              {/* Progress to next milestone */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>{stats?.totalPoints} pts</span>
                  <span>{stats?.nextMilestone} pts</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${getMilestoneProgress()}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  {stats?.nextMilestone && stats.totalPoints ? stats.nextMilestone - stats.totalPoints : 0} pts to next level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats?.totalPoints.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reports Submitted</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats?.totalReports || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verified Reports</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats?.verifiedReports || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Weight</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats?.totalWeight || 0} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">How to Earn Points</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Complete these activities to earn more rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Report Waste</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn 10-50 points per kg based on waste type
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Get Verified</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Points are awarded when reports are verified
                  </p>
                </div>
              </div>

              {user.role === 'worker' && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Complete Tasks</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn bonus points for completing collection tasks
                    </p>
                  </div>
                </div>
              )}

              {user.role === 'champion' && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-10 h-10 bg-orange-600 dark:bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Organize Events</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn points for creating and managing events
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Join Events</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Participate in cleanup events for bonus rewards
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward History */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Reward History</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your recent point-earning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">No rewards earned yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Start reporting waste to earn your first points!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'verified' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : item.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {item.status === 'verified' ? (
                          <CheckCircle className={`w-5 h-5 text-green-600 dark:text-green-400`} />
                        ) : item.status === 'pending' ? (
                          <Loader2 className={`w-5 h-5 text-yellow-600 dark:text-yellow-400`} />
                        ) : (
                          <Trophy className={`w-5 h-5 text-red-600 dark:text-red-400`} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {item.type} Waste Report
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.weightKg} kg • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === 'verified'
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
                            : item.status === 'pending'
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700'
                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
                        }
                      >
                        {item.status === 'verified' && `+${item.pointsAwarded} pts`}
                        {item.status === 'pending' && 'Pending'}
                        {item.status === 'rejected' && 'Rejected'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
