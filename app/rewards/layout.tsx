import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earn Rewards for Recycling | Track Your Green Points',
  description: 'Track your recycling rewards, earn green points for waste reports, participate in cleanup events, and climb the leaderboard. Get rewarded for sustainable actions with WasteNexus.',
  keywords: [
    'recycling rewards',
    'earn points recycling',
    'green points',
    'waste management rewards',
    'environmental rewards',
    'sustainability incentives',
    'eco rewards program',
    'recycling leaderboard',
    'earn money recycling',
    'waste report rewards',
  ],
  openGraph: {
    title: 'Earn Rewards for Recycling | Track Your Green Points',
    description: 'Track your recycling rewards, earn green points for waste reports, participate in cleanup events, and climb the leaderboard.',
    type: 'website',
    url: '/rewards',
    images: [
      {
        url: '/og-rewards.jpg',
        width: 1200,
        height: 630,
        alt: 'WasteNexus Rewards - Earn points for recycling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn Rewards for Recycling | Track Your Green Points',
    description: 'Track your recycling rewards and earn green points for sustainable actions on WasteNexus.',
    images: ['/og-rewards.jpg'],
  },
};

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
