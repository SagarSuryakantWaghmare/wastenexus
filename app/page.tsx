"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import RolesSection from "@/components/Home/RolesSection";
import AIFeaturesSection from "@/components/Home/AIFeaturesSection";
import RewardsSection from "@/components/Home/RewardsSection";
import FAQSection from "@/components/Home/FAQSection";
import { Footer } from "@/components/Footer";
import { AppLoader } from "@/components/AppLoader";

export default function Home() {
  // JSON-LD for Homepage
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WasteNexus",
    "applicationCategory": "EnvironmentalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Smart waste management platform with gamification, AI waste classification, eco-friendly marketplace, and community cleanup events",
    "operatingSystem": "Web",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Suspense fallback={<AppLoader />}>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <AIFeaturesSection />
            <RolesSection />
            <RewardsSection />
            <FAQSection />
          </main>
          <Footer />
        </div>
      </Suspense>
    </>
  );
}
