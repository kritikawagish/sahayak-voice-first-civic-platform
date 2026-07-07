'use client';

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  🎤 Voice-First Technology
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                  Empowering Citizens Through Voice
                </h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Apply for government schemes and file complaints using your voice. Breaking language barriers, one query at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Start Speaking
                </button>
                <button className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div
            className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">🎙️</span>
                  </div>
                  <p className="text-gray-600 font-semibold">Voice-Powered Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}