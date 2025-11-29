'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col gap-3 mb-3"
        >
          <a
            href="/contact"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Contact Support"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href="/faq"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="FAQs"
          >
            <HelpCircle className="w-5 h-5" />
          </a>
        </motion.div>
      )}

      <motion.button
        onClick={isOpen ? () => setIsOpen(false) : scrollToTop}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl ${
          isOpen ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        } text-white transition-all`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close menu' : 'Scroll to top'}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
