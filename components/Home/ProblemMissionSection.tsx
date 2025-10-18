'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, BarChart3, Zap, TrendingUp } from 'lucide-react';

export default function ProblemMissionSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The Crisis & Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Understanding the scale of the problem and how Waste Nexus creates meaningful change
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Problem Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                The Global Waste Crisis
              </h3>
            </div>

            <p className="text-gray-700 dark:text-gray-400 mb-8 leading-relaxed">
              Every year, humanity generates over 2 billion tons of waste. In India alone, cities produce 377 million tons of waste annually, with only 43% being properly managed. Landfills overflow, oceans choke on plastics, and communities face severe health and environmental consequences.
            </p>

            {/* Bold Statistic */}
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-6 mb-8 rounded">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Critical Impact</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-red-900 dark:text-red-100">
                5.2B Kgs
              </p>
              <p className="text-red-800 dark:text-red-600 mt-2">
                of plastic enters oceans annually, harming marine ecosystems and human health
              </p>
            </div>

            {/* Supporting Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-400">Only 5-10% of plastic waste is recycled globally</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-400">Landfills emit 10% of global greenhouse gases</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-400">Communities lack access to waste management solutions</p>
              </div>
            </div>
          </Card>

          {/* Solution Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Waste Nexus: The Solution
              </h3>
            </div>

            <p className="text-gray-700 dark:text-gray-400 mb-8 leading-relaxed">
              Waste Nexus is a technology-driven platform that bridges the gap between waste generators and environmental champions. We democratize waste management, transforming the crisis into opportunities for individuals, organizations, and communities to create measurable environmental impact.
            </p>

            {/* Impact Highlight */}
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 p-6 mb-8 rounded">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Our Approach</p>
              </div>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                Connect • Collect • Impact
              </p>
              <p className="text-green-800 dark:text-green-600 mt-2">
                Link waste generators with NGOs and environmental initiatives for direct, measurable action
              </p>
            </div>

            {/* How It Works */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700"><span className="font-semibold">Clients</span> post waste, reducing landfill burden</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700"><span className="font-semibold">Champions</span> collect and process responsibly</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700"><span className="font-semibold">Communities</span> benefit from sustainable solutions</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <Separator className="mb-8 max-w-xs mx-auto dark:bg-gray-700" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Every action counts. Join thousands making a difference today.
          </p>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
            Together, we&apos;re turning waste into impact
          </p>
        </div>
      </div>
    </section>
  );
}