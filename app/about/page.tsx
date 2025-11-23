"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronLeft, Github, Star } from 'lucide-react';
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { SpinningText } from "@/components/ui/spinning-text";
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
    github: "https://github.com/kkrishhh",
    image: "/assets/images/soham.jpg",
    contributions: [
      "UI/UX design",
      "Performance optimization",
      "Component architecture",
      "Frontend debugging"
    ]
  }
];

const TeamMemberCard = ({ member, isLead = false }: { member: typeof teamMembers[0]; isLead?: boolean }) => {
  const [imgSrc, setImgSrc] = useState(member.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className={cn(
      'group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-visible transition-all duration-300 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-700 flex flex-col',
      isLead ? 'w-80' : 'w-72',
      'hover:-translate-y-2'
    )}>
      {isLead && (
        <div className="absolute top-6 -right-2 z-50">
          <div className="relative w-36 h-36">
            <SpinningText 
              baseVelocity={0.35}
              className="text-emerald-600 dark:text-emerald-400 font-bold text-sm"
              radius={4}
            >
              Lead Developer • Full Stack •
            </SpinningText>
          </div>
        </div>
      )}
      <div className={cn(
        'relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-t-xl',
        isLead ? 'h-96' : 'h-80'
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
                'object-cover transition-all duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0',
                'group-hover:scale-105'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImgSrc(FALLBACK_IMAGE);
                setImageLoaded(true);
              }}
              sizes={isLead ? '320px' : '288px'}
              priority={isLead}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <div className="space-y-1.5 w-full">
              <h4 className="text-white font-semibold text-sm mb-2">Key Contributions:</h4>
              {member.contributions.map((contribution, i) => (
                <div key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="text-xs text-white/90 leading-tight">{contribution}</span>
                </div>
              ))}
            </div>
          </div>
        </Suspense>
      </div>
      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{member.role}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            @{member.github.split('/').pop()}
          </span>
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

const ProjectOverviewSection = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
      <a
        href="https://github.com/SagarSuryakantWaghmare/wastenexus"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium text-sm"
      >
        <Star className="h-4 w-4" />
        Star on GitHub
      </a>
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
      WasteNexus is a cutting-edge waste management platform that revolutionizes how communities handle waste collection and recycling. By connecting three key stakeholders - Clients (waste generators), Champions (environmental organizers), and Workers (collection professionals) - we create a sustainable ecosystem that rewards responsible waste management.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mission</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Reduce landfill waste, create environmental impact, and build a sustainable future by making waste management accessible, rewarding, and efficient.
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Vision</h3>
        <p className="text-gray-600 dark:text-gray-300">
          A future where waste is no longer a problem but a valuable resource, creating a cleaner, greener world where every piece of waste is properly managed and recycled.
        </p>
      </div>
    </div>
  </div>
);

const CorePrinciplesSection = () => {
  const principles = [
    {
      title: "Sustainability First",
      description: "Every feature designed to reduce environmental impact"
    },
    {
      title: "Reward-Based",
      description: "Gamification through points, badges, and leaderboards"
    },
    {
      title: "AI-Powered",
      description: "Smart waste classification using Google Gemini AI"
    },
    {
      title: "Mobile-First",
      description: "Progressive Web App for seamless mobile experience"
    },
    {
      title: "Secure",
      description: "Role-based access control and JWT authentication"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Core Principles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {principles.map((principle, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 border-l-4 border-emerald-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{principle.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{principle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const KeyFeaturesSection = () => {
  const features = [
    {
      role: "For Clients",
      items: [
        "Report Waste with AI-powered classification",
        "Location Picker with auto-detect and manual selection",
        "Earn Rewards - points for every kg of waste reported",
        "Unlock Badges and climb the leaderboard",
        "Join Events - participate in community cleanup activities",
        "Post Jobs for waste collection services",
        "Marketplace - buy and sell recyclable items"
      ]
    },
    {
      role: "For Champions",
      items: [
        "Create & Manage Events - organize cleanup drives",
        "Verify Reports - review and approve waste submissions",
        "Track Participation - monitor community engagement",
        "Earn Points for organizing successful events",
        "Analytics Dashboard - view event statistics"
      ]
    },
    {
      role: "For Workers",
      items: [
        "View Verified Reports filtered by location (20km radius)",
        "Complete Tasks - mark reports as collected",
        "Browse Jobs - find waste collection opportunities",
        "Track Earnings - monitor completed tasks",
        "Location-Based Filtering - see only nearby reports",
        "Work Statistics - view performance metrics"
      ]
    },
    {
      role: "For Admins",
      items: [
        "User Management - manage all user roles",
        "Marketplace Moderation - approve/reject listings",
        "Analytics & Reports - platform-wide insights",
        "Event Management - oversee all events",
        "Gallery Management - showcase success stories",
        "Job Verification - review job postings",
        "Transaction Monitoring - track all point transactions",
        "Worker Applications - verify worker registrations"
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.role}</h3>
            <ul className="space-y-2">
              {feature.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const TechStackSection = () => {
  const techStack = [
    {
      category: "Frontend",
      technologies: [
        "Next.js 15.5.5 (App Router, React 19, Turbopack)",
        "TypeScript 5",
        "Tailwind CSS 4 + Framer Motion",
        "Radix UI + Custom Components",
        "React Hook Form + Zod",
        "@react-google-maps/api",
        "Lucide React + @tabler/icons-react",
        "Sonner",
        "next-pwa"
      ]
    },
    {
      category: "Backend",
      technologies: [
        "Node.js with Next.js API Routes",
        "MongoDB with Mongoose ODM",
        "JWT + bcryptjs",
        "Cloudinary",
        "Google Gemini AI (vision & text models)",
        "Nodemailer"
      ]
    },
    {
      category: "DevOps & Tools",
      technologies: [
        "Git & GitHub",
        "npm",
        "ESLint 9",
        "Prettier",
        "Turbopack (Next.js 15)",
        "Vercel / Netlify"
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tech Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techStack.map((stack, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{stack.category}</h3>
            <ul className="space-y-2">
              {stack.technologies.map((tech, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-emerald-500 mr-2 flex-shrink-0">•</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPageContent = () => {
  // Reorder team members: Akash, Sagar (center/lead), Soham
  const orderedTeam = [teamMembers[0], teamMembers[1], teamMembers[2]];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
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
                Meet Our <span className="text-emerald-600">Team</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The passionate minds behind WasteNexus, working together to revolutionize waste management.
              </p>
            </div>

            {/* Team Grid - Horizontally Centered */}
            <section className="mt-12">
              <h2 className="sr-only">Our Team</h2>
              <Suspense fallback={
                <div className="flex justify-center items-end gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <Skeleton className={cn("w-72", i === 2 ? "h-[520px]" : "h-[480px]")} />
                    </div>
                  ))}
                </div>
              }>
                <div className="flex justify-center items-end gap-6 flex-wrap">
                  {orderedTeam.map((member, index) => {
                    const isLead = member.name.includes('Sagar');
                    return (
                      <div key={`${member.name}-${index}`}>
                        <TeamMemberCard 
                          member={member} 
                          isLead={isLead}
                        />
                      </div>
                    );
                  })}
                </div>
              </Suspense>
            </section>

            {/* Project Overview */}
            <ProjectOverviewSection />

            {/* Core Principles */}
            <CorePrinciplesSection />

            {/* Key Features */}
            <KeyFeaturesSection />

            {/* Tech Stack */}
            <TechStackSection />
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
      <AboutPageContent />
    </>
  );
}
