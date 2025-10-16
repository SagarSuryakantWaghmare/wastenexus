'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, CalendarCheck, Target, TrendingUp, CheckCircle2, Users, Zap } from 'lucide-react';

export default function ChampionValueSection() {
  const benefits = [
    {
      id: 'management',
      icon: CalendarCheck,
      title: 'Streamlined Event Management',
      trigger: 'Plan. Coordinate. Execute.',
      content: 'Organize waste collection drives with our intuitive dashboard. Set dates, times, and locations, manage volunteer schedules, and track attendance in real time. No more spreadsheets or scattered communications—everything you need is centralized and accessible.',
      highlights: [
        'Automated event scheduling and reminders',
        'Real-time volunteer attendance tracking',
        'Integrated location mapping for easy navigation',
        'Customizable event templates for recurring drives',
      ],
    },
    {
      id: 'recruitment',
      icon: Users,
      title: 'Access to Motivated Volunteers',
      trigger: 'Unlimited Volunteer Pool at Your Fingertips',
      content: 'Connect instantly with a community of environmentally conscious Clients who are eager to participate. Filter volunteers by location, availability, and expertise. Build sustainable teams and scale your initiatives without recruitment overhead.',
      highlights: [
        'Pre-vetted volunteer community of thousands',
        'Advanced filtering by location, availability, and skills',
        'Automated volunteer communication and notifications',
        'Track individual volunteer contributions and impact',
      ],
    },
    {
      id: 'verification',
      icon: Target,
      title: 'Simple Verification & Rewards Dashboard',
      trigger: 'Review. Verify. Reward. Instantly.',
      content: 'Our verification system puts control in your hands. Review waste reports from Clients with detailed images and metrics. Award points instantly, celebrate achievements, and maintain platform integrity—all from a single, user-friendly dashboard.',
      highlights: [
        'One-click waste report verification',
        'Integrated image and weight validation tools',
        'Instant point allocation and reward triggering',
        'Compliance reporting for audits and transparency',
      ],
    },
    {
      id: 'impact',
      icon: TrendingUp,
      title: 'Real-Time Impact Tracking & Reporting',
      trigger: 'Measure. Report. Celebrate Your Success.',
      content: 'Access comprehensive analytics on waste processed, community participants, and environmental impact. Generate professional impact reports for donors, stakeholders, and funders. Showcase your achievements with data-driven visualizations and real-time metrics.',
      highlights: [
        'Live dashboards with waste diverted metrics',
        'Community participation analytics and demographics',
        'Carbon footprint reduction calculations',
        'Exportable impact reports for stakeholders',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Amplify Your Mission: The Champion Advantage
            </h2>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Waste Nexus empowers environmental Champions and NGOs with tools to scale their impact, streamline operations, and connect with passionate communities ready to make a difference.
          </p>
        </div>

        {/* Accordion - Benefits */}
        <Accordion type="single" collapsible defaultValue="management" className="w-full space-y-4 mb-10">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <AccordionItem
                key={benefit.id}
                value={benefit.id}
                className="bg-gray-700 border-gray-600 rounded-lg px-6 py-2 hover:bg-gray-650 transition-colors duration-200"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-start gap-4 text-left">
                    <div className="p-2 bg-green-400/20 rounded-lg flex-shrink-0 mt-1">
                      <IconComponent className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                      <p className="text-sm text-gray-400 font-medium mt-1">{benefit.trigger}</p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-0 pb-6 px-12">
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {benefit.content}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">
                      Key Features:
                    </p>
                    {benefit.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <p className="text-3xl font-bold text-white">500+</p>
            </div>
            <p className="text-gray-300 text-sm">Active Champions</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-3xl font-bold text-white">50K+</p>
            </div>
            <p className="text-gray-300 text-sm">Tons Diverted</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <p className="text-3xl font-bold text-white">100K+</p>
            </div>
            <p className="text-gray-300 text-sm">Community Members</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="bg-green-50/10 border border-green-400/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Scale Your Impact?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of environmental organizations transforming waste management with Waste Nexus. Get started today and empower your community.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto">
              <Shield className="w-5 h-5" />
              Become a Certified Champion
            </Button>
          </div>

          <p className="text-gray-400 text-sm">
            Have questions? <span className="text-green-400 font-semibold cursor-pointer hover:text-green-300">Contact our partnership team</span>
          </p>
        </div>
      </div>
    </section>
  );
}