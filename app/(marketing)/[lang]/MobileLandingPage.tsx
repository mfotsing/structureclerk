'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Users, Zap, Globe, FileText, BarChart3, Lock, Award, Sparkles, Menu, X, Play } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccessibleButton from '@/components/ui/AccessibleButton';
import SkipLink from '@/components/ui/SkipLink';
import Logo from '@/components/brand/Logo';
import { BRAND_COLORS } from '@/components/brand/BrandColors';
import { analytics } from '@/lib/analytics';

export default function MobileLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    analytics.pageView('/landing');
  }, []);

  const handleStartFree = () => {
    analytics.trackConversion('trial_started', 'anonymous', { source: 'landing_page_cta' });
    router.push('/sign-up');
  };

  const handleWatchDemo = () => {
    analytics.trackFeature('demo_video_watched', 'anonymous');
    setIsPlaying(true);
  };

  const stats = [
    { number: '10K+', label: 'Documents Processed Daily' },
    { number: '13/13', label: 'Provinces Supported' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  const features = [
    {
      icon: FileText,
      title: 'Smart Document Processing',
      description: 'AI-powered extraction and organization of invoices, receipts, and contracts.',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Audio Transcription',
      description: 'Record meetings and calls. Get accurate transcriptions with action items.',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Business Automation',
      description: 'Automate repetitive tasks and workflows with intelligent triggers.',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with shared documents and real-time updates.',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption with Canadian data residency and compliance.',
      color: 'text-red-600'
    },
    {
      icon: Globe,
      title: 'Bilingual Support',
      description: 'Complete English and French support for all Canadian businesses.',
      color: 'text-indigo-600'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out StructureClerk',
      features: ['3 documents per month', '10 minutes audio', '250MB storage', 'Mobile app', 'Basic templates'],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Starter',
      price: '$9.99',
      period: '/month',
      description: 'For freelancers getting started',
      features: ['10 documents per month', '30 minutes audio', '1GB storage', 'Email support', 'Advanced templates'],
      cta: 'Start Starter',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For serious freelancers',
      features: ['100 documents per month', '180 minutes audio', '20GB storage', 'Priority support', 'Analytics', 'Drive import'],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Business',
      price: '$79',
      period: '/month',
      description: 'For growing businesses',
      features: ['Unlimited documents', 'Unlimited audio', '100GB storage', 'Phone support', 'API access', 'Team tools'],
      cta: 'Start Business Trial',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipLink />

      {/* Mobile Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40" role="navigation" aria-label="Main navigation">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo
                size={32}
                variant="symbol"
                color="navy"
                className="mr-2"
              />
              <Logo
                size={32}
                variant="wordmark"
                color="navy"
              />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2"
              style={{ focusRingColor: BRAND_COLORS.primaryNavy }}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="border-t border-gray-200 py-2">
              <Link
                href="/features"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <AccessibleButton
                  onClick={() => {
                    handleStartFree();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Start Free
                </AccessibleButton>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main id="main-content">
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
                 style={{ background: 'linear-gradient(to bottom right, #F0F4F8, #FFFFFF, #F0FDF4)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold mb-4 sm:mb-6"
                style={{
                  backgroundColor: `${BRAND_COLORS.primaryNavy}10`,
                  color: BRAND_COLORS.primaryNavy
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Document Management
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="block">Snap, Record, Upload.</span>
                <span className="block" style={{ color: BRAND_COLORS.primaryNavy }}>We handle the rest.</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Transform your business documents with AI-powered processing and automation. Built for Canadian entrepreneurs.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AccessibleButton
                  onClick={handleStartFree}
                  size="lg"
                  leftIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Start for Free
                </AccessibleButton>
                <button
                  onClick={handleWatchDemo}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl sm:text-3xl font-bold mb-2"
                       style={{ color: BRAND_COLORS.primaryNavy }}>
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to transform your business operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Start free, scale as you grow. No hidden fees.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className={`relative p-6 sm:p-8 rounded-2xl ${
                    plan.highlighted
                      ? 'border-2'
                      : 'bg-white border border-gray-200'
                  }`}
                  style={plan.highlighted ? {
                    backgroundColor: `${BRAND_COLORS.primaryNavy}08`,
                    borderColor: BRAND_COLORS.primaryNavy
                  } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="text-white text-sm font-medium px-3 py-1 rounded-full"
                            style={{ backgroundColor: BRAND_COLORS.primaryNavy }}>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === 'Free' ? (
                    <AccessibleButton
                      onClick={handleStartFree}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </AccessibleButton>
                  ) : (
                    <Link
                      href="/contact"
                      className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors w-full text-center ${
                        plan.highlighted
                          ? 'text-white hover:opacity-90'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      style={plan.highlighted ? { backgroundColor: BRAND_COLORS.primaryNavy } : {}}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-white"
                   style={{ background: `linear-gradient(to right, ${BRAND_COLORS.primaryNavy}, ${BRAND_COLORS.primaryNavy}DD)` }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of Canadian entrepreneurs saving time with StructureClerk
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AccessibleButton
                onClick={handleStartFree}
                size="lg"
                leftIcon={<ArrowRight className="h-5 w-5" />}
                className="text-white hover:bg-gray-100"
                style={{ backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.primaryNavy }}
              >
                Start for Free Today
              </AccessibleButton>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/legal/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white">Status</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 TechVibes. | Montreal, Quebec | <Link href="/legal/privacy" className="hover:text-white">Privacy</Link> | <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}