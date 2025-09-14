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
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'WasteNexus Dashboard'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'WasteNexus Mobile App'
      }
    ],
    shortcuts: [
      {
        name: 'Report Waste',
        short_name: 'Report',
        description: 'Quickly report waste issues in your area',
        url: '/citizen/report',
        icons: [{ src: '/shortcut-report.png', sizes: '96x96' }]
      },
      {
        name: 'Worker Dashboard',
        short_name: 'Dashboard',
        description: 'Access worker tools and routes',
        url: '/worker',
        icons: [{ src: '/shortcut-worker.png', sizes: '96x96' }]
      },
      {
        name: 'Safety Checklist',
        short_name: 'Safety',
        description: 'Complete safety inspections',
        url: '/worker/safety',
        icons: [{ src: '/shortcut-safety.png', sizes: '96x96' }]
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