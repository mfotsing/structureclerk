'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Users, Zap, Globe, FileText, BarChart3, Lock, Award, Sparkles, Play, ChevronRight, TrendingUp, Brain, Clock, DollarSign, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Scan & AI Extraction",
      description: "Upload documents and extract data with 99% accuracy",
      features: ["OCR technology", "Automatic data extraction", "Smart categorization", "Batch processing", "Cloud storage"],
      gradient: "from-blue-600 to-indigo-600",
      demo: "Extracts invoice data in seconds"
    },
    {
      icon: Brain,
      title: "AI Meeting Intelligence",
      description: "Transform meetings into actionable insights",
      features: ["Speech-to-text", "Meeting summaries", "Action items extraction", "Speaker identification", "Export to multiple formats"],
      gradient: "from-purple-600 to-pink-600",
      demo: "2-hour meeting → 5 key actions"
    },
    {
      icon: Zap,
      title: "Smart Automations",
      description: "Workflows that adapt to your business",
      features: ["Custom triggers", "Multi-step workflows", "Conditional logic", "Integration with tools", "Error handling"],
      gradient: "from-green-600 to-teal-600",
      demo: "Automate 80% of admin tasks"
    }
  ];

  const stats = [
    { value: "10K+", label: "Documents Processed Daily", icon: FileText },
    { value: "95%", label: "Time Saved", icon: Clock },
    { value: "$2.5M", label: "Invoices Processed", icon: DollarSign },
    { value: "500+", label: "Happy Entrepreneurs", icon: Users }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart Inc.",
      content: "StructureClerk transformed our entire document workflow. What used to take hours now takes minutes.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, Creative Agency",
      content: "The AI extraction is mind-blowing. 99% accuracy means I can trust my financial data completely.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Freelance Consultant",
      content: "I reclaimed 10+ hours per week. This tool pays for itself many times over.",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.2),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/20 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-xl font-bold">StructureClerk</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Start Free Trial
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">🎉 Join 500+ entrepreneurs saving 10+ hours/week</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Your Business,<br/>
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Automated.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Transform documents and calls into actions: summaries, tasks, follow-ups, contracts, invoices.<br/>
            <span className="text-blue-400 font-semibold">Focus on growth. Let AI handle the paperwork.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                Start Free 30-Day Trial
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              <Play className="inline-block w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch 2-Min Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/10"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 right-10 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/10"
        />
      </section>

      {/* Interactive Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                AI That Works
              </span>
              <br />
              <span className="text-white">For Your Business</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three core capabilities that handle 80% of your admin workload
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveFeature(index)}
                className={`relative group cursor-pointer ${activeFeature === index ? 'scale-105' : ''} transition-all duration-300`}
              >
                <div className={`relative h-full bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:shadow-2xl hover:shadow-${feature.gradient.split(' ')[1].replace('to-', '')}/25`}>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm text-white mb-4">
                      {feature.demo}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>

                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start"
                      >
                        <Check className="w-5 h-5 mr-3 mt-0.5 text-white/90 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm text-white"
                  >
                    Learn more →
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  See It In Action
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Upload any document → AI extracts everything → Ready for your accounting software
                </p>
                <div className="space-y-4">
                  {["PDFs, images, scans", "Multi-language support", "99.5% accuracy", "GDPR & PIPEDA compliant"].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all"
                >
                  Try Live Demo Now
                </motion.button>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded-full w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/20 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-white/20 rounded-full w-5/6 animate-pulse" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10" />
                      <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Loved by</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Entrepreneurs
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join hundreds of business owners who've reclaimed their time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute top-8 right-8 bg-green-500 w-3 h-3 rounded-full"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Simple, Transparent</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-5xl font-bold text-white mb-2">$99<span className="text-xl text-white/70">/mo</span></div>
                  <p className="text-white/80">Perfect for growing businesses</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited documents", "AI data extraction", "Financial forecasts", "Client & project management", "30-day free trial"].map((feature, i) => (
                    <li key={i} className="flex items-center text-white">
                      <Check className="w-5 h-5 mr-3 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
                >
                  Start 30-Day Trial
                </motion.button>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-5xl font-bold text-white mb-2">$299<span className="text-xl text-white/70">/mo</span></div>
                  <p className="text-white/80">For large teams & complex needs</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Everything in Pro", "Multi-level approvals", "Custom workflows", "API access", "Priority support"].map((feature, i) => (
                    <li key={i} className="flex items-center text-white">
                      <Check className="w-5 h-5 mr-3 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 backdrop-blur-xl border border-white/20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Get Your Evenings Back?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Join 500+ entrepreneurs who've automated their admin work.<br/>
              Start your 30-day free trial - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
              >
                Start Free Trial Now
                <ArrowRight className="inline-block ml-3 h-6 w-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/30 transition-all"
              >
                Schedule a Demo Call
              </motion.button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                2-minute setup
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                500+ happy users
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold text-white">StructureClerk</span>
              </div>
              <p className="text-gray-400">
                Your AI-powered admin assistant. Focus on what matters.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StructureClerk. All rights reserved. Built with 🧠 in Canada.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}