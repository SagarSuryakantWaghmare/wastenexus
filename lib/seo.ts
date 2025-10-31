/**
 * Canonical URL utility for SEO
 * Ensures consistent URL structure and prevents duplicate content issues
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wastenexus.com';

/**
 * Generate canonical URL for a page
 * @param path - The path of the page (e.g., '/marketplace', '/rewards')
 * @returns Fully qualified canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash except for root
  const cleanPath = path === '/' ? path : path.replace(/\/$/, '');
  
  // Remove query parameters and fragments for canonical
  const pathWithoutQuery = cleanPath.split('?')[0].split('#')[0];
  
  return `${baseUrl}${pathWithoutQuery}`;
}

/**
 * Generate Open Graph image URL
 * @param imageName - Name of the OG image (e.g., 'marketplace', 'rewards')
 * @returns Full OG image URL
 */
export function getOgImageUrl(imageName: string): string {
  return `${baseUrl}/og-${imageName}.jpg`;
}

/**
 * Generate Twitter image URL
 * @param imageName - Name of the Twitter image
 * @returns Full Twitter image URL
 */
export function getTwitterImageUrl(imageName: string): string {
  return `${baseUrl}/twitter-${imageName}.jpg`;
}

/**
 * Get base URL
 * @returns Base URL of the application
 */
export function getBaseUrl(): string {
  return baseUrl;
}
