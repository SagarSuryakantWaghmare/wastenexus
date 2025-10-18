'use client';

import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Client",
      location: "Mumbai",
      text: "Waste Nexus made recycling fun and rewarding for my family! We've diverted over 200kg of waste in just 3 months and the kids are more conscious about the environment now.",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      role: "Champion",
      location: "Green Earth NGO, Delhi",
      text: "Organizing events is so easy, and I love seeing the impact! The platform streamlined our operations and helped us reach 10x more volunteers than before.",
      rating: 5,
    },
    {
      name: "Ayesha Khan",
      role: "Client",
      location: "Bangalore",
      text: "The leaderboard keeps me motivated to do more for my city. It's amazing to see the community come together and compete to make a positive environmental impact.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real people making a difference
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-green-600 dark:text-green-400 opacity-20" />
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-grow italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{testimonial.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Join thousands of satisfied users making an impact
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">4.9/5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">10K+</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">500+</p>
              <p className="text-sm text-gray-600 mt-1">Partner NGOs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
