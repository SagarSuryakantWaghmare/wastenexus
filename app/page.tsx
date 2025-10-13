"use client";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import ProblemSection from "@/app/components/LandingPage/ProblemSection";
import SolutionSection from "@/app/components/LandingPage/SolutionSection";
import FeaturesSection from "@/app/components/LandingPage/FeaturesSection";
import WorkflowSection from "@/app/components/LandingPage/WorkflowSection";
import StatsSection from "@/app/components/LandingPage/StatsSection";
import TestimonialSection from "@/app/components/LandingPage/TestimonialSection";
export default function HomePage() {

  return (
    <>
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="workflow">
          <WorkflowSection />
        </div>
        <div id="stats">
          <StatsSection />
        </div>
        <div id="testimonials">
          <TestimonialSection />
        </div>
      </main>
    </>
  );
}
