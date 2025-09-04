import { ReactElement } from "react";

interface WorkflowStepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon?: ReactElement; 
}

export default function WorkflowStepCard({ stepNumber, title, description, icon }: WorkflowStepCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
      {icon && <div className="mb-4 text-green-600">{icon}</div>}
      <div className="text-2xl font-bold text-green-700 mb-2">Step {stepNumber}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
