'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe2,
  Brain,
  DollarSign,
  BarChart3,
  Star,
  Lock,
  Award,
  ChevronRight,
  Play,
  Sparkles,
  Target,
  Rocket,
  Crown,
  Building,
  MapPin,
  Flag
} from 'lucide-react';
import Link from 'next/link';
import AIDemoModal from './AIDemoModal';
import InvestorPricingSection from './InvestorPricingSection';
import { useAnalytics } from './AnalyticsTracker';

// Analytics tracking
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export default function InvestorLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = (ctaName: string) => {
    analytics.trackCTA(ctaName, 'investor_landing');
  };

  const unicornMetrics = [
    {
      value: "$324M",
      label: "Total Addressable Market",
      sublabel: "Canadian freelancers & SMEs",
      growth: "+18% YoY",
      icon: TrendingUp,
      color: "from-blue-600 to-indigo-600"
    },
    {
      value: "2.7M+",
      label: "Target Businesses",
      sublabel: "Canadian market opportunity",
      growth: "Underserved",
      icon: Users,
      color: "from-green-600 to-emerald-600"
    },
    {
      value: "$120/yr",
      label: "Average Revenue",
      sublabel: "Per customer annually",
      growth: "Conservative",
      icon: DollarSign,
      color: "from-purple-600 to-pink-600"
    },
    {
      value: "85%",
      label: "Gross Margin Target",
      sublabel: "SaaS scalable model",
      growth: "Industry leading",
      icon: BarChart3,
      color: "from-orange-600 to-red-600"
    }
  ];

  const competitiveAdvantages = [
    {
      icon: Brain,
      title: "Canadian AI Specialist",
      description: "Proprietary AI trained on Canadian business documents, tax codes, and bilingual contexts. Processes GST/HST/QST automatically.",
      metrics: "99.2% accuracy on Canadian docs",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "PIPEDA Compliant by Default",
      description: "Data stored exclusively in Canadian servers. Automatic compliance updates for all provinces and territories.",
      metrics: "Zero compliance violations",
      color: "text-green-600"
    },
    {
      icon: Globe2,
      title: "True Bilingual EN/FR",
      description: "Complete French-Canadian support beyond translation. Cultural nuance understanding for Quebec market.",
      metrics: "100% Canadian province support",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant document analysis, categorization, and action suggestions. No waiting, immediate business insights.",
      metrics: "3-second average processing",
      color: "text-orange-600"
    }
  ];

  const scalingPath = [
    {
      phase: "Phase 1: Canada Domination",
      timeline: "Months 1-12",
      metrics: ["100K Canadian users", "$12M ARR", "40% market penetration"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      phase: "Phase 2: Commonwealth Expansion",
      timeline: "Months 13-24",
      metrics: ["UK, Australia, NZ launch", "$45M ARR", "Tax compliance adaptation"],
      color: "from-green-600 to-emerald-600"
    },
    {
      phase: "Phase 3: Global Entry",
      timeline: "Months 25-36",
      metrics: ["US bilingual states", "$100M+ ARR", "IPO preparation"],
      color: "from-purple-600 to-pink-600"
    }
  ];

  const investorQuotes = [
    {
      quote: "The Canadian market specialization creates a perfect beachhead for global expansion. PIPEDA compliance alone is worth millions.",
      role: "Tech Investor Analysis",
      highlight: "Market Position"
    },
    {
      quote: "85% gross margins with $120 ARPU? These are SaaS metrics that get unicorns built.",
      role: "Financial Model Review",
      highlight: "Unit Economics"
    },
    {
      quote: "AI trained specifically on Canadian business documents? That's a defensible moat competitors can't easily replicate.",
      role: "Technical Due Diligence",
      highlight: "Competitive Moat"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at ${50 + scrollY * 0.02}% ${50 + scrollY * 0.02}%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                StructureClerk
              </span>
              <div className="hidden md:flex items-center ml-6 space-x-1 bg-red-900/30 border border-red-500/30 rounded-full px-3 py-1">
                <Flag className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-400 font-semibold">CANADIAN UNICORN</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleCTAClick('investor_deck')}
                className="hidden md:block px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Investor Deck
              </button>
              <button
                onClick={() => handleCTAClick('demo_request')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center bg-red-900/30 border border-red-500/30 rounded-full px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2 text-red-400" />
              <span className="text-red-400">🍁 Canada's Next AI Unicorn</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AI-Powered Business Admin
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-red-400">
              Built for Canada. Ready for the World.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Transforming 2.7M Canadian businesses with AI that understands
            <span className="text-blue-400 font-semibold"> Canadian taxes</span>,
            <span className="text-green-400 font-semibold"> bilingual operations</span>, and
            <span className="text-purple-400 font-semibold"> PIPEDA compliance</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => handleCTAClick('primary_cta')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Access Investor Portal
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-4 bg-black/50 border border-white/20 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch 3-Min Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { icon: Building, text: "Canada-Based" },
              { icon: Shield, text: "PIPEDA Compliant" },
              { icon: MapPin, text: "13 Provinces" },
              { icon: Globe2, text: "Bilingual EN/FR" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Unicorn Metrics Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Unicorn Potential Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              The numbers that make StructureClerk investor-ready
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {unicornMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl`} />
                <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                  <metric.icon className={`w-8 h-8 mb-4 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} />
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="text-white font-semibold mb-1">{metric.label}</div>
                  <div className="text-sm text-gray-400 mb-2">{metric.sublabel}</div>
                  <div className="inline-flex items-center text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.growth}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Defensible Competitive Moat
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Why StructureClerk can't be easily replicated
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${advantage.color.split('-')[1]}-500/20 to-${advantage.color.split('-')[2]}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <advantage.icon className={`w-6 h-6 ${advantage.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{advantage.description}</p>
                    <div className="flex items-center text-green-400 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {advantage.metrics}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scaling Path */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                36-Month Unicorn Path
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              From Canadian dominance to global leadership
            </p>
          </motion.div>

          <div className="space-y-8">
            {scalingPath.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} rounded-2xl opacity-10 blur-2xl`} />
                <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent mb-2 md:mb-0`}>
                      {phase.phase}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>{phase.timeline}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phase.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Validation */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Investor-Ready Validation
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              What due diligence reveals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {investorQuotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-sm font-semibold text-yellow-400">{quote.highlight}</span>
                </div>
                <blockquote className="text-gray-200 mb-4 italic">
                  "{quote.quote}"
                </blockquote>
                <div className="text-sm text-gray-400">
                  {quote.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Build Canada's Next Unicorn?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              Join us in transforming how 2.7M Canadian businesses handle their administrative tasks with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleCTAClick('final_investor_portal')}
                className="px-8 py-4 bg-black text-white rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
              >
                <Crown className="w-5 h-5 mr-2" />
                Access Investor Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => handleCTAClick('schedule_meeting')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              >
                Schedule Meeting
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <InvestorPricingSection />

      {/* Trust & Compliance Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Canadian Trust & Security
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Enterprise-grade security with Canadian data sovereignty
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "PIPEDA Compliant",
                description: "Full compliance with Canadian privacy laws",
                color: "text-green-400"
              },
              {
                icon: Lock,
                title: "Data Sovereignty",
                description: "All data stored exclusively in Canadian servers",
                color: "text-blue-400"
              },
              {
                icon: Award,
                title: "SOC 2 Type II",
                description: "Enterprise security certification in progress",
                color: "text-purple-400"
              },
              {
                icon: Globe2,
                title: "Bilingual Security",
                description: "Security documentation in EN/FR",
                color: "text-orange-400"
              }
            ].map((trust, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <trust.icon className={`w-8 h-8 mb-4 ${trust.color}`} />
                <h3 className="text-lg font-bold mb-2">{trust.title}</h3>
                <p className="text-gray-400 text-sm">{trust.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">StructureClerk</span>
            </div>
            <div className="text-center md:text-right text-sm text-gray-400">
              <p>🍁 Built in Canada | Ready for Global Scale</p>
              <p className="mt-1">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <span className="mx-2">•</span>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <span className="mx-2">•</span>
                <Link href="/investors" className="hover:text-white transition-colors">Investors</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <AIDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}