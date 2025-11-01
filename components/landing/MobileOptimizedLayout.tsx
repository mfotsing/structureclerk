'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
}

export default function MobileOptimizedLayout({ children }: MobileOptimizedLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const mobileNavigation = [
    { name: 'Overview', target: 'hero' },
    { name: 'Metrics', target: 'metrics' },
    { name: 'Advantages', target: 'advantages' },
    { name: 'Scaling', target: 'scaling' },
    { name: 'Pricing', target: 'pricing' },
    { name: 'Contact', target: 'contact' }
  ];

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-lg font-bold">StructureClerk</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t border-white/10"
        >
          <div className="py-4 space-y-1">
            {mobileNavigation.map((item) => (
              <button
                key={item.target}
                onClick={() => handleSmoothScroll(item.target)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>{item.name}</span>
                <ChevronDown className="w-4 h-4 transform rotate-[-90deg]" />
              </button>
            ))}
            <div className="px-4 py-3 border-t border-white/10 mt-2">
              <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-semibold">
                Contact Investors
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Main Content with proper spacing for mobile nav */}
      <div className="pt-14">
        {children}
      </div>

      {/* Mobile Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => handleSmoothScroll('contact')}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </motion.div>

      {/* Mobile Optimization Styles */}
      <style jsx>{`
        /* Prevent horizontal scrolling on mobile */
        body {
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        /* Optimize touch targets for mobile */
        button, a {
          min-height: 44px;
          min-width: 44px;
        }

        /* Improve text readability on mobile */
        p, span, div {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Optimize images for mobile */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Prevent zoom on input focus */
        input, textarea, select {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

// Mobile-specific components
export function MobileHeroSection() {
  return (
    <section className="relative py-16 px-4 min-h-screen flex items-center">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center bg-red-900/30 border border-red-500/30 rounded-full px-3 py-1 text-xs font-semibold">
            <span className="text-red-400">🍁 CANADIAN UNICORN</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-4 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          <span className="text-xl text-red-400">
            Canadian Business Admin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300 mb-8 leading-relaxed"
        >
          Transform 2.7M Canadian businesses with AI that understands Canadian taxes, bilingual operations, and PIPEDA compliance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <button className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300">
            Access Investor Portal
          </button>
          <button className="w-full py-4 bg-black/50 border border-white/20 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300">
            Watch 3-Min Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mt-8"
        >
          {[
            { text: "Canada-Based" },
            { text: "PIPEDA Safe" },
            { text: "13 Provinces" },
            { text: "Bilingual" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <span className="text-sm text-gray-400">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function MobileMetricsSection() {
  const metrics = [
    { value: "$324M", label: "TAM", growth: "+18%" },
    { value: "2.7M+", label: "Businesses", growth: "Total" },
    { value: "$120/yr", label: "ARPU", growth: "Per user" },
    { value: "85%", label: "Margin", growth: "Target" }
  ];

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Unicorn Metrics
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-black/50 border border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-400 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-300 mb-1">{metric.label}</div>
            <div className="text-xs text-green-400">{metric.growth}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function MobilePricingSection() {
  const plans = [
    { name: "Starter", price: "$29", users: "Solo entrepreneurs" },
    { name: "Professional", price: "$79", users: "Small businesses", highlighted: true },
    { name: "Enterprise", price: "Custom", users: "Large companies" }
  ];

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Premium Pricing
        </span>
      </h2>
      <div className="space-y-4">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`bg-black/50 border rounded-xl p-6 ${
              plan.highlighted
                ? 'border-green-500/30 shadow-xl shadow-green-500/10'
                : 'border-white/10'
            }`}
          >
            {plan.highlighted && (
              <div className="text-center mb-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-2">{plan.price}</div>
              <div className="text-sm text-gray-400 mb-4">{plan.users}</div>
              <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}