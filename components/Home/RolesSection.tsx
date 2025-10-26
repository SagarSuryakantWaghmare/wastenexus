'use client';

import { User, Shield, Briefcase, TrendingUp, Award, Calendar, MapPin, Package, CheckCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RolesSection() {
  const roles = [
    {
      icon: User,
      title: 'For Clients',
      subtitle: 'Individuals & Households',
      description: 'Report waste, earn rewards, and contribute to a cleaner environment',
      features: [
        { icon: TrendingUp, text: 'Earn points for every kg of waste reported' },
        { icon: Award, text: 'Unlock badges and climb the leaderboard' },
        { icon: Calendar, text: 'Join community cleanup events' },
        { icon: Package, text: 'Post waste collection jobs' },
        { icon: ShoppingCart, text: 'Buy and sell recyclables' },
      ],
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-600 dark:border-green-400'
    },
    {
      icon: Shield,
      title: 'For Champions',
      subtitle: 'NGOs & Organizations',
      description: 'Verify reports, organize events, and drive environmental change',
      features: [
        { icon: CheckCircle, text: 'Review and verify waste reports' },
        { icon: Calendar, text: 'Create and manage cleanup events' },
        { icon: MapPin, text: 'Track community participation' },
        { icon: Award, text: 'Earn points for organizing events' },
        { icon: TrendingUp, text: 'Access analytics dashboard' },
      ],
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      borderColor: 'border-blue-600 dark:border-blue-400'
    },
    {
      icon: Briefcase,
      title: 'For Workers',
      subtitle: 'Waste Collection Professionals',
      description: 'Accept jobs, complete tasks, and earn income from waste collection',
      features: [
        { icon: Package, text: 'Browse and accept collection jobs' },
        { icon: MapPin, text: 'View job locations on map' },
        { icon: CheckCircle, text: 'Complete verified waste reports' },
        { icon: TrendingUp, text: 'Track earnings and completed tasks' },
        { icon: Calendar, text: 'Manage your work schedule' },
      ],
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      borderColor: 'border-purple-600 dark:border-purple-400'
    },
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
            Join as Your Role
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Whether you&apos;re an individual, organization, or professional - there&apos;s a place for you
          </p>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const RoleIcon = role.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`bg-white dark:bg-gray-800 border-2 ${role.borderColor} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300`}
              >
                {/* Icon Header */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`${role.bgColor} w-20 h-20 rounded-xl flex items-center justify-center`}>
                    <RoleIcon className={`w-10 h-10 ${role.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {role.title}
                </h3>
                <p className={`text-sm font-medium ${role.color} mb-4 text-center`}>
                  {role.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {role.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`${role.bgColor} p-1.5 rounded-lg flex-shrink-0 mt-0.5`}>
                          <FeatureIcon className={`w-4 h-4 ${role.color}`} />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {feature.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => window.location.href = (index === 2 ? '/worker/apply' : '/auth/signup')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    index === 0
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : index === 1
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Join as {role.title.replace('For ', '')}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
