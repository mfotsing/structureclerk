'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Shark Tank-optimized plan structure
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for testing the waters',
      features: [
        '📄 10 documents per month',
        '🎙️ 60 minutes audio transcription',
        '💾 2GB Canadian cloud storage',
        '📱 Full mobile app access',
        '🔒 Bank-level encryption',
        '📋 Professional templates',
        '🤖 AI-powered assistance',
        '📧 Email support (48h response)',
        '🌐 English & French support'
      ],
      cta: 'Start Free Forever',
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'annual' ? '$24' : '$29',
      period: billingCycle === 'annual' ? '/month' : '/month',
      description: 'For serious entrepreneurs & growing businesses',
      popular: true,
      features: [
        '📄 250 documents per month',
        '🎙️ 300 minutes audio transcription',
        '💾 50GB Canadian cloud storage',
        '📞 Priority support (24h response)',
        '📱 Advanced mobile features',
        '🔒 Enterprise-grade security',
        '📊 Advanced analytics dashboard',
        '📋 Custom workflow automation',
        '🔄 Google Drive integration',
        '🤖 Advanced AI insights',
        '👥 Team collaboration (up to 5 users)',
        '🇨🇦 PIPEDA compliance tools'
      ],
      cta: 'Start 14-Day Free Trial',
    },
    {
      id: 'business',
      name: 'Business',
      price: billingCycle === 'annual' ? '$64' : '$79',
      period: billingCycle === 'annual' ? '/month' : '/month',
      description: 'For established businesses with teams',
      features: [
        '📄 Unlimited documents',
        '🎙️ Unlimited audio transcription',
        '💾 200GB Canadian cloud storage',
        '📞 Phone & priority email support',
        '📱 Full team collaboration suite',
        '🔒 Military-grade security',
        '📊 Custom analytics & reporting',
        '📋 Advanced automation workflows',
        '🔄 Full API access & integrations',
        '🏢 SSO & advanced user management',
        '👥 Unlimited team members',
        '🎯 Custom AI model training',
        '🇨🇦 Advanced compliance features',
        '📈 Business intelligence tools'
      ],
      cta: 'Start 14-Day Free Trial',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific needs',
      features: [
        '📄 Unlimited everything',
        '🎙️ Unlimited audio transcription',
        '💾 Unlimited Canadian cloud storage',
        '📞 Dedicated account manager',
        '📱 Custom enterprise features',
        '🔒 SOC 2 Type II compliance',
        '📊 Custom analytics & AI insights',
        '📋 Fully customizable workflows',
        '🔄 White-label API access',
        '🏢 Advanced SSO & SAML integration',
        '👥 Unlimited users & permissions',
        '🎯 On-premise deployment options',
        '🎨 Custom branding & white-label',
        '🇨🇦 Full compliance audit support',
        '📈 Custom SLA guarantees',
        '🏢 Dedicated infrastructure'
      ],
      cta: 'Contact Enterprise Sales',
    },
  ];

  // Shark Tank-optimized add-ons
  const addOns: AddOn[] = [
    {
      id: 'audio-pro',
      title: 'Audio Transcription Pro',
      price: '$0.05/minute',
      description: 'Additional AI-powered transcription with speaker analysis and summary generation',
    },
    {
      id: 'storage-unlimited',
      title: 'Unlimited Storage',
      price: '$0.08/GB/month',
      description: 'Additional secure Canadian cloud storage with automatic backup and versioning',
    },
    {
      id: 'branding-custom',
      title: 'Custom Branding Suite',
      price: '$12/month',
      description: 'Add your logo, custom colors, and branded templates to all documents and communications',
    },
    {
      id: 'automation-enterprise',
      title: 'Enterprise Automation',
      price: '$29/month',
      description: 'Advanced workflow automation with custom triggers, webhooks, and API integrations',
    },
    {
      id: 'signatures-legal',
      title: 'Digital Signatures Legal',
      price: '$0.75/signature',
      description: 'Legally binding e-signatures with audit trails and Canadian compliance',
    },
    {
      id: 'ai-assistant-pro',
      title: 'AI Assistant Pro',
      price: '$39/month',
      description: 'Advanced AI assistant with custom training, industry-specific knowledge, and 24/7 availability',
    }
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Choose the perfect plan for your Canadian business. No hidden fees.
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
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: BRAND_COLORS.primaryNavy }}
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
                    ? 'transform scale-105'
                    : 'border-border hover:border-gray-300'
                }`}
                style={plan.popular ? {
                  borderColor: BRAND_COLORS.primaryNavy,
                  boxShadow: `0 0 0 2px ${BRAND_COLORS.primaryNavy}20`
                } : {}}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-white text-xs font-medium px-3 py-1 rounded-full"
                          style={{ backgroundColor: BRAND_COLORS.primaryNavy }}>
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-heading mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold"
                         style={{ color: BRAND_COLORS.primaryNavy }}>{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                           style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}20` }}>
                        <Check className="h-3 w-3" style={{ color: BRAND_COLORS.primaryNavy }} />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.id === 'free' ? '/sign-up' : '#'}
                  onClick={(e) => {
                    if (plan.id !== 'free') {
                      e.preventDefault();
                      handleSubscribe(plan.id);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors inline-flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'text-white hover:opacity-90'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  style={plan.popular ? { backgroundColor: BRAND_COLORS.primaryNavy } : {}}
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
              Enhance Your Plan
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
                <div className="text-2xl font-bold mb-3" style={{ color: BRAND_COLORS.primaryNavy }}>{addOn.price}</div>
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
              {
                question: "How quickly can I start saving time with StructureClerk?",
                answer: "Most entrepreneurs save 10-15 hours per week in their first month. Our AI processes documents in seconds, and you'll see immediate time savings from day one."
              },
              {
                question: "Is my data secure and compliant with Canadian laws?",
                answer: "Absolutely. We use bank-level AES-256 encryption, store all data exclusively in Canada, and are fully PIPEDA and Quebec Bill 64 compliant. We're SOC 2 Type II certified."
              },
              {
                question: "What's the ROI for Canadian businesses?",
                answer: "Our customers typically see a 300-500% ROI within the first year through time savings, improved productivity, and reduced administrative overhead. Average monthly savings: $2,000-5,000."
              },
              {
                question: "Can StructureClerk handle bilingual documents?",
                answer: "Yes! Our AI is specifically trained on Canadian English and French documents. We process invoices, contracts, and correspondence in both languages with 99.5% accuracy."
              },
              {
                question: "What kind of support do Canadian businesses get?",
                answer: "Professional plan gets 24-hour response from our Canadian support team. Business and Enterprise plans include phone support with dedicated account managers based in Canada."
              },
              {
                question: "How does this compare to hiring an administrative assistant?",
                answer: "StructureClerk costs less than 10% of a full-time admin assistant while providing 24/7 availability, perfect accuracy, and instant processing. No sick days, vacations, or training needed."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card p-8 rounded-lg border"
              >
                <h3 className="text-lg font-semibold font-heading mb-3 flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 text-white"
                   style={{ background: `linear-gradient(to right, ${BRAND_COLORS.primaryNavy}, #10b981)` }}>
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
            className="text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            style={{ backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.primaryNavy }}
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                     style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}10` }}>
                  <item.icon className="h-8 w-8" style={{ color: BRAND_COLORS.primaryNavy }} />
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