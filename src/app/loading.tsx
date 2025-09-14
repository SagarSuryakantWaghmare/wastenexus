export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-xl shadow-xl animate-pulse">
              WN
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 opacity-30 blur animate-ping"></div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 rounded-full bg-teal-500 animate-bounce"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          WasteNexus
        </h2>
        <p className="text-gray-600 text-lg">Loading your smart waste management dashboard...</p>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Optimizing routes and loading data...</p>
        </div>
      </div>
    </div>
  )
}