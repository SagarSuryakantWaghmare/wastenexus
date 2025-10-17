import { Badge } from '@/components/ui/badge';

interface ConditionBadgeProps {
  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';
}

export default function ConditionBadge({ condition }: ConditionBadgeProps) {
  const badgeStyles = {
    'Like New': 'bg-green-100 text-green-800 border-green-300',
    'Good': 'bg-blue-100 text-blue-800 border-blue-300',
    'Fair': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Needs Repair': 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <Badge variant="outline" className={`${badgeStyles[condition]} font-semibold`}>
      {condition}
    </Badge>
  );
}
