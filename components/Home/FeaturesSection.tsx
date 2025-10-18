'use client';

import { Award, TrendingUp, Users, MapPin, Shield, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: "Reward System",
      description: "Earn points for every verified waste report and redeem for exciting rewards. Track your contributions and celebrate your environmental impact.",
    },
    {
      icon: TrendingUp,
      title: "Leaderboard",
      description: "Track your progress and compete with others in your community. Climb the ranks and become a top environmental champion.",
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Participate in local cleanups, workshops, and awareness campaigns. Connect with like-minded individuals making a difference.",
    },
    {
      icon: MapPin,
      title: "Smart Location Tracking",
      description: "Find nearby collection points and events with our integrated mapping system. Make participation convenient and accessible.",
    },
    {
      icon: Shield,
      title: "Verified Champions",
      description: "Work with authenticated NGOs and environmental organizations. Trust and transparency in every interaction.",
    },
    {
      icon: BarChart,
      title: "Impact Analytics",
      description: "View detailed reports of your environmental contributions. Measure and share your positive impact on the planet.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to make a meaningful environmental impact, all in one powerful platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-start h-full">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                    <IconComponent className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
