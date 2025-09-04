import FeatureCard from "./FeatureCard";
import { Trash2, Leaf, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">Key Features</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          WastePulse combines AI, real-time monitoring, and rewards to create a smarter waste management system.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="AI-Powered Waste Sorting"
          description="Automatically classify wet, dry, and plastic waste for efficient processing."
          Icon={Trash2}
        />
        <FeatureCard
          title="Real-Time Tracking"
          description="Geo-tagged waste tracking for bins and trucks to optimize collection routes."
          Icon={Leaf}
        />
        <FeatureCard
          title="Secure & Transparent"
          description="Blockchain-powered records ensure transparent waste management and incentives."
          Icon={ShieldCheck}
        />
      </div>
    </section>
  );
}
