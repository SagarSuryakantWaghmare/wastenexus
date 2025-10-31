'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Extend window interface for gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Event tracking utility
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }
};

// Common event trackers
export const analytics = {
  // Waste report events
  reportWaste: (wasteType: string) => {
    trackEvent('report_waste', 'engagement', wasteType);
  },
  
  // Marketplace events
  viewItem: (itemId: string, itemName: string) => {
    trackEvent('view_item', 'marketplace', itemName);
  },
  
  addToCart: (itemId: string, itemName: string, price: number) => {
    trackEvent('add_to_cart', 'marketplace', itemName, price);
  },
  
  purchase: (itemId: string, itemName: string, price: number) => {
    trackEvent('purchase', 'marketplace', itemName, price);
  },
  
  // User events
  signup: (role: string) => {
    trackEvent('sign_up', 'user', role);
  },
  
  login: (role: string) => {
    trackEvent('login', 'user', role);
  },
  
  // Event participation
  joinEvent: (eventId: string, eventName: string) => {
    trackEvent('join_event', 'community', eventName);
  },
  
  completeEvent: (eventId: string, eventName: string) => {
    trackEvent('complete_event', 'community', eventName);
  },
  
  // Rewards
  redeemReward: (rewardType: string, points: number) => {
    trackEvent('redeem_reward', 'rewards', rewardType, points);
  },
  
  // Worker application
  applyWorker: () => {
    trackEvent('apply_worker', 'conversion', 'worker_application');
  },
  
  // Job creation
  createJob: (jobType: string) => {
    trackEvent('create_job', 'engagement', jobType);
  },
};
