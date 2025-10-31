'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  // Build breadcrumb path
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Format label (capitalize and replace hyphens)
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special labels for known routes
    const labelMap: Record<string, string> = {
      'auth': 'Authentication',
      'signin': 'Sign In',
      'signup': 'Sign Up',
      'marketplace': 'Marketplace',
      'rewards': 'Rewards',
      'dashboard': 'Dashboard',
      'admin': 'Admin Panel',
      'client': 'Client Dashboard',
      'worker': 'Worker Dashboard',
      'champion': 'Champion Dashboard',
      'apply': 'Apply',
      'create-event': 'Create Event',
      'create-job': 'Create Job',
      'report-waste': 'Report Waste',
      'leaderboard': 'Leaderboard',
      'my-items': 'My Items',
    };

    label = labelMap[segment] || label;

    // Skip numeric IDs in breadcrumb display
    if (!/^\d+$/.test(segment) && !/^[a-f0-9]{24}$/i.test(segment)) {
      breadcrumbItems.push({ label, href: currentPath });
    }
  });

  // Generate JSON-LD breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wastenexus.com'}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                )}
                {isLast ? (
                  <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center"
                  >
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
