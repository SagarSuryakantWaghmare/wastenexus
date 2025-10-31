'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does WasteNexus work?',
    answer: 'WasteNexus connects waste generators with collection workers and environmental champions. Users report waste through our platform, earn green points for verified reports, participate in cleanup events, and shop on our eco-friendly marketplace. Our AI-powered system classifies waste and optimizes collection routes.',
  },
  {
    question: 'How can I earn rewards on WasteNexus?',
    answer: 'You can earn green points by reporting waste, participating in community cleanup events, completing environmental tasks, and referring friends. These points can be redeemed for marketplace items, gift cards, or donated to environmental causes.',
  },
  {
    question: 'Is WasteNexus free to use?',
    answer: 'Yes! WasteNexus is completely free for all users. You can report waste, track your impact, earn rewards, and join community events at no cost. The marketplace has listing fees for sellers, but browsing and buying are free.',
  },
  {
    question: 'What types of waste can I report?',
    answer: 'You can report various types of waste including household waste, recyclable materials (plastic, paper, glass, metal), e-waste, organic waste, and hazardous waste. Our AI classification system helps identify waste types and suggests proper disposal methods.',
  },
  {
    question: 'How do I become a waste collection worker?',
    answer: 'Visit our Worker Apply page, fill out the application form with your details, upload required documents (photo and ID proof), and submit. Our team will review your application within 48 hours and contact you for onboarding.',
  },
  {
    question: 'What is the marketplace?',
    answer: 'Our eco-friendly marketplace allows users to buy and sell sustainable products made from recycled or upcycled materials. It promotes circular economy by giving new life to waste materials and supporting green entrepreneurs.',
  },
  {
    question: 'How are waste collection workers verified?',
    answer: 'All waste collection workers undergo a thorough verification process including document verification, background checks, and training. They receive a verified badge on their profile and are monitored for quality service.',
  },
  {
    question: 'Can I track my environmental impact?',
    answer: 'Yes! Your dashboard shows detailed analytics including total waste reported, weight collected, CO2 emissions prevented, trees saved, and your ranking on the community leaderboard. Track your journey toward sustainability.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about WasteNexus
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:support@wastenexus.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
