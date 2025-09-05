import WorkflowStepCard from "./WorkflowStepCard";
import { FaUpload, FaTruck, FaRecycle } from "react-icons/fa"; 

export default function WorkflowSection() {
  const steps = [
    {
      stepNumber: 1,
      title: "Report Waste",
      description: "Citizens upload geo-tagged photos of waste for collection.",
      icon: <FaUpload size={40} />,
    },
    {
      stepNumber: 2,
      title: "Collection & Transport",
      description: "Waste workers collect and transport waste efficiently using optimized routes.",
      icon: <FaTruck size={40} />,
    },
    {
      stepNumber: 3,
      title: "Recycle & Dispose",
      description: "ULBs and facilities recycle, treat, or dispose of waste responsibly.",
      icon: <FaRecycle size={40} />,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">How WastePulse Works</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Simplifying waste management with smart technology for citizens, workers, and municipalities.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <WorkflowStepCard
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </div>
    </section>
  );
}
