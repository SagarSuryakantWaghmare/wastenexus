'use client';

import Image from 'next/image';

import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { CheckCircle, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      className="relative h-[700px] xs:h-[750px] sm:h-[780px] lg:h-[800px] flex items-center justify-center overflow-hidden transition-colors duration-300"
    >
      {/* Background Image */}
      <Image
        src="/assets/bg.jpg"
        alt="Waste management sustainability"
        fill
        className="object-cover brightness-80 filter dark:brightness-60 dark:contrast-125 dark:saturate-110"
        priority
        quality={90}
      />

  {/* Dark Overlay for Text Readability */}
  <div className="absolute inset-0 bg-gray-900/50" />

      {/* Content Container */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center w-full"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white dark:text-gray-100 mb-4 sm:mb-6 leading-tight"
        >
          Transform Waste Into Opportunity
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-base xs:text-lg sm:text-xl lg:text-2xl text-gray-100 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Connect waste generators with environmental champions. Reduce landfill waste, create impact, and build a sustainable future together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-3 xs:gap-4 w-full max-w-xl mx-auto
            sm:flex-row sm:gap-4 sm:justify-center sm:items-center"
        >
          {/* Primary CTA - Client Signup */}
          <InteractiveHoverButton
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold flex items-center gap-2 border-0"
            onClick={() => window.location.href = '/auth/signup'}
          >
            <CheckCircle className="w-5 h-5" />
            Start as Client
          </InteractiveHoverButton>

          {/* Secondary CTA - Champion/NGO Info */}
          <InteractiveHoverButton
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-6 text-lg font-semibold flex items-center gap-2"
            onClick={() => window.location.href = '/auth/signup'}
          >
            <Users className="w-5 h-5" />
            Join as Champion
          </InteractiveHoverButton>

          {/* Tertiary CTA - Worker Application */}
          <InteractiveHoverButton
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold flex items-center gap-2 border-0"
            onClick={() => window.location.href = '/worker/apply'}
          >
            <Briefcase className="w-5 h-5" />
            Join as Worker
          </InteractiveHoverButton>
        </motion.div>
      </div>
    </section>
  );
}