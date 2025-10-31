import type { Metadata, Viewport } from "next";
import { Toaster } from '@/components/ui/sonner';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SkipToMainContent } from "@/components/ui/semantic";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import "./globals.css";

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#166534' }
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://wastenexus.com'),
  title: {
    default: "WasteNexus - Smart Waste Management & Recycling Platform",
    template: "%s | WasteNexus"
  },
  description: "Join WasteNexus, India's leading gamified waste management platform. Report waste, earn rewards, buy sustainable products, and participate in community cleanup events. AI-powered waste classification & eco-friendly marketplace.",
  keywords: [
    "waste management",
    "recycling",
    "sustainability",
    "eco-friendly",
    "waste collection",
    "green marketplace",
    "environmental platform",
    "waste classification",
    "community cleanup",
    "earn rewards recycling",
    "waste management India",
    "sustainable living",
    "circular economy",
    "waste reduction"
  ],
  authors: [{ name: "WasteNexus Team" }],
  creator: "WasteNexus",
  publisher: "WasteNexus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "WasteNexus",
    title: "WasteNexus - Smart Waste Management & Recycling Platform",
    description: "Transform waste into rewards. Report waste, earn points, shop sustainably, and join community cleanup events. AI-powered waste management for a cleaner tomorrow.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WasteNexus - Smart Waste Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WasteNexus - Smart Waste Management & Recycling Platform",
    description: "Transform waste into rewards. AI-powered waste management, eco marketplace & community events.",
    images: ["/twitter-image.png"],
    creator: "@wastenexus",
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
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WasteNexus",
    "description": "Smart waste management and recycling platform with gamification, AI classification, and community engagement",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://wastenexus.com",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://wastenexus.com"}/logo.png`,
    "sameAs": [
      "https://twitter.com/wastenexus",
      "https://facebook.com/wastenexus",
      "https://linkedin.com/company/wastenexus",
      "https://instagram.com/wastenexus"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@wastenexus.com"
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WasteNexus",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://wastenexus.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://wastenexus.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <WebVitalsReporter />
        <SkipToMainContent />
        <AuthProvider>
          <ThemeProvider>
            <div id="main-content">
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
