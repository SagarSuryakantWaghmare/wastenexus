import { Smartphone, Route, Shield, BarChart, LucideIcon } from "lucide-react";

const WorkflowStep = ({ step, icon: Icon, title, description, userType, isLast }: {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  userType: string;
  isLast?: boolean;
}) => {
  return (
    <div className="relative">
      <div className="flex items-center space-x-6">
        {/* Step Number */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {step}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-3">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {userType}
                </span>
              </div>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting Line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-green-500 to-blue-500 z-0"></div>
      )}
    </div>
  );
};

const WorkflowSection = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Citizen Reports Issue",
      description: "Citizens use the mobile app to report overflowing bins, illegal dumping, or missed collections with geo-tagged photos.",
      userType: "Citizen"
    },
    {
      icon: Route,
      title: "AI Optimizes Routes",
      description: "Machine learning algorithms analyze reports, bin locations, and traffic data to generate optimal collection routes for waste workers.",
      userType: "System"
    },
    {
      icon: Shield,
      title: "Blockchain Logs Activity",
      description: "Every collection activity is recorded on an immutable blockchain ledger, ensuring transparency and preventing fraudulent reporting.",
      userType: "System"
    },
    {
      icon: BarChart,
      title: "ULB Monitors Progress",
      description: "Urban Local Body administrators track progress through real-time dashboards, analytics, and performance metrics.",
      userType: "ULB Admin"
    }
  ];

  const userTypes = [
    {
      name: "Citizens",
      description: "Report issues, learn segregation, earn rewards",
      features: ["Waste reporting", "Segregation training", "Green credits", "Community challenges"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Waste Workers",
      description: "Optimize routes, update status, ensure safety",
      features: ["Route optimization", "Collection tracking", "Safety checklists", "Performance metrics"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "ULB Administrators",
      description: "Monitor operations, analyze data, make decisions",
      features: ["Real-time dashboard", "Analytics & insights", "Alert management", "Resource planning"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Route className="w-4 h-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Seamless{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Workflow
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent system creates a seamless workflow connecting citizens, waste workers, 
            and administrators for efficient waste management.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">System Workflow</h3>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <WorkflowStep
                key={index}
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                userType={step.userType}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* User Types */}
        <div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Designed for Every Stakeholder</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className={`bg-gradient-to-br ${userType.color} rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6`}>
                  <span className="text-white font-bold text-2xl">{userType.name[0]}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{userType.name}</h4>
                <p className="text-gray-600 mb-6">{userType.description}</p>
                <ul className="space-y-2">
                  {userType.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;