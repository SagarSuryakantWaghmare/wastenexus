import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eco-Friendly Marketplace | Buy & Sell Sustainable Products',
  description: 'Discover unique eco-friendly products made from recycled materials. Buy and sell sustainable items, support circular economy, and earn green points on WasteNexus marketplace.',
  keywords: [
    'green marketplace',
    'sustainable products',
    'recycled materials',
    'eco-friendly marketplace',
    'circular economy',
    'sustainable shopping',
    'green products India',
    'recycled crafts',
    'upcycled items',
    'zero waste marketplace',
  ],
  openGraph: {
    title: 'Eco-Friendly Marketplace | Buy & Sell Sustainable Products',
    description: 'Discover unique eco-friendly products made from recycled materials. Buy and sell sustainable items, support circular economy, and earn green points.',
    type: 'website',
    url: '/marketplace',
    images: [
      {
        url: '/og-marketplace.jpg',
        width: 1200,
        height: 630,
        alt: 'WasteNexus Marketplace - Eco-friendly products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eco-Friendly Marketplace | Buy & Sell Sustainable Products',
    description: 'Discover unique eco-friendly products made from recycled materials. Support circular economy on WasteNexus.',
    images: ['/og-marketplace.jpg'],
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
