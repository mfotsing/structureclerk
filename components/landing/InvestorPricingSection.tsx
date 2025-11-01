'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Crown,
  Building,
  Users,
  Zap,
  Shield,
  Globe2,
  Brain,
  Star,
  ArrowRight,
  TrendingUp,
  DollarSign,
  BarChart3,
  Rocket,
  Lock
} from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: any;
  color: string;
  target: string;
  ltv?: string;
  cac?: string;
  margin?: string;
}

export default function InvestorPricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: billingCycle === 'annual' ? "$29" : "$39",
      period: "/month",
      description: "Perfect for Canadian freelancers starting out",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      target: "Solo entrepreneurs",
      ltv: "$348",
      cac: "$58",
      margin: "83%",
      features: [
        "100 documents/month",
        "Basic AI processing",
        "Canadian tax calculations",
        "PIPEDA compliant storage",
        "Email support",
        "Mobile app access"
      ]
    },
    {
      name: "Professional",
      price: billingCycle === 'annual' ? "$79" : "$99",
      period: "/month",
      description: "Ideal for growing Canadian SMEs",
      icon: Building,
      color: "from-purple-600 to-pink-600",
      target: "Small businesses",
      ltv: "$948",
      cac: "$142",
      margin: "85%",
      highlighted: true,
      features: [
        "Unlimited documents",
        "Advanced AI analysis",
        "Multi-province tax support",
        "Bilingual EN/FR interface",
        "Priority support",
        "Team collaboration (5 users)",
        "API access",
        "Custom categories",
        "Advanced reporting"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large Canadian organizations",
      icon: Crown,
      color: "from-orange-600 to-red-600",
      target: "Large companies",
      ltv: "$5,000+",
      cac: "$500",
      margin: "90%",
      features: [
        "Everything in Professional",
        "Unlimited users",
        "Custom AI training",
        "White-label options",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment",
        "Custom integrations",
        "Advanced compliance reporting",
        "24/7 phone support"
      ]
    }
  ];

  const unitEconomics = [
    {
      metric: "Average Revenue Per User",
      starter: "$348/year",
      professional: "$948/year",
      enterprise: "$5,000+/year",
      insight: "Premium positioning justified by Canadian compliance value"
    },
    {
      metric: "Customer Acquisition Cost",
      starter: "$58",
      professional: "$142",
      enterprise: "$500",
      insight: "Low CAC due to product-market fit in Canadian niche"
    },
    {
      metric: "LTV:CAC Ratio",
      starter: "6:1",
      professional: "6.7:1",
      enterprise: "10:1",
      insight: "Excellent unit economics across all segments"
    },
    {
      metric: "Gross Margin",
      starter: "83%",
      professional: "85%",
      enterprise: "90%",
      insight: "SaaS scalability with improving margins at scale"
    }
  ];

  const marketExpansion = [
    {
      phase: "Year 1-2: Canadian Penetration",
      arpu: "$120",
      users: "100K",
      revenue: "$12M",
      marketShare: "4%"
    },
    {
      phase: "Year 3-4: Commonwealth Expansion",
      arpu: "$150",
      users: "500K",
      revenue: "$75M",
      marketShare: "3%"
    },
    {
      phase: "Year 5+: Global Dominance",
      arpu: "$180",
      users: "2M",
      revenue: "$360M",
      marketShare: "2%"
    }
  ];

  return (
    <section className="relative z-10 py-20 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-green-900/30 border border-green-500/30 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <DollarSign className="w-4 h-4 mr-2 text-green-400" />
            Premium Pricing Strategy
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Unit Economics That Scale
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Premium pricing justified by Canadian compliance, AI specialization, and undeniable ROI
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/10 border border-white/20 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                billingCycle === 'annual'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                Save 25%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${
                tier.highlighted
                  ? 'scale-105'
                  : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative h-full bg-black/50 backdrop-blur-sm border ${
                tier.highlighted
                  ? 'border-green-500/30'
                  : 'border-white/10'
              } rounded-2xl p-8 hover:border-white/20 transition-all duration-300 ${
                tier.highlighted ? 'shadow-2xl shadow-green-500/10' : ''
              }`}>
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <tier.icon className="w-8 h-8 text-white" />
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-400 ml-2">{tier.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{tier.description}</p>
                  <div className="text-sm text-blue-400 mt-1">{tier.target}</div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/25'
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>

                {/* Unit Economics */}
                {tier.ltv && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-400">LTV</div>
                        <div className="text-sm font-semibold text-green-400">{tier.ltv}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">CAC</div>
                        <div className="text-sm font-semibold text-blue-400">{tier.cac}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Margin</div>
                        <div className="text-sm font-semibold text-purple-400">{tier.margin}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unit Economics Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unit Economics Breakdown
            </span>
          </h3>
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-gray-400">Metric</th>
                  <th className="text-center p-6">Starter</th>
                  <th className="text-center p-6">Professional</th>
                  <th className="text-center p-6">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {unitEconomics.map((row, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="font-semibold">{row.metric}</div>
                      <div className="text-sm text-gray-400">{row.insight}</div>
                    </td>
                    <td className="text-center p-6 font-semibold">{row.starter}</td>
                    <td className="text-center p-6 font-semibold">{row.professional}</td>
                    <td className="text-center p-6 font-semibold">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Market Expansion Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              $100M+ Revenue Path
            </span>
          </h3>
          <div className="space-y-6">
            {marketExpansion.map((phase, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h4 className="text-xl font-bold text-orange-400 mb-2 md:mb-0">{phase.phase}</h4>
                  <div className="flex items-center space-x-1">
                    <Rocket className="w-5 h-5 text-orange-400" />
                    <span className="text-2xl font-bold text-white">{phase.revenue}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">ARPU</div>
                    <div className="font-semibold">{phase.arpu}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Users</div>
                    <div className="font-semibold">{phase.users}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Revenue</div>
                    <div className="font-semibold">{phase.revenue}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Market Share</div>
                    <div className="font-semibold">{phase.marketShare}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Justification */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Why This Pricing Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">Compliance Value</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Canadian businesses pay premium for PIPEDA compliance and tax accuracy
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">AI Specialization</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Proprietary Canadian-trained AI commands premium pricing
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Clear ROI</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Businesses save 10+ hours/month at $3/hour = $30+ value
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}