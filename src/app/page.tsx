"use client"
import React from 'react'
import { FaUserShield, FaUserTie } from "react-icons/fa";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Kuber Finserv
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
            Choose your portal to continue
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Admin Button */}
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 md:p-12 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <div className="relative z-10">
              <FaUserShield className="text-white text-4xl md:text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin</h2>
              <p className="text-blue-100 text-sm md:text-base opacity-90">
                System Administration Portal
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Employee Button */}
          <button
            onClick={() => window.location.href = '/employee/login'}
            className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 md:p-12 border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="relative z-10">
              <FaUserTie className="text-white text-4xl md:text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Employee</h2>
              <p className="text-purple-100 text-sm md:text-base opacity-90">
                Employee Access Portal
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-gray-500 text-sm">
            Secure Access Portal • Kuber Load
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage