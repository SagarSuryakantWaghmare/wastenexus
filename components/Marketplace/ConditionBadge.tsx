import { Badge } from '@/components/ui/badge';

interface ConditionBadgeProps {
  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';
}

export default function ConditionBadge({ condition }: ConditionBadgeProps) {
  const badgeStyles = {
    'Like New': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    'Good': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    'Fair': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    'Needs Repair': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  };

  return (
    <Badge variant="outline" className={`${badgeStyles[condition]} font-semibold transition-colors duration-300`}>
      {condition}
    </Badge>
  );
}
