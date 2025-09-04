"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignupCTASection() {
  const router = useRouter();

  return (
    <section className="py-20 bg-green-50 text-center">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
        Join WastePulse Today
      </h2>

      {/* Subheading */}
      <p className="text-gray-700 max-w-2xl mx-auto mb-8">
        Sign up now to start reporting, tracking, and managing waste efficiently. 
        Help create a cleaner and greener community.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button
          variant="default"
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>
        <Button
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-100"
          onClick={() => router.push("/learn-more")}
        >
          Learn More
        </Button>
      </div>
    </section>
  );
}
