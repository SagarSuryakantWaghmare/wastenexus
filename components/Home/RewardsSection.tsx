'use client';

import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RewardsSection() {
  const tiers = [
    { name: 'Beginner', points: '0-499', emoji: '🌱', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
    { name: 'Bronze', points: '500-999', emoji: '🥉', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { name: 'Silver', points: '1K-2.5K', emoji: '🥈', color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-200 dark:bg-gray-700' },
    { name: 'Gold', points: '2.5K-5K', emoji: '🥇', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { name: 'Platinum', points: '5K-10K', emoji: '🏆', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' },
    { name: 'Diamond', points: '10K+', emoji: '💎', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  const pointsBreakdown = [
    { type: 'E-Waste', points: 20, color: 'text-red-600 dark:text-red-400' },
    { type: 'Plastic', points: 15, color: 'text-blue-600 dark:text-blue-400' },
    { type: 'Metal', points: 13, color: 'text-gray-600 dark:text-gray-400' },
    { type: 'Glass', points: 12, color: 'text-cyan-600 dark:text-cyan-400' },
    { type: 'Cardboard', points: 10, color: 'text-orange-600 dark:text-orange-400' },
    { type: 'Paper', points: 10, color: 'text-yellow-600 dark:text-yellow-400' },
    { type: 'Organic', points: 8, color: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Earn Rewards for Every Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get points for verified waste reports and unlock exclusive badges
          </p>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Unlock Badge Tiers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`${tier.bgColor} rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-4xl mb-3">{tier.emoji}</div>
                <div className={`text-lg font-bold ${tier.color} mb-1`}>
                  {tier.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tier.points} pts
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Points Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Points Per Kilogram
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pointsBreakdown.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.type}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    per kg
                  </div>
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>
                  {item.points}
                </div>
              </div>
            ))}
          </div>

          {/* Bonus Points Info */}
          <div className="mt-8 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Bonus Points Available!
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Create an event: <span className="font-semibold">50 points</span></li>
                  <li>• Join a community event: <span className="font-semibold">25 points</span></li>
                  <li>• Complete a job posting: <span className="font-semibold">Variable rewards</span></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
