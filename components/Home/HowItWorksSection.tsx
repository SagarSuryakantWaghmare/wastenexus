'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, CheckCircle, Gift, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: Trash2,
      headline: 'Report Your Waste',
      description: 'Easily log your recyclable or compostable waste directly through our app. Select type, input weight, and hit submit.',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      number: 2,
      icon: CheckCircle,
      headline: 'Get Verified',
      description: 'Our dedicated Champions review and verify your reports, ensuring accuracy and impact.',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      number: 3,
      icon: Gift,
      headline: 'Earn Rewards',
      description: 'Accumulate points with every verified report, climb the leaderboard, and unlock exciting eco-friendly rewards!',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works: Your Path to Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to make a real difference. Report your waste, get verified, and earn rewards.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-stretch">
          {steps.map((step, index) => {
            const IconComponent = step.icon;

            return (
              <div key={step.number} className="flex flex-col items-stretch">
                {/* Step Card */}
                <Card className={`${step.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col h-full`}>
                  {/* Step Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">
                      {String(step.number).padStart(2, '0')}
                    </span>
                  </div>

                  <CardHeader>
                    {/* Icon */}
                    <div className={`${step.iconBg} w-14 h-14 rounded-lg flex items-center justify-center mb-4 w-fit`}>
                      <IconComponent className={`w-7 h-7 ${step.iconColor}`} />
                    </div>

                    {/* Title */}
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">
                      {step.headline}
                    </CardTitle>
                  </CardHeader>

                  {/* Description */}
                  <CardContent className="flex-1">
                    <CardDescription className="text-base text-gray-700 leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Arrow Between Steps (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center items-center -mx-2 mt-6">
                    <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg font-medium mb-2">
            Ready to start making an impact?
          </p>
          <p className="text-gray-600">
            Join thousands of Clients already transforming waste into opportunity
          </p>
        </div>
      </div>
    </section>
  );
}