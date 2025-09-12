"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Recycle, MapPin } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: 40,
      suffix: "%",
      label: "Operational Efficiency Increase",
      description: "Through AI-powered route optimization and smart scheduling",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      value: 100000,
      suffix: "+",
      label: "Citizens Engaged",
      description: "Active users participating in the waste segregation program",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Recycle,
      value: 75,
      suffix: "%",
      label: "Waste Recycling Rate",
      description: "Improved segregation leads to higher recycling efficiency",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      value: 500,
      suffix: "+",
      label: "Smart Bins Deployed",
      description: "IoT-enabled bins across the city providing real-time data",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Impact Metrics
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Measurable{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Environmental Impact
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-world results from cities that have implemented WasteNexus smart waste management solutions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-8 mb-6 transform group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{stat.label}</h3>
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Impact Metrics */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Environmental Benefits</h3>
            <p className="text-gray-300">Contributing to a sustainable future through smart technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                <Counter end={2500} suffix=" tons" />
              </div>
              <p className="text-gray-300">CO₂ Emissions Reduced Annually</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                <Counter end={15} suffix=" million liters" />
              </div>
              <p className="text-gray-300">Fuel Saved Through Route Optimization</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                <Counter end={80} suffix="%" />
              </div>
              <p className="text-gray-300">Reduction in Illegal Dumping</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;