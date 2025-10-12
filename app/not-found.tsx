import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent opacity-20">
              404
            </div>
            {/* Floating WasteNexus Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-xl animate-bounce">
                WN
              </div>
            </div>
          </div>
        </div>

        {/* Not Found Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Let&apos;s get you back to managing waste more efficiently!
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/citizen"
              className="inline-flex items-center justify-center rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50 hover:border-green-400 transition-all duration-200"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Citizen Portal
            </Link>
            
            <Link
              href="/worker"
              className="inline-flex items-center justify-center rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-700 shadow-sm hover:bg-orange-50 hover:border-orange-400 transition-all duration-200"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
              </svg>
              Worker Portal
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Pages</h3>
          <div className="space-y-2 text-sm">
            <Link href="/citizen/report" className="block text-gray-600 hover:text-blue-600 transition-colors">
              📍 Report Waste Issues
            </Link>
            <Link href="/worker/routes" className="block text-gray-600 hover:text-blue-600 transition-colors">
              🚛 Route Optimization
            </Link>
            <Link href="/citizen/certificates" className="block text-gray-600 hover:text-blue-600 transition-colors">
              🏆 Environmental Certificates
            </Link>
            <Link href="/worker/safety" className="block text-gray-600 hover:text-blue-600 transition-colors">
              🛡️ Safety Checklist
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6">
          <p className="text-xs text-gray-500">
            Still can&apos;t find what you&apos;re looking for?{' '}
            <a href="mailto:support@wastenexus.com" className="font-medium text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}