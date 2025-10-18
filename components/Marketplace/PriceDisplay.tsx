import { IndianRupee } from 'lucide-react';

interface PriceDisplayProps {
  price?: number | null;
  isNegotiable?: boolean;
  className?: string;
  size?: 'normal' | 'large';
}

export default function PriceDisplay({ price, isNegotiable, className = '', size = 'normal' }: PriceDisplayProps) {
  const textSize = size === 'large' ? 'text-3xl' : 'text-2xl';
  const iconSize = size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
  const formattedPrice = typeof price === 'number' ? price.toLocaleString('en-IN') : 'N/A';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center ${textSize} font-bold text-green-600 dark:text-green-400`}>
        <IndianRupee className={iconSize} />
        <span>{formattedPrice}</span>
      </div>
      {isNegotiable && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">(Negotiable)</span>
      )}
    </div>
  );
}
