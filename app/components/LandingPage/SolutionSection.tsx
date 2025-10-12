import { CheckCircle, Zap, Target, Sparkles } from "lucide-react";

const SolutionSection = () => {
  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Optimization",
      description: "Machine learning algorithms optimize collection routes in real-time, reducing fuel consumption and improving efficiency.",
      benefits: ["40% fuel savings", "Real-time route adjustment", "Predictive maintenance"]
    },
    {
      icon: Target,
      title: "Gamified Citizen Engagement",
      description: "Interactive mobile app with rewards system motivates citizens to segregate waste properly and report issues.",
      benefits: ["85% participation increase", "Green credit rewards", "Educational content"]
    },
    {
      icon: CheckCircle,
      title: "Blockchain Transparency",
      description: "Immutable ledger system ensures complete accountability and transparency in all waste management operations.",
      benefits: ["100% transparency", "Fraud prevention", "Audit trail"]
    },
    {
      icon: Sparkles,
      title: "Smart Monitoring",
      description: "IoT sensors and real-time dashboards provide instant visibility into bin levels, vehicle locations, and system performance.",
      benefits: ["Real-time monitoring", "Instant alerts", "Performance analytics"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            WasteNexus Solution
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Intelligent Solutions for{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Modern Cities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            WasteNexus transforms traditional waste management through cutting-edge technology, 
            creating efficient, transparent, and sustainable urban waste systems.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-4 flex-shrink-0">
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Expected Results</h3>
            <p className="text-gray-600">Transform your city&apos;s waste management with measurable improvements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">40%</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fuel Savings</h4>
              <p className="text-gray-600 text-sm">Reduced through AI route optimization</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">85%</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Citizen Participation</h4>
              <p className="text-gray-600 text-sm">Increased through gamification</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">100%</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
              <p className="text-gray-600 text-sm">Complete audit trail via blockchain</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">60%</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cost Reduction</h4>
              <p className="text-gray-600 text-sm">Overall operational cost savings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;