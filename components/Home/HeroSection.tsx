'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Waste Into Opportunity
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect waste generators with environmental champions. Reduce landfill waste, create impact, and build a sustainable future together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - Client Signup */}
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2"
            onClick={() => window.location.href = '/signup/client'}
          >
            <CheckCircle className="w-5 h-5" />
            Start as Client
          </Button>

          {/* Secondary CTA - Champion/NGO Info */}
          <Button
            size="lg"
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-6 text-lg font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2"
            onClick={() => window.location.href = '/info/champion'}
          >
            <Users className="w-5 h-5" />
            Join as Champion
          </Button>
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 pt-8 border-t border-white/30">
          <p className="text-gray-200 text-sm uppercase tracking-wide mb-4">
            Trusted by organizations across India
          </p>
          <div className="flex justify-center gap-8 flex-wrap opacity-80">
            <span className="text-white font-semibold">500+ Partners</span>
            <span className="text-white font-semibold">50K+ Waste Diverted</span>
            <span className="text-white font-semibold">25+ States</span>
          </div>
        </div>
      </div>
    </section>
  );
}