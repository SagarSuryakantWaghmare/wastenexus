import { ArrowRight, Recycle, Zap, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center  overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full  text-green-800 text-sm font-medium mb-8">
          <Zap className="w-4 h-4 mr-2" />
          Smart Waste Management Revolution
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Transform Your City with{" "}
          <span className="bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          Waste Management
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          WasteNexus combines artificial intelligence, blockchain technology, and real-time monitoring 
          to revolutionize waste collection, enhance segregation practices, and create cleaner, smarter cities.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <Recycle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">AI Route Optimization</span>
          </div>
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Blockchain Transparency</span>
          </div>
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <Zap className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-gray-700 font-medium">Real-time Monitoring</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center">
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 transition-all duration-300 flex items-center">
            Watch Demo
            <div className="w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">Trusted by Urban Local Bodies across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-semibold">Municipal Corporation</div>
            <div className="text-gray-400 font-semibold">Smart City Mission</div>
            <div className="text-gray-400 font-semibold">Swachh Bharat</div>
            <div className="text-gray-400 font-semibold">Green Initiative</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;