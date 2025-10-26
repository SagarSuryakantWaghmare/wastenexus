'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-green-600 dark:bg-green-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of environmental champions and start your journey towards a sustainable future today
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = '/auth/signup'}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => window.location.href = '/auth/signin'}
                className="bg-green-700 hover:bg-green-800 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-green-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
                <div>
                  <div className="text-3xl font-bold mb-1">Free</div>
                  <div className="text-green-100 text-sm">No credit card required</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">10k+</div>
                  <div className="text-green-100 text-sm">Active users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-green-100 text-sm">Support available</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
