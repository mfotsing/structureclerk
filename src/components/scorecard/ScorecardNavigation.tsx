import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ScorecardNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScorecardClick = () => {
    // Track analytics
    console.log('Track Event: nav_scorecard_click');
    // Navigate to scorecard
    window.location.href = '#scorecard';
  };

  const handleLoginClick = () => {
    // Track analytics
    console.log('Track Event: nav_login_click');
    window.location.href = '/auth/login';
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo-icon.svg"
              alt="StructureClerk"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className={`text-xl font-bold ${
              isScrolled ? 'text-neutral-900' : 'text-white'
            }`}>
              <span>Structure</span>
              <span className="text-primary-600">Clerk</span>
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#transformation" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
              }`}
            >
              transformation
            </a>
            <a 
              href="#value-prop" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
              }`}
            >
              scorecard
            </a>
            <a 
              href="#credibility" 
              className={`font-medium transition-colors ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
              }`}
            >
              preuve
            </a>
            <button
              onClick={handleLoginClick}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
              }`}
            >
              connexion
            </button>
            <button
              onClick={handleScorecardClick}
              className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg shadow-lg hover:shadow-accent-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              calculer mon score
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-neutral-700' : 'text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#transformation"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                transformation
              </a>
              <a
                href="#value-prop"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                scorecard
              </a>
              <a
                href="#credibility"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                preuve
              </a>
              <button
                onClick={handleLoginClick}
                className="block w-full text-left px-3 py-2 text-neutral-700 hover:text-primary-600 font-medium"
              >
                connexion
              </button>
              <button
                onClick={handleScorecardClick}
                className="w-full px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg text-center"
              >
                calculer mon score
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ScorecardNavigation;