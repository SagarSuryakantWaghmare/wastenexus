import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// Removed ClerkProvider for MongoDB/JWT only
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import './globals.css'

// Convex


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'WasteNexus - Smart Waste Management System',
  description: 'Revolutionary AI-powered waste management platform connecting citizens, workers, and authorities for efficient, sustainable waste collection and environmental monitoring.',
  keywords: 'waste management, smart cities, AI waste detection, environmental sustainability, waste collection, recycling, smart bins, IoT waste monitoring',
  authors: [{ name: 'WasteNexus Team' }],
  creator: 'WasteNexus',
  publisher: 'WasteNexus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wastenexus.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WasteNexus - Smart Waste Management System',
    description: 'Revolutionary AI-powered waste management platform for sustainable cities',
    url: 'https://wastenexus.vercel.app/',
    siteName: 'WasteNexus',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WasteNexus - Smart Waste Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WasteNexus - Smart Waste Management System',
    description: 'Revolutionary AI-powered waste management platform for sustainable cities',
    images: ['/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WasteNexus" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 min-h-screen`}>
  {/* Removed ClerkProvider for MongoDB/JWT only */}
          <Navbar />
          <main className="relative">
            {children}
          </main>
          <Footer />
  {/* Removed ClerkProvider for MongoDB/JWT only */}
      </body>
    </html >
  )
}