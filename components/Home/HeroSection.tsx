'use client';

import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { CheckCircle, Users, Briefcase } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] sm:h-[700px] lg:h-[800px] flex items-center justify-center overflow-hidden transition-colors duration-300">
      {/* Background Image */}
      <Image
        src="/assets/bg.jpg"
        alt="Waste management sustainability"
        fill
        className="object-cover brightness-75"
        priority
        quality={90}
      />

  {/* Dark Overlay for Text Readability */}
  <div className="absolute inset-0 bg-gray-900/50" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white dark:text-gray-100 mb-6 leading-tight">
          Transform Waste Into Opportunity
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect waste generators with environmental champions. Reduce landfill waste, create impact, and build a sustainable future together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        </div>
      </div>
    </section>
  );
}