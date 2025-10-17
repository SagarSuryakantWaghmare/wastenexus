import { IndianRupee } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  isNegotiable?: boolean;
  className?: string;
}

export default function PriceDisplay({ price, isNegotiable, className = '' }: PriceDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center text-2xl font-bold text-green-600">
        <IndianRupee className="w-5 h-5" />
        <span>{price.toLocaleString('en-IN')}</span>
      </div>
      {isNegotiable && (
        <span className="text-xs text-gray-500 font-medium">(Negotiable)</span>
      )}
    </div>
  );
}
