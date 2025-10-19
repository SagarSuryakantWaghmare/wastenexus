'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function BackButton({ 
  href, 
  label = 'Back', 
  variant = 'ghost',
  className 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn(
        'mb-6 dark:text-gray-100 dark:hover:bg-gray-800 transition-colors',
        className
      )}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
