'use client';

import { Award, TrendingUp, Users, MapPin, Shield, BarChart, Recycle, Briefcase, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Marquee } from '@/components/ui/marquee';

export default function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: "Gamified Rewards System",
      description: "Earn points for every verified waste report. Unlock badges and climb through 6 reward tiers - from Beginner to Diamond.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: TrendingUp,
      title: "Live Leaderboard",
      description: "Track your progress and compete with others in your community. See real-time rankings and celebrate environmental champions.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Recycle,
      title: "AI-Powered Waste Classification",
      description: "Upload images of your waste and let our Google Gemini AI automatically classify it with confidence scores and recycling tips.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Join or organize local cleanup drives, workshops, and awareness campaigns. Connect with environmental champions in your area.",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      icon: MapPin,
      title: "Location-Based Services",
      description: "Find nearby collection points and events with integrated mapping. Report waste with precise GPS coordinates.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      icon: Shield,
      title: "Verified Champions",
      description: "Work with authenticated NGOs and environmental organizations. Every report is reviewed for accuracy and impact.",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    },
    {
      icon: Briefcase,
      title: "Job Marketplace",
      description: "Clients post waste collection jobs, workers accept them. Streamlined job management with admin verification.",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/20"
    },
    {
      icon: ShoppingBag,
      title: "Recyclables Marketplace",
      description: "Buy and sell recyclable materials and eco-friendly products. Turn waste into valuable resources.",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/20"
    },
    {
      icon: BarChart,
      title: "Impact Analytics",
      description: "Track your environmental impact with detailed analytics. See how much waste you've diverted from landfills.",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Awareness Quotes Marquee */}
        <Marquee className="mb-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 py-2">
          <span className="mx-8 text-green-700 dark:text-green-300 text-lg font-semibold flex items-center gap-2">
            ♻️ “Keep your city clean, make the Earth green!”
          </span>
          <span className="mx-8 text-blue-700 dark:text-blue-300 text-lg font-semibold flex items-center gap-2">
            🌎 “Reduce waste, reuse resources, recycle for the future.”
          </span>
          <span className="mx-8 text-emerald-700 dark:text-emerald-300 text-lg font-semibold flex items-center gap-2">
            💧 “Clean environment, better tomorrow.”
          </span>
          <span className="mx-8 text-lime-700 dark:text-lime-300 text-lg font-semibold flex items-center gap-2">
            🌱 “Waste is only waste if you waste it.”
          </span>
        </Marquee>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Every User
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to make a real environmental impact, all in one platform
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`${feature.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
