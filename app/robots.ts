import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wastenexus.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/marketplace',
          '/marketplace/*',
          '/rewards',
          '/worker/apply',
        ],
        disallow: [
          '/api/*',
          '/dashboard/*',
          '/*.json',
          '/*?*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/auth/*',
          '/marketplace',
          '/marketplace/*',
          '/rewards',
          '/worker/apply',
        ],
        disallow: [
          '/api/*',
          '/dashboard/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
