'use client';

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Semantic HTML page container with proper landmarks
 * Improves accessibility and SEO with semantic elements
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main role="main" className={`flex-1 ${className}`}>
      {children}
    </main>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

/**
 * Semantic section wrapper with ARIA labels
 */
export function Section({ children, className = '', ariaLabel, id }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </section>
  );
}

interface ArticleProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Semantic article wrapper for independent content
 */
export function Article({ children, className = '', ariaLabel }: ArticleProps) {
  return (
    <article aria-label={ariaLabel} className={className}>
      {children}
    </article>
  );
}

interface SkipLinkProps {
  href?: string;
}

/**
 * Skip to main content link for keyboard navigation
 */
export function SkipToMainContent({ href = '#main-content' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
