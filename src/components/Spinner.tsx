import React from 'react'

function SpinnerComp() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 border-4 border-blue-500 border-opacity-30 rounded-full"></div>
        
        {/* Spinning element */}
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Optional loading text */}
      <div className="absolute bottom-1/4">
        <p className="text-white text-lg font-medium mt-4">Loading...</p>
      </div>
    </div>
  )
}

export default SpinnerComp