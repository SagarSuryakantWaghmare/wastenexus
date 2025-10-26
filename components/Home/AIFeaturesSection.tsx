'use client';

import { Brain, Camera, MapPin, TrendingUp, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'Google Gemini AI Integration',
      description: 'Powered by advanced AI to automatically classify waste types with high accuracy and confidence scores.',
    },
    {
      icon: Camera,
      title: 'Smart Image Recognition',
      description: 'Upload a photo and instantly get waste type identification, recyclability status, and disposal recommendations.',
    },
    {
      icon: TrendingUp,
      title: 'Intelligent Insights',
      description: 'Get AI-generated recommendations based on your waste patterns to optimize your recycling habits.',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Classification',
      description: 'No need to guess - AI identifies waste type in seconds',
    },
    {
      icon: Shield,
      title: 'Accuracy Guaranteed',
      description: 'Confidence scores ensure reliable waste categorization',
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description: 'Smart location tracking for precise waste reporting',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Brain className="w-4 h-4" />
            AI-Powered
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Waste Management with AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Leverage the power of Google Gemini AI for accurate, intelligent waste classification
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-purple-100 dark:bg-purple-900/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
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

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
