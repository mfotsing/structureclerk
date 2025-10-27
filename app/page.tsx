'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Users, Zap, Globe, FileText, BarChart3, Lock, Award, Sparkles, Play, ChevronRight, TrendingUp, Brain, Clock, DollarSign, MessageSquare, Mic, Languages } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import AIChatbot from '../components/AIChatbot';
import AudioRecorder from '../components/AudioRecorder';

function HomePageContent() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const { scrollYProgress } = useScroll();
  const { t, language, setLanguage } = useLanguage();

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

  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    setFeatures([
      {
        icon: FileText,
        title: t('features.documentExtraction.title'),
        description: t('features.documentExtraction.description'),
        features: (t('features.documentExtraction.features') as any) || [],
        gradient: "from-blue-600 to-indigo-600",
        demo: t('features.documentExtraction.demo')
      },
      {
        icon: Brain,
        title: t('features.meetingIntelligence.title'),
        description: t('features.meetingIntelligence.description'),
        features: (t('features.meetingIntelligence.features') as any) || [],
        gradient: "from-purple-600 to-pink-600",
        demo: t('features.meetingIntelligence.demo')
      },
      {
        icon: Zap,
        title: t('features.automation.title'),
        description: t('features.automation.description'),
        features: (t('features.automation.features') as any) || [],
        gradient: "from-green-600 to-teal-600",
        demo: t('features.automation.demo')
      }
    ]);
  }, [t, language]);

  const stats = [
    { value: t('stats.documents.value'), label: t('stats.documents.label'), icon: FileText },
    { value: t('stats.timeSaved.value'), label: t('stats.timeSaved.label'), icon: Clock },
    { value: t('stats.invoices.value'), label: t('stats.invoices.label'), icon: DollarSign },
    { value: t('stats.users.value'), label: t('stats.users.label'), icon: Users }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart Inc.",
      content: t('testimonials.sarah.content'),
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, Creative Agency",
      content: t('testimonials.marcus.content'),
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Freelance Consultant",
      content: t('testimonials.emily.content'),
      rating: 5,
      avatar: "EW"
    }
  ];

  if (showAudioRecorder) {
    return (
      <>
        <AudioRecorder />
        <AIChatbot />
      </>
    );
  }

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
            <span className="text-xl font-bold">{t('navigation.logo')}</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">{t('navigation.product')}</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">{t('navigation.testimonials')}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">{t('navigation.pricing')}</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-all"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{t('navigation.languageToggle')}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              {t('navigation.signup')}
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
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {t('hero.title')}<br/>
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}<br/>
            <span className="text-blue-400 font-semibold">{t('hero.subtitleHighlight')}</span>
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
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAudioRecorder(true)}
              className="group px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              <Mic className="inline-block w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {t('hero.ctaSecondary')}
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
                {t('features.title')}
              </span>
              <br />
              <span className="text-white">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('features.subtitle')}
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
                <div className={`relative h-full bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:shadow-2xl`}>
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
                    {language === 'en' ? 'Learn more →' : 'En savoir plus →'}
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
                  {t('demo.title')}
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  {t('demo.description')}
                </p>
                <div className="space-y-4">
                  {Array.isArray(t('demo.features')) ? (t('demo.features') as string[]).map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  )) : null}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all"
                >
                  {t('demo.cta')}
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
              <span className="text-white">{t('testimonials.title')}</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {t('testimonials.titleHighlight')}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
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
              <span className="text-white">{t('pricing.title')}</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {t('pricing.titleHighlight')}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('pricing.subtitle')}
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
                  <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.pro.title')}</h3>
                  <div className="text-5xl font-bold text-white mb-2">{t('pricing.pro.price')}<span className="text-xl text-white/70">{t('pricing.pro.period')}</span></div>
                  <p className="text-white/80">{t('pricing.pro.description')}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {Array.isArray(t('pricing.pro.features')) ? (t('pricing.pro.features') as string[]).map((feature, i) => (
                    <li key={i} className="flex items-center text-white">
                      <Check className="w-5 h-5 mr-3 text-green-400" />
                      {feature}
                    </li>
                  )) : null}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
                >
                  {t('pricing.pro.cta')}
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
                  <h3 className="text-2xl font-bold text-white mb-2">{t('pricing.enterprise.title')}</h3>
                  <div className="text-5xl font-bold text-white mb-2">{t('pricing.enterprise.price')}<span className="text-xl text-white/70">{t('pricing.enterprise.period')}</span></div>
                  <p className="text-white/80">{t('pricing.enterprise.description')}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {Array.isArray(t('pricing.enterprise.features')) ? (t('pricing.enterprise.features') as string[]).map((feature, i) => (
                    <li key={i} className="flex items-center text-white">
                      <Check className="w-5 h-5 mr-3 text-green-400" />
                      {feature}
                    </li>
                  )) : null}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
                >
                  {t('pricing.enterprise.cta')}
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
              {t('finalCTA.title')}
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              {t('finalCTA.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
              >
                {t('finalCTA.ctaPrimary')}
                <ArrowRight className="inline-block ml-3 h-6 w-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/30 transition-all"
              >
                {t('finalCTA.ctaSecondary')}
              </motion.button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                {t('finalCTA.trust1')}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {t('finalCTA.trust2')}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('finalCTA.trust3')}
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
                <span className="text-xl font-bold text-white">{t('navigation.logo')}</span>
              </div>
              <p className="text-gray-400">
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t('navigation.product')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('navigation.pricing')}</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">{t('navigation.testimonials')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('navigation.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      <AIChatbot />
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}