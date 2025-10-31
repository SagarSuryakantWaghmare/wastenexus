"use client";
import { motion } from "motion/react";
import React from "react";

/**
 * Primary Loader Component - Consistent across the entire website
 * Green-themed spinning circle with smooth animation
 * 
 * @param size - Size variant: 'sm' (16px), 'md' (24px), 'lg' (32px), 'xl' (48px)
 * @param className - Additional CSS classes for customization
 */
export const LoaderCircle = ({ 
  size = 'md',
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-green-600/20 border-t-green-600 dark:border-green-400/20 dark:border-t-green-400 ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Legacy support - redirect to LoaderCircle
export const LoaderOne = () => <LoaderCircle size="md" />;

/**
 * Page Loader Component - For full page loading states
 * Displays centered loader with optional loading message
 * 
 * @param message - Optional loading message to display below the loader
 */
export const PageLoader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoaderCircle size="xl" />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
