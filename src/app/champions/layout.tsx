import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Green Champions Portal | WasteNexus',
  description: 'Manage environmental compliance, monitor waste collection areas, and engage with community members as a Green Champion.',
  keywords: 'green champions, environmental monitoring, waste compliance, community engagement, sustainability',
  openGraph: {
    title: 'Green Champions Portal | WasteNexus',
    description: 'Professional environmental monitoring and community engagement platform for Green Champions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Champions Portal | WasteNexus',
    description: 'Environmental monitoring and community engagement for Green Champions',
  },
};

export default function ChampionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}