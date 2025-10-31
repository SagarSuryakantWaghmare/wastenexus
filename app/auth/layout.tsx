import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Join WasteNexus Community',
  description: 'Sign in to WasteNexus and access your personalized waste management dashboard. Report waste, earn rewards, participate in cleanup events, and track your environmental impact.',
  keywords: [
    'sign in',
    'login',
    'waste management login',
    'WasteNexus account',
    'environmental platform login',
    'recycling app login',
    'sustainability dashboard',
  ],
  openGraph: {
    title: 'Sign In | Join WasteNexus Community',
    description: 'Sign in to WasteNexus and access your personalized waste management dashboard.',
    type: 'website',
    url: '/auth/signin',
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Join WasteNexus Community',
    description: 'Sign in to WasteNexus and access your personalized waste management dashboard.',
  },
  robots: {
    index: false, // Don't index auth pages
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
