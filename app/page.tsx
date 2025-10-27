'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Users, Zap, Globe, FileText, BarChart3, Lock, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-gray-900 opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Now with AI-Powered Processing
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-balance mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transform Your Document Management with AI
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Automate invoice processing, extract data instantly, and make smarter business decisions. Built for modern entrepreneurs.
            </motion.p>

            <motion.p
              className="text-lg text-gray-500 dark:text-gray-400 mb-8 font-medium italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              From chaos to clarity. Protect your margins. Reclaim your evenings.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                See How It Works (2 min demo)
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Everything You Need, Nothing More
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Complete document management solution designed for modern businesses
            </motion.p>
          </div>

          <div className="grid md:grid-cols-1 gap-12">
            {/* Scan & AI Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 mr-4" />
                  <h3 className="text-xl font-bold">Scan & AI Extraction</h3>
                </div>
                <p className="text-blue-100 mb-6">Upload documents and extract data with 99% accuracy using advanced AI</p>
                <ul className="space-y-2 text-sm text-blue-100">
                  {["OCR technology", "Automatic data extraction", "Smart categorization", "Batch processing", "Cloud storage"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Audio Actions Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 mr-4" />
                  <h3 className="text-xl font-bold">Audio Actions</h3>
                </div>
                <p className="text-purple-100 mb-6">Convert meeting recordings to actionable tasks and insights</p>
                <ul className="space-y-2 text-sm text-purple-100">
                  {["Speech-to-text", "Meeting summaries", "Action items extraction", "Speaker identification", "Export to multiple formats"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Automations Feature */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 mr-4" />
                  <h3 className="text-xl font-bold">Smart Automations</h3>
                </div>
                <p className="text-green-100 mb-6">Set up workflows that adapt to your business needs</p>
                <ul className="space-y-2 text-sm text-green-100">
                  {["Custom triggers", "Multi-step workflows", "Conditional logic", "Integration with tools", "Error handling"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
            Join thousands of entrepreneurs who trust StructureClerk
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Sales Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}