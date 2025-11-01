'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Mic,
  Zap,
  Shield,
  Users,
  Globe,
  BarChart3,
  Lock,
  Award,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Brain,
  Search,
  TrendingUp,
  Database,
  MessageSquare,
  DollarSign,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: 'AI Document Processing',
      description: 'Advanced OCR and AI-powered extraction that transforms invoices, receipts, contracts, and business documents into structured, actionable data.',
      benefits: [
        '99.5% accuracy rate on Canadian documents',
        'Processes 10,000+ documents daily',
        'Supports English and French documents',
        'Auto-categorizes by document type'
      ],
      stats: { value: '10K+', label: 'Documents Processed Daily' },
      color: '#3B82F6'
    },
    {
      icon: Mic,
      title: 'Audio Transcription AI',
      description: 'Record meetings, calls, and dictations with our AI that provides accurate transcriptions, summaries, and automatically extracts action items.',
      benefits: [
        'Speaker diarization and identification',
        'Real-time transcription available',
        'Generates meeting summaries automatically',
        'Extracts action items and decisions'
      ],
      stats: { value: '180min', label: 'Monthly Transcription Included' },
      color: '#8B5CF6'
    },
    {
      icon: Bot,
      title: 'Business Automation',
      description: 'Create powerful workflows that automate repetitive tasks, from invoice follow-ups to document processing and weekly report generation.',
      benefits: [
        '50+ pre-built automation templates',
        'Custom trigger-action workflows',
        'Monitors success rates automatically',
        'Saves 15+ hours per week average'
      ],
      stats: { value: '50+', label: 'Automation Templates' },
      color: '#10B981'
    },
    {
      icon: Users,
      title: 'Client & Project Management',
      description: 'Complete mini-CRM system with project tracking, client management, and integrated invoicing designed for Canadian service businesses.',
      benefits: [
        'Unlimited clients and projects',
        'Integrated invoicing system',
        'Project profitability tracking',
        'Client communication history'
      ],
      stats: { value: 'Unlimited', label: 'Clients & Projects' },
      color: '#F59E0B'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade security with Canadian data residency, end-to-end encryption, and compliance with PIPEDA and Quebec Bill 64.',
      benefits: [
        'Canadian data centers only',
        'SOC 2 Type II certified',
        'PIPEDA and Bill 64 compliant',
        '24/7 security monitoring'
      ],
      stats: { value: '99.99%', label: 'Uptime Guaranteed' },
      color: '#EF4444'
    },
    {
      icon: Globe,
      title: 'Bilingual Support',
      description: 'Complete English and French support across all features, from document processing to customer support and AI interactions.',
      benefits: [
        'French document processing',
        'Bilingual AI chat assistant',
        'Français customer support',
        'Localized Canadian experience'
      ],
      stats: { value: '100%', label: 'Bilingual Coverage' },
      color: '#6366F1'
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations, predictive analytics, and business insights powered by advanced machine learning.'
    },
    {
      icon: Search,
      title: 'Global Search',
      description: 'Search across all your documents, transcriptions, projects, and client information in one unified search.'
    },
    {
      icon: Database,
      title: 'Cloud Storage',
      description: 'Secure Canadian cloud storage with automatic backups and version history for all your business data.'
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Your bilingual AI assistant for productivity help, document questions, and business guidance.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards showing business metrics, financial insights, and growth trends.'
    },
    {
      icon: DollarSign,
      title: 'Smart Invoicing',
      description: 'AI-powered invoice creation, payment tracking, and financial forecasting for your business.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #0A1A33 0%, #1E40AF 50%, #0A1A33 100%)' }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold mb-8"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Award className="w-4 h-4 mr-2" />
              Enterprise-Grade Features for Canadian Businesses
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block" style={{ color: BRAND_COLORS.accentTeal }}>
                Scale Your Business
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Powerful AI-driven tools designed specifically for Canadian entrepreneurs.
              From document processing to business automation, we've got you covered.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/en/pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: BRAND_COLORS.accentTeal }}
              >
                See Pricing Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-white hover:text-gray-900 border-white"
              >
                Schedule Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: BRAND_COLORS.primaryNavy }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Core Features That Drive Growth
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Built by entrepreneurs, for entrepreneurs. Each feature is designed to solve
              real business challenges faced by Canadian companies.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Feature Header */}
                  <div className="flex items-start mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl flex-shrink-0 mr-4"
                         style={{ backgroundColor: `${feature.color}20` }}>
                      <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND_COLORS.primaryNavy }}>
                        {feature.title}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold" style={{ color: feature.color }}>
                          {feature.stats.value}
                        </span>
                        <span className="text-sm text-gray-600">{feature.stats.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: BRAND_COLORS.primaryNavy }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Advanced Capabilities
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Cutting-edge AI and automation features that give you a competitive edge
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg mr-4"
                       style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}20` }}>
                    <feature.icon className="h-6 w-6" style={{ color: BRAND_COLORS.primaryNavy }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: BRAND_COLORS.primaryNavy }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Trusted by Canadian Entrepreneurs
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "StructureClerk transformed how we handle our paperwork. We save 15+ hours per week on administrative tasks.",
                author: "Sarah Chen",
                role: "Founder, Digital Agency",
                location: "Toronto, ON"
              },
              {
                quote: "The AI document processing is incredible. It's like having a virtual assistant that never sleeps.",
                author: "Marc Dubois",
                role: "Consultant",
                location: "Montreal, QC"
              },
              {
                quote: "Finally, a Canadian solution that understands our bilingual needs and PIPEDA compliance.",
                author: "Jennifer Park",
                role: "Law Firm Partner",
                location: "Vancouver, BC"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold" style={{ color: BRAND_COLORS.primaryNavy }}>
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white relative overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primaryNavy} 0%, #1E40AF 100%)` }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of Canadian entrepreneurs who are saving time and growing their businesses with StructureClerk.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/en/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: BRAND_COLORS.accentTeal, color: BRAND_COLORS.white }}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}