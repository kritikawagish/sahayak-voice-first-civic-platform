'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg" />
            <span className="font-bold text-lg hidden sm:inline">Sahayak</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition">
              How It Works
            </a>
            <a href="#impact" className="text-gray-700 hover:text-gray-900 transition">
              Impact
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition">
              Contact
            </a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#features" className="block py-2 text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-gray-900">
              How It Works
            </a>
            <a href="#impact" className="block py-2 text-gray-700 hover:text-gray-900">
              Impact
            </a>
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}