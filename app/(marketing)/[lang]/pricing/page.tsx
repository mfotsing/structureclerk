'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  cta: string;
  priceId?: string;
}

interface AddOn {
  id: string;
  title: string;
  price: string;
  description: string;
  priceId?: string;
}

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Plan data with clear value proposition
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out StructureClerk',
      features: [
        '📄 3 documents per month',
        '🎙️ 10 minutes audio transcription',
        '💾 250MB cloud storage',
        '📱 Mobile app access',
        '🔒 Secure data storage',
        '📋 Basic templates'
      ],
      cta: 'Start Free',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'annual' ? '$8.25' : '$9.99',
      period: billingCycle === 'annual' ? '/month' : '/month',
      description: 'For freelancers getting started',
      features: [
        '📄 10 documents per month',
        '🎙️ 30 minutes audio transcription',
        '💾 1GB cloud storage',
        '📧 Email support',
        '📱 Advanced mobile features',
        '🔒 Enhanced security',
        '📋 Custom templates'
      ],
      cta: 'Start Starter',
    },
    {
      id: 'pro',
      name: 'Professional',
      price: billingCycle === 'annual' ? '$15.83' : '$29',
      period: billingCycle === 'annual' ? '/month' : '/month',
      description: 'For serious freelancers and small businesses',
      popular: true,
      features: [
        '📄 100 documents per month',
        '🎙️ 180 minutes audio transcription',
        '💾 20GB cloud storage',
        '📞 Priority email support',
        '📱 Advanced mobile features',
        '🔒 Enterprise security',
        '📊 Basic analytics',
        '📋 Custom templates',
        '🔄 Drive import'
      ],
      cta: 'Start Pro Trial',
    },
    {
      id: 'business',
      name: 'Business',
      price: billingCycle === 'annual' ? '$49.17' : '$79',
      period: billingCycle === 'annual' ? '/month' : '/month',
      description: 'For growing businesses and teams',
      features: [
        '📄 Unlimited documents',
        '🎙️ Unlimited audio transcription',
        '💾 100GB cloud storage',
        '📞 Phone & email support',
        '📱 Team collaboration tools',
        '🔒 Enterprise security',
        '📊 Advanced analytics & reports',
        '📋 Custom workflows',
        '🔄 API access',
        '🏢 SSO integration'
      ],
      cta: 'Start Business Trial',
    },
    {
      id: 'teams',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large teams and organizations',
      features: [
        '📄 Unlimited documents',
        '🎙️ Unlimited audio transcription',
        '💾 500GB+ cloud storage',
        '📞 Dedicated support manager',
        '📱 Enterprise mobile features',
        '🔒 Military-grade security',
        '📊 Custom analytics & insights',
        '📋 Advanced automation',
        '🔄 Full API access',
        '🎯 Custom training',
        '🏢 SSO & SAML integration',
        '🎨 Custom branding'
      ],
      cta: 'Contact Sales',
    },
  ];

  // Add-on data
  const addOns: AddOn[] = [
    {
      id: 'audio',
      title: t('add_ons.audio_minutes.title'),
      price: t('add_ons.audio_minutes.price'),
      description: t('add_ons.audio_minutes.description'),
    },
    {
      id: 'storage',
      title: t('add_ons.storage.title'),
      price: t('add_ons.storage.price'),
      description: t('add_ons.storage.description'),
    },
    {
      id: 'branding',
      title: t('add_ons.branding.title'),
      price: t('add_ons.branding.price'),
      description: t('add_ons.branding.description'),
    },
    {
      id: 'automation',
      title: t('add_ons.automation.title'),
      price: t('add_ons.automation.price'),
      description: t('add_ons.automation.description'),
    },
    {
      id: 'signatures',
      title: t('add_ons.signatures.title'),
      price: t('add_ons.signatures.price'),
      description: t('add_ons.signatures.description'),
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        // Show error message
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      // Show error message
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                {t('subtitle')}
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-12 flex justify-center items-center gap-4"
            >
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-blue transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card p-8 rounded-xl border-2 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-brand-blue ring-2 ring-brand-blue/20 transform scale-105'
                    : 'border-border hover:border-brand-blue/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-blue text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-heading mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.id === 'free' ? '/signup' : '#'}
                  onClick={(e) => {
                    if (plan.id !== 'free') {
                      e.preventDefault();
                      handleSubscribe(plan.id);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors inline-flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {plan.cta}
                  {plan.id !== 'free' && <ArrowRight className="h-4 w-4" />}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              {t('add_ons.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your plan with powerful add-ons to meet your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {addOns.map((addOn, index) => (
              <motion.div
                key={addOn.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg border text-center"
              >
                <h3 className="font-semibold mb-2">{addOn.title}</h3>
                <div className="text-2xl font-bold text-brand-blue mb-3">{addOn.price}</div>
                <p className="text-sm text-muted-foreground">{addOn.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about StructureClerk pricing
            </p>
          </div>

          <div className="space-y-8">
            {[
              'security',
              'data_residency',
              'loi25',
              'pipeda',
              'stripe',
              'export',
              'limits',
              'integrations',
              'accuracy',
              'support'
            ].map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card p-8 rounded-lg border"
              >
                <h3 className="text-lg font-semibold font-heading mb-3 flex items-center gap-3">
                  <Info className="h-5 w-5 text-brand-blue flex-shrink-0" />
                  {t(`faq.${key}.question`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`faq.${key}.answer`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-green text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading mb-6">
            Need a custom solution?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            We offer custom enterprise plans with advanced features, dedicated support, and tailored solutions
            for large organizations.
          </p>
          <Link
            href="/contact"
            className="bg-white text-brand-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            Contact Sales
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold mb-8">Trusted by Canadian businesses</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { icon: Shield, label: 'PIPEDA Compliant' },
              { icon: Star, label: '99.5% Accuracy' },
              { icon: Zap, label: 'Canadian Support' },
              { icon: Shield, label: 'Bank-Level Security' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-brand-blue" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}