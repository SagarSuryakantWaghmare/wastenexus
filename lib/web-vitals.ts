/**
 * Core Web Vitals monitoring utilities
 * Tracks LCP, FID, CLS, TTFB, and FCP
 */

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

// Thresholds for Core Web Vitals
export const webVitalsThresholds = {
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (ms)
};

/**
 * Get rating based on metric value
 */
export function getRating(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const threshold = webVitalsThresholds[name];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  const { name, value, id, rating } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      rating,
      id,
    });
  }
  
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_delta: metric.delta,
      metric_rating: rating,
    });
  }
  
  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: name,
        value,
        rating,
        id,
        timestamp: Date.now(),
        url: window.location.href,
      }),
    }).catch((err) => {
      console.error('Failed to send web vitals:', err);
    });
  }
}

/**
 * Performance observer for monitoring
 */
export function observePerformance() {
  if (typeof window === 'undefined') return;
  
  // Monitor Long Tasks (tasks taking > 50ms)
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('[Performance] Long Task detected:', {
          duration: Math.round(entry.duration),
          startTime: Math.round(entry.startTime),
        });
        
        // Track in analytics
        if (window.gtag) {
          window.gtag('event', 'long_task', {
            duration: Math.round(entry.duration),
          });
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  } catch {
    // Long Tasks API not supported
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return null;
  
  return {
    // Time to First Byte
    ttfb: navigation.responseStart - navigation.requestStart,
    
    // DOM Content Loaded
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    
    // Load Complete
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Total Page Load Time
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    
    // DNS Lookup Time
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    
    // TCP Connection Time
    tcpTime: navigation.connectEnd - navigation.connectStart,
    
    // Request Time
    requestTime: navigation.responseStart - navigation.requestStart,
    
    // Response Time
    responseTime: navigation.responseEnd - navigation.responseStart,
    
    // DOM Processing Time
    domProcessingTime: navigation.domComplete - navigation.domInteractive,
  };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics() {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = getPerformanceMetrics();
      
      if (metrics && process.env.NODE_ENV === 'development') {
        console.group('[Performance Metrics]');
        console.log('TTFB:', Math.round(metrics.ttfb), 'ms');
        console.log('Total Load Time:', Math.round(metrics.totalLoadTime), 'ms');
        console.log('DOM Content Loaded:', Math.round(metrics.domContentLoaded), 'ms');
        console.log('DNS Time:', Math.round(metrics.dnsTime), 'ms');
        console.log('TCP Time:', Math.round(metrics.tcpTime), 'ms');
        console.log('Response Time:', Math.round(metrics.responseTime), 'ms');
        console.groupEnd();
      }
    }, 0);
  });
}

/**
 * Monitor resource loading
 */
export function monitorResources() {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 1000) {
        console.warn('[Performance] Slow resource:', {
          name: entry.name,
          duration: Math.round(entry.duration),
          size: (entry as PerformanceResourceTiming).transferSize,
        });
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  logPerformanceMetrics();
  observePerformance();
  monitorResources();
}
