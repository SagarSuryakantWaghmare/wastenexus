"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import { Footer } from "@/components/Footer";
import { AppLoader } from "@/components/AppLoader";
import ProblemMissionSection from "@/components/Home/ProblemMissionSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import FeatureShowcaseSection from "@/components/Home/FeatureShowcaseSection";
import ChampionValueSection from "@/components/Home/ChampionValueSection";

export default function Home() {
  return (
    <Suspense fallback={<AppLoader />}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ProblemMissionSection />
          <HowItWorksSection/>
          <FeatureShowcaseSection/>
          <ChampionValueSection/>
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}
