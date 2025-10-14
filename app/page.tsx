'use client'
import { useState } from 'react'
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin, TrendingUp, Award, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const [impactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });



  // useEffect(() => {
  //   async function fetchImpactData() {
  //     try {
  //       const reports = await getRecentReports(100);  // Fetch last 100 reports
  //       const rewards = await getAllRewards();
  //       const tasks = await getWasteCollectionTasks(100);  // Fetch last 100 tasks

  //       const wasteCollected = tasks.reduce((total, task) => {
  //         const match = task.amount.match(/(\d+(\.\d+)?)/);
  //         const amount = match ? parseFloat(match[0]) : 0;
  //         return total + amount;
  //       }, 0);

  //       const reportsSubmitted = reports.length;
  //       const tokensEarned = rewards.reduce((total, reward) => total + (reward.points || 0), 0);
  //       const co2Offset = wasteCollected * 0.5;  // Assuming 0.5 kg CO2 offset per kg of waste

  //       setImpactData({
  //         wasteCollected: Math.round(wasteCollected * 10) / 10, // Round to 1 decimal place
  //         reportsSubmitted,
  //         tokensEarned,
  //         co2Offset: Math.round(co2Offset * 10) / 10 // Round to 1 decimal place
  //       });
  //     } catch (error) {
  //       console.error("Error fetching impact data:", error);
  //       // Set default values in case of error
  //       setImpactData({
  //         wasteCollected: 0,
  //         reportsSubmitted: 0,
  //         tokensEarned: 0,
  //         co2Offset: 0
  //       });
  //     }
  //   }

  //   fetchImpactData();
  // }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <section 
        className="relative w-full min-h-[600px] bg-cover bg-center bg-no-repeat mb-24"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
            Smart Waste Management
            <span className="block text-green-400 mt-2">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Join thousands making a real impact. Report waste, earn rewards, and contribute to a cleaner, sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/reports">
              <Button className="bg-green-600 hover:bg-green-700 text-white text-base px-8 py-6 rounded-lg shadow-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Report Waste
              </Button>
            </Link>
            <Link href="/collect">
              <Button variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm text-base px-8 py-6 rounded-lg hover:bg-white/20">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
        <FeatureCard
          icon={Target}
          title="Report & Track"
          description="Easily report waste locations with photos and track your environmental impact in real-time."
        />
        <FeatureCard
          icon={Award}
          title="Earn Rewards"
          description="Get tokens and recognition for every contribution you make to waste management."
        />
        <FeatureCard
          icon={Users}
          title="Join Community"
          description="Connect with like-minded individuals committed to sustainable practices."
        />
      </section>

        {/* Impact Stats Section */}
        <section className="bg-gray-50 border border-gray-200 p-12 rounded-2xl mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Collective Impact</h2>
          <p className="text-gray-600">Real-time data from our growing community</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Recycle} />
          <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
          <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} />
          <ImpactCard title="CO2 Offset" value={`${impactData.co2Offset} kg`} icon={Leaf} />
        </div>
      </section>

        {/* CTA Section */}
        <section className="text-center bg-green-600 text-white p-12 rounded-2xl">
        <TrendingUp className="h-12 w-12 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
          Start your journey towards a cleaner environment today. Every action counts.
        </p>
        <Link href="/signup">
          <Button className="bg-white text-green-600 hover:bg-green-50 text-base px-8 py-6 rounded-lg shadow-sm">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        </section>
      </div>
    </div>
  )
}

function ImpactCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;

  return (
    <div className="text-center p-6">
      <Icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
      <p className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{formattedValue}</p>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white border border-gray-200 p-8 rounded-xl hover:border-green-200 hover:shadow-sm transition-all duration-300 ease-in-out">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 mb-5">
        <Icon className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
