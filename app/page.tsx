"use client";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import ProblemSection from "@/app/components/LandingPage/ProblemSection";
import SolutionSection from "@/app/components/LandingPage/SolutionSection";
import FeaturesSection from "@/app/components/LandingPage/FeaturesSection";
import WorkflowSection from "@/app/components/LandingPage/WorkflowSection";
import StatsSection from "@/app/components/LandingPage/StatsSection";
import TestimonialSection from "@/app/components/LandingPage/TestimonialSection";
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useUser();
  // Example: user.publicMetadata.role should be set after sign up
  const role = user?.publicMetadata?.role;

  let portalLink = null;
  if (role === 'user') portalLink = <Link href="/citizen" className="block my-4 text-green-700 font-bold">Go to Citizen Portal</Link>;
  else if (role === 'worker') portalLink = <Link href="/worker" className="block my-4 text-green-700 font-bold">Go to Worker Portal</Link>;
  else if (role === 'champion') portalLink = <Link href="/champions" className="block my-4 text-green-700 font-bold">Go to Champions Portal</Link>;
  else if (role === 'government') portalLink = <Link href="/government" className="block my-4 text-green-700 font-bold">Go to Government Portal</Link>;

  return (
    <>
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        {portalLink}
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
