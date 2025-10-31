import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Waste Collection Worker | Apply Now',
  description: 'Join WasteNexus as a waste collection worker. Earn competitive income, flexible work hours, and contribute to environmental sustainability. Apply online today.',
  keywords: [
    'waste collection jobs',
    'recycling jobs India',
    'waste management careers',
    'environmental jobs',
    'waste collector application',
    'green jobs',
    'sustainability careers',
    'waste pickup jobs',
    'recycling worker',
    'waste management employment',
  ],
  openGraph: {
    title: 'Become a Waste Collection Worker | Apply Now',
    description: 'Join WasteNexus as a waste collection worker. Earn competitive income, flexible work hours, and contribute to environmental sustainability.',
    type: 'website',
    url: '/worker/apply',
    images: [
      {
        url: '/og-worker.jpg',
        width: 1200,
        height: 630,
        alt: 'Join WasteNexus - Waste collection worker opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Waste Collection Worker | Apply Now',
    description: 'Join WasteNexus as a waste collection worker. Earn income while contributing to sustainability.',
    images: ['/og-worker.jpg'],
  },
};

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
