import { Metadata } from 'next'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'WasteNux - Smart Waste Management',
  description: 'Revolutionizing waste management with AI-powered sorting and recycling solutions.',
  keywords: ['waste management', 'recycling', 'sustainability', 'AI waste sorting', 'eco-friendly'],
  authors: [{ name: 'WasteNexus Team' }],
  creator: 'WasteNexus',
  publisher: 'WasteNexus',
  metadataBase: new URL('https://wastenexus.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wastenexus.vercel.app',
    title: 'WasteNexus - Smart Waste Management',
    description: 'Revolutionizing waste management with AI-powered sorting and recycling solutions.',
    siteName: 'WasteNexus',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WasteNexus - Smart Waste Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WasteNexus - Smart Waste Management',
    description: 'Revolutionizing waste management with AI-powered sorting and recycling solutions.',
    images: ['/images/twitter-card.jpg'],
    creator: '@wastenexus',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}