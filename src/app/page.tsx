import Navbar from "@/app/components/common/Navbar";
import HeroSection from "@/app/components/LandingPage/HeroSection";
import WorkflowSection from "@/app/components/LandingPage/WorkflowSection";
import FeaturesSection from "@/app/components/LandingPage/FeaturesSection";
import StatsSection from "@/app/components/LandingPage/StatsSection";
import TestimonialSection from "@/app/components/LandingPage/TestimonialSection";
import SignupCTASection from "@/app/components/LandingPage/SignupCTASection";
import Footer from "@/app/components/common/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 space-y-32 ">
        <HeroSection />
        <WorkflowSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialSection />
        <SignupCTASection />
      </main>
      {/* <Footer /> */}
    </>
  );
}
