"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronLeft, Github } from 'lucide-react';
import { SpinningText } from "@/components/ui/spinning-text";
import { PixelImage } from "@/components/ui/pixel-image";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Fallback image URL
const FALLBACK_IMAGE = "/assets/logo/recycle-symbol.png";

// Custom cursor component for the about page
const AboutPageCursor = () => (
  <SmoothCursor 
    cursor={
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400/80" />
    }
    springConfig={{
      damping: 20,
      stiffness: 300,
      mass: 0.5,
      restDelta: 0.001,
    }}
  />
);

const teamMembers = [
  {
    name: "Akash Sonar",
    role: "Database Designer",
    github: "https://github.com/SonarAkash",
    image: "/assets/images/akash.jpg",
    contributions: [
      "MongoDB schema design",
      "Data modeling & optimization",
      "Query performance tuning",
      "Data security & validation"
    ]
  },
  {
    name: "Sagar Suryakant Waghmare",
    role: "Full Stack Developer",
    github: "https://github.com/sagarsuryakantwaghmare",
    image: "/assets/images/sagar.jpg",
    contributions: [
      "Architecture & system design",
      "Frontend & Backend development",
      "AI integration",
      "PWA implementation",
      "DevOps & deployment"
    ]
  },
  {
    name: "Soham Pawar",
    role: "Frontend Developer",
    github: "https://github.com/sohampawar",
    image: "/assets/images/soham.jpg",
    contributions: [
      "UI/UX design",
      "Performance optimization",
      "Component architecture",
      "Frontend debugging"
    ]
  }
];

const MissionVisionSection = () => (
  <div className="space-y-12 mt-16">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
        At WasteNexus, we're on a mission to transform waste management through innovative technology and community engagement. 
        We believe in creating sustainable solutions that make a real difference in how communities handle waste.
      </p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
        We envision a future where waste is no longer a problem but a valuable resource. 
        Through our platform, we're building a cleaner, greener world where every piece of waste is properly managed and recycled.
      </p>
    </div>
  </div>
);

const TeamMemberCard = ({ member, isHighlighted = false, isCenter = false }: { member: typeof teamMembers[0]; index: number; isHighlighted?: boolean; isCenter?: boolean }) => {
  const [imgSrc, setImgSrc] = useState(member.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className={cn(
      'group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-visible transition-all duration-300 hover:shadow-xl h-full flex flex-col',
      isCenter ? 'sm:row-span-2' : '',
      isHighlighted 
        ? 'ring-2 ring-emerald-500 scale-105 z-20' 
        : 'hover:-translate-y-1',
      isCenter ? 'transform sm:scale-105' : 'sm:scale-95 hover:scale-100'
    )}>
      {isCenter && (
        <div className="absolute top-4 right-4 z-30">
          <div className="relative">
            <SpinningText 
              baseVelocity={0.5}
              className="text-emerald-500 font-medium text-sm bg-white/95 dark:bg-gray-900/95 px-4 py-1.5 rounded-full shadow-lg border border-emerald-100 dark:border-emerald-900/50 whitespace-nowrap"
            >
              Lead Developer • Tech Lead • Full Stack Expert
            </SpinningText>
          </div>
        </div>
      )}
      <div className={cn(
        'relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700',
        isCenter ? 'h-80 sm:h-96' : 'h-64'
      )}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        }>
          <div className="w-full h-full relative">
            <Image
              src={imgSrc}
              alt={member.name}
              fill
              className={cn(
                'object-cover transition-opacity duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImgSrc(FALLBACK_IMAGE);
                setImageLoaded(true);
              }}
              sizes={isCenter ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              priority={isCenter}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <div className="space-y-2 w-full">
              <h4 className="text-white font-semibold text-lg">Key Contributions:</h4>
              {member.contributions.map((contribution, i) => (
                <div key={i} className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-sm text-white/90">{contribution}</span>
                </div>
              ))}
            </div>
          </div>
        </Suspense>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
          <p className="text-emerald-600 dark:text-emerald-400 mb-4">{member.role}</p>
        </div>
        <div className="flex space-x-3 mt-4">
          <a 
            href={member.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            aria-label={`${member.name}'s GitHub`}
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const AboutPageContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              aria-label="Back to home"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Link>
          </div>

          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                <ScrollVelocityRow baseVelocity={0.5}>
                  Meet Our <span className="text-emerald-600">Team</span>
                </ScrollVelocityRow>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The passionate minds behind WasteNexus, working together to revolutionize waste management.
              </p>
            </div>

            {/* Team Grid */}
            <section className="mt-12">
              <h2 className="sr-only">Our Team</h2>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                  {teamMembers.map((member, index) => {
                    const isSagar = member.name.includes('Sagar');
                    return (
                      <div 
                        key={`${member.name}-${index}`}
                        className={cn(
                          'transition-all duration-300 w-full',
                          isSagar ? 'sm:col-start-2' : 'sm:col-auto',
                          isSagar ? 'sm:row-span-2' : 'sm:row-auto'
                        )}
                      >
                        <TeamMemberCard 
                          member={member} 
                          index={index}
                          isHighlighted={isSagar}
                          isCenter={isSagar}
                        />
                      </div>
                    );
                  })}
                </div>
              </Suspense>
            </section>

            {/* Mission & Vision */}
            <MissionVisionSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function AboutPage() {
  return (
    <>
      <AboutPageCursor />
      <ScrollVelocityContainer>
        <AboutPageContent />
      </ScrollVelocityContainer>
    </>
  );
}
