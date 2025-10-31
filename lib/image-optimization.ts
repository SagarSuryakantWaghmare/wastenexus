/**
 * Image optimization utilities
 * Helpers for using Next.js Image component with best practices
 */

import type { ImageProps } from 'next/image';

// Common image sizes for responsive images
export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  hero: { width: 1920, height: 1080 },
};

// Image quality presets
export const imageQuality = {
  low: 50,
  medium: 75,
  high: 85,
  maximum: 95,
};

/**
 * Get optimized image props for Next.js Image component
 */
export function getImageProps(
  src: string,
  alt: string,
  size: keyof typeof imageSizes = 'medium',
  priority = false
): Partial<ImageProps> {
  const dimensions = imageSizes[size];
  
  return {
    src,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    quality: priority ? imageQuality.high : imageQuality.medium,
    loading: priority ? undefined : 'lazy',
    priority,
  };
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map((size) => `${src}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Get Cloudinary optimized URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  } = {}
): string {
  const {
    width = 800,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return publicId;
  }

  const transformations = [
    `w_${width}`,
    height ? `h_${height}` : null,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Validate image alt text
 */
export function validateAltText(alt: string, src: string): boolean {
  if (!alt || alt.trim().length === 0) {
    console.warn(`Missing alt text for image: ${src}`);
    return false;
  }

  if (alt.length < 5) {
    console.warn(`Alt text too short for image: ${src}`);
    return false;
  }

  if (alt.length > 125) {
    console.warn(`Alt text too long for image: ${src}. Keep under 125 characters.`);
    return false;
  }

  // Check for poor alt text practices
  const poorPractices = ['image', 'picture', 'photo', 'img'];
  const lowerAlt = alt.toLowerCase();
  const hasPoorPractice = poorPractices.some(term => 
    lowerAlt.startsWith(term + ' of') || 
    lowerAlt === term
  );

  if (hasPoorPractice) {
    console.warn(`Alt text could be more descriptive for image: ${src}`);
    return false;
  }

  return true;
}

/**
 * Get blur data URL for placeholder
 */
export function getBlurDataURL(color = '#f3f4f6'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect filter='url(%23b)' width='8' height='8' fill='${color}'/%3E%3C/svg%3E`;
}

/**
 * Calculate aspect ratio
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Image optimization recommendations
 */
export const imageOptimizationTips = {
  formats: 'Use AVIF/WebP for modern browsers, fallback to JPEG/PNG',
  compression: 'Keep quality between 75-85 for web, 50-65 for thumbnails',
  dimensions: 'Set explicit width/height to prevent Cumulative Layout Shift',
  lazy: 'Use loading="lazy" for below-fold images',
  priority: 'Use priority prop for LCP images (hero, above-fold)',
  alt: 'Write descriptive alt text (5-125 chars), describe what image shows',
  responsive: 'Use sizes prop to serve different image sizes per viewport',
  cdn: 'Use CDN (Cloudinary, Imgix) for automatic optimization',
};
