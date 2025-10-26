'use client';

import { Trophy, TrendingUp, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsSection() {
  const stats = [
    {
      icon: Trophy,
      value: '10,000+',
      label: 'Active Users',
      description: 'Making a difference daily',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: TrendingUp,
      value: '50,000+',
      label: 'Kg Waste Collected',
      description: 'Diverted from landfills',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Medal,
      value: '500+',
      label: 'Community Events',
      description: 'Organized and completed',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: Star,
      value: '1,000+',
      label: 'Verified Champions',
      description: 'Environmental organizations',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-green-600 dark:bg-green-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
            Join thousands making a real environmental difference
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`${stat.bgColor} w-16 h-16 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>

                {/* Value */}
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
