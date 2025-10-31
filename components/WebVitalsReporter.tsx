'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, initPerformanceMonitoring } from '@/lib/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric);
  });

  useEffect(() => {
    // Initialize performance monitoring in production only
    if (process.env.NODE_ENV === 'production') {
      initPerformanceMonitoring();
    }
  }, []);

  return null;
}
