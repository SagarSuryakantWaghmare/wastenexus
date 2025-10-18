'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Gift, Star, ArrowRight } from 'lucide-react';

export default function FeatureShowcaseSection() {
  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'Priya Sharma', points: 4850, kg: 485 },
    { rank: 2, name: 'Rajesh Kumar', points: 4320, kg: 432 },
    { rank: 3, name: 'Ananya Patel', points: 3890, kg: 389 },
    { rank: 4, name: 'Vikram Singh', points: 3620, kg: 362 },
    { rank: 5, name: 'Neha Gupta', points: 3245, kg: 324 },
  ];

  // Mock rewards data
  const rewards = [
    {
      id: 1,
      icon: Star,
      name: 'Eco Starter',
      description: 'Join the movement and begin your sustainability journey',
      points: 500,
      progress: 72,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 2,
      icon: Gift,
      name: 'Green Guardian',
      description: 'Prove your commitment with consistent waste diversion',
      points: 1500,
      progress: 45,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 3,
      icon: Trophy,
      name: 'Eco-Hero Badge',
      description: 'Become a legend in the environmental impact community',
      points: 3000,
      progress: 28,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      icon: Zap,
      name: 'Impact Catalyst',
      description: 'Lead the charge and inspire others to take action',
      points: 5000,
      progress: 15,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Compete & Get Rewarded
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join a thriving community where every action matters. Climb the leaderboard, unlock achievements, and earn exclusive rewards.
          </p>
        </div>

        {/* Two-Column Layout: Leaderboard & Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* Leaderboard Preview */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Top Performers</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                This week&apos;s waste diversion champions
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Leaderboard Table */}
              <div className="space-y-3 mb-6">
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">#{user.rank}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.kg} kg diverted</p>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-lg font-bold text-yellow-600">{user.points}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Full Leaderboard Button */}
              <Button className="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                View Full Leaderboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Unlock Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <Card key={reward.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 ${reward.bgColor} rounded-lg`}>
                          <IconComponent className={`w-5 h-5 ${reward.color}`} />
                        </div>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700 font-semibold">
                          {reward.points.toLocaleString()} pts
                        </Badge>
                      </div>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">{reward.name}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400">{reward.description}</CardDescription>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{reward.progress}%</p>
                        </div>
                        <Progress value={reward.progress} className="h-2 dark:bg-gray-700" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg font-medium mb-4">
            Start competing today and watch your impact grow exponentially
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300">
              Join the Challenge
            </Button>
            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}