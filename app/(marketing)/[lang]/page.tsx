'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Users, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const t = useTranslations('hero');
  const ft = useTranslations('features');
  const dt = useTranslations('demo');
  const st = useTranslations('social_proof');
  const ct = useTranslations('canada_first');
  const pt = useTranslations('pricing');
  const ft_tr = useTranslations('footer');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg-tertiary" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-balance mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="gradient-text">{t('title')}</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/signup"
                className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2"
              >
                {t('cta_primary')}
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/demo"
                className="btn-secondary px-8 py-4 text-lg inline-flex items-center gap-2"
              >
                {t('cta_secondary')}
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t('demo_note')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Everything you need to streamline your administrative work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI, designed for Canadian businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Scan AI Feature */}
            <motion.div
              className="card-hover bg-card p-8 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-4">
                {ft('scan_ai.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {ft('scan_ai.description')}
              </p>
              <ul className="space-y-3">
                {(ft('scan_ai.features') as unknown as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audio Actions Feature */}
            <motion.div
              className="card-hover bg-card p-8 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-4">
                {ft('audio_actions.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {ft('audio_actions.description')}
              </p>
              <ul className="space-y-3">
                {(ft('audio_actions.features') as unknown as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Automations Feature */}
            <motion.div
              className="card-hover bg-card p-8 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-4">
                {ft('automations.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {ft('automations.description')}
              </p>
              <ul className="space-y-3">
                {(ft('automations.features') as unknown as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Canada First Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              {ct('title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {ct('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(ct('features') as unknown as any[]).map((feature: any, index: number) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="text-lg font-semibold font-heading mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Testimonials */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {Object.entries(st('stats')).map(([key, value]: [string, string]) => (
              <div key={key} className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-heading gradient-text mb-2">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(st).filter(([key]) => key.startsWith('testimonial_')).map(([key, testimonial]: [string, any]) => (
              <div key={key} className="bg-card p-8 rounded-xl border shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-brand-blue to-brand-green text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ready to transform your administrative workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Canadian businesses already saving time with StructureClerk.
          </p>
          <Link
            href="/signup"
            className="bg-white text-brand-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            {t('cta_primary')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}