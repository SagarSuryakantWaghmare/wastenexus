import { Brain, Shield, MapPin, Users, Smartphone, BarChart3, LucideIcon } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, gradient }: {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}) => {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Route Optimization",
      description: "Machine learning algorithms analyze traffic patterns, bin capacity, and collection schedules to optimize waste collection routes, reducing fuel consumption by up to 40%.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Blockchain Transparency",
      description: "Immutable ledger system ensures complete transparency in waste collection processes, preventing fraud and enabling accurate tracking from bin to processing facility.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Real-Time Monitoring",
      description: "IoT sensors and GPS tracking provide real-time updates on bin fill levels, collection vehicle locations, and waste generation patterns across the city.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Citizen Engagement",
      description: "Gamified mobile app encourages proper waste segregation with rewards system, educational content, and community challenges to increase participation.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      icon: Smartphone,
      title: "Smart Reporting",
      description: "Citizens can report overflowing bins, illegal dumping, and missed collections with geo-tagged photos, creating a responsive waste management ecosystem.",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboard provides ULB administrators with actionable insights, predictive analytics, and performance metrics to optimize operations.",
      gradient: "bg-gradient-to-br from-teal-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Advanced Technology Stack
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Smart Cities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with user-friendly interfaces 
            to transform waste management across urban landscapes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your City?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join the smart waste management revolution and create a cleaner, more sustainable future for your community.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;