"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import RolesSection from "@/components/Home/RolesSection";
import AIFeaturesSection from "@/components/Home/AIFeaturesSection";
import RewardsSection from "@/components/Home/RewardsSection";
import { Footer } from "@/components/Footer";
import { AppLoader } from "@/components/AppLoader";
export default function Home() {
  return (
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
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}
