import { AlertTriangle, TrendingDown, Clock, EyeOff } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Inefficient Collection Routes",
      description: "Traditional waste collection follows fixed routes, leading to unnecessary fuel consumption and missed pickups.",
      stat: "40% fuel waste"
    },
    {
      icon: TrendingDown,
      title: "Poor Segregation Compliance",
      description: "Citizens lack proper education and motivation for waste segregation, reducing recycling efficiency.",
      stat: "Only 15% segregated"
    },
    {
      icon: Clock,
      title: "Delayed Response Times",
      description: "Manual reporting systems result in delayed responses to overflowing bins and waste emergencies.",
      stat: "3-5 days delay"
    },
    {
      icon: EyeOff,
      title: "Lack of Transparency",
      description: "No real-time visibility into collection processes leads to accountability issues and fraud.",
      stat: "Zero transparency"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Current Challenges
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Waste Management{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Crisis
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional waste management systems are failing to meet the demands of growing urban populations, 
            resulting in environmental damage and inefficient resource utilization.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 rounded-lg p-3 flex-shrink-0">
                  <problem.icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 mb-4">{problem.description}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                    {problem.stat}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Visualization */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">The Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">377M</div>
              <div className="text-red-100">Tons of waste generated annually in India</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">40%</div>
              <div className="text-red-100">Waste remains uncollected</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">₹50K Cr</div>
              <div className="text-red-100">Annual economic loss due to poor waste management</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">20%</div>
              <div className="text-red-100">Greenhouse gas emissions from waste</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;