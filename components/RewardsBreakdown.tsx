'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Briefcase, 
  ShoppingBag, 
  Calendar, 
  CheckCircle, 
  Award,
  TrendingUp,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';

interface RewardActivity {
  icon: React.ElementType;
  title: string;
  points: number;
  description: string;
  color: string;
  bgColor: string;
}

const rewardActivities: RewardActivity[] = [
  {
    icon: FileText,
    title: 'Submit Waste Report',
    points: 10,
    description: 'Upload and submit a waste collection report',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    icon: CheckCircle,
    title: 'Verified Waste Report',
    points: 50,
    description: 'Get your waste report verified by admin (varies by weight)',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    icon: Briefcase,
    title: 'Post a Job',
    points: 15,
    description: 'Create a waste collection job posting',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: TrendingUp,
    title: 'Job Verified',
    points: 25,
    description: 'Admin approves your job posting',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  {
    icon: ShoppingBag,
    title: 'List Marketplace Item',
    points: 20,
    description: 'Submit an item for sale on marketplace',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    icon: Award,
    title: 'Item Approved',
    points: 30,
    description: 'Admin approves your marketplace listing',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    icon: Gift,
    title: 'Item Sold',
    points: 15,
    description: 'Successfully sell an item on marketplace',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    icon: ShoppingBag,
    title: 'Buy Sustainable Item',
    points: 10,
    description: 'Purchase a recycled/reused item from marketplace',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    icon: Calendar,
    title: 'Join Event',
    points: 20,
    description: 'Participate in a community cleanup event',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
];

export function RewardsBreakdown() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
          Earn Rewards
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Complete activities to earn points and climb the leaderboard!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewardActivities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </h4>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                      +{activity.points}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Pro Tip</h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Points vary based on waste weight and type. The more you contribute to sustainability, the more points you earn!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
