'use client';

import { FileUp, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: FileUp,
      title: 'Report Your Waste',
      description: 'Upload a photo of your waste. Our AI automatically classifies it and suggests the best recycling method.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-600 dark:border-green-400'
    },
    {
      number: 2,
      icon: CheckCircle2,
      title: 'Get Verified',
      description: 'Environmental champions review your submission to ensure accuracy and award appropriate points.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      borderColor: 'border-blue-600 dark:border-blue-400'
    },
    {
      number: 3,
      icon: Award,
      title: 'Earn Rewards',
      description: 'Collect points, climb the leaderboard, and unlock exclusive badges and rewards for your environmental impact.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      borderColor: 'border-purple-600 dark:border-purple-400'
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Three simple steps to start making a difference
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Connector Line (Hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0" />
                )}

                {/* Card */}
                <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 z-10">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 ${step.bgColor} border-2 ${step.borderColor} rounded-full flex items-center justify-center font-bold text-lg ${step.color}`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`${step.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
