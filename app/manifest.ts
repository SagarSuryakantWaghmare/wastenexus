import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WasteNexus - Smart Waste Management',
    short_name: 'WasteNexus',
    description: 'Revolutionary AI-powered waste management platform for sustainable cities',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    orientation: 'portrait',
    scope: '/',
    categories: ['productivity', 'utilities', 'lifestyle'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
    shortcuts: [
      {
        name: 'Report Waste',
        short_name: 'Report',
        description: 'Quickly report waste issues in your area',
        url: '/citizen/report'
      },
      {
        name: 'Worker Dashboard',
        short_name: 'Dashboard',
        description: 'Access worker tools and routes',
        url: '/worker'
      },
      {
        name: 'Safety Checklist',
        short_name: 'Safety',
        description: 'Complete safety inspections',
        url: '/worker/safety'
      }
    ],
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.wastenexus.app',
        id: 'com.wastenexus.app'
      },
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/wastenexus/id123456789'
      }
    ],
    prefer_related_applications: false
  }
}