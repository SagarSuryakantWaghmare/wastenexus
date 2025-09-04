import { Button } from "@/components/ui/button"; // Using ShadCN UI Button
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-green-50 px-6 text-center">
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
        Smart Waste Management for a Cleaner Tomorrow
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
        Track, report, and manage waste efficiently with AI & Blockchain.
        Empower citizens, workers, and municipalities to make India cleaner.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button variant="default" className="bg-green-600 text-white hover:bg-green-700">
          Get Started
        </Button>
        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-100">
          Learn More
        </Button>
      </div>

      {/* Hero Image */}
      <div className="mt-12 w-full max-w-4xl">
        <Image
          src="/hero-wastepulse.png" // Replace with your hero image
          alt="Waste Management"
          width={1200}
          height={600}
          className="rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
