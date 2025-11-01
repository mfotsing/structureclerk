'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Clock,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Globe,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS } from '@/components/brand/BrandColors';
import Logo from '@/components/brand/Logo';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    phone: '',
    subject: '',
    role: '',
    employees: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Implement actual contact form submission
      console.log('Contact form submission:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
           style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-lg w-full border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND_COLORS.primaryNavy }}>
            Thank You for Your Interest!
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            We've received your message and will contact you within 24 hours to discuss how StructureClerk can transform your business operations.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  message: '',
                  phone: '',
                  subject: '',
                  role: '',
                  employees: '',
                  timeline: ''
                });
              }}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Send Another Message
            </button>
            <button
              onClick={() => router.push('/en/sign-up')}
              className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-colors hover:scale-105"
              style={{ backgroundColor: BRAND_COLORS.accentTeal }}
            >
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"
         style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold mb-8"
            style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}20`, color: BRAND_COLORS.primaryNavy }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Canadian Business Solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: BRAND_COLORS.primaryNavy }}
          >
            Let's Transform Your Business Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of Canadian entrepreneurs who are saving 15+ hours per week with AI-powered document automation.
            Schedule a personalized demo to see immediate ROI.
          </motion.p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '10K+', label: 'Active Canadian Users' },
            { number: '300%', label: 'Average Time Savings' },
            { number: '99.5%', label: 'Accuracy Rate' },
            { number: '24/7', label: 'AI Support Available' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl font-bold mb-2" style={{ color: BRAND_COLORS.accentTeal }}>
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
              Schedule Your Personalized Demo
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Let us show you how StructureClerk can save you 15+ hours per week. Our Canadian team will create a custom demo based on your specific business needs.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                    placeholder="StructureClerk Inc."
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select your role</option>
                    <option value="owner">Business Owner</option>
                    <option value="founder">Founder</option>
                    <option value="manager">Operations Manager</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="consultant">Consultant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="employees" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    id="employees"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select company size</option>
                    <option value="1">Just me</option>
                    <option value="2-10">2-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  What are you most interested in?
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose your primary interest</option>
                  <option value="demo">Live Demo</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="features">Specific Features</option>
                  <option value="integration">Integration Options</option>
                  <option value="enterprise">Enterprise Solution</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell us about your business challenges *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="What administrative tasks take up most of your time? What are you hoping to automate?"
                />
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                  When would you like to start?
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-week">Within 1 week</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="exploring">Just exploring options</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                style={{ backgroundColor: BRAND_COLORS.accentTeal, color: BRAND_COLORS.white }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scheduling Your Demo...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Schedule Personalized Demo
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                30-minute demo • No credit card required • Immediate ROI insights
              </p>
            </form>
          </motion.div>

          {/* Value Proposition Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Why Choose StructureClerk?
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: '300-500% ROI',
                    description: 'Average first-year return on investment'
                  },
                  {
                    icon: Clock,
                    title: '15+ Hours Saved',
                    description: 'Per week on average for our customers'
                  },
                  {
                    icon: Shield,
                    title: '100% Canadian',
                    description: 'Data residency and PIPEDA compliant'
                  },
                  {
                    icon: Globe,
                    title: 'Bilingual AI',
                    description: 'English & French document processing'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}20` }}>
                      <item.icon className="h-6 w-6" style={{ color: BRAND_COLORS.primaryNavy }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.primaryNavy }}>
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: `${BRAND_COLORS.accentTeal}20` }}>
                    <Mail className="h-6 w-6" style={{ color: BRAND_COLORS.accentTeal }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 font-medium">sales@structureclerk.ca</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: `${BRAND_COLORS.primaryNavy}20` }}>
                    <Phone className="h-6 w-6" style={{ color: BRAND_COLORS.primaryNavy }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 font-medium">1-855-STRUCTURE</p>
                    <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: '#F59E0B20' }}>
                    <MapPin className="h-6 w-6" style={{ color: '#F59E0B' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Headquarters</h4>
                    <p className="text-gray-600 font-medium">Montreal, Quebec</p>
                    <p className="text-sm text-gray-500">Canadian-owned & operated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold mb-4" style={{ color: BRAND_COLORS.primaryNavy }}>
                Quick Resources
              </h3>
              <div className="space-y-3">
                <Link
                  href="/en/features"
                  className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  View All Features
                </Link>
                <Link
                  href="/en/pricing"
                  className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  See Pricing Plans
                </Link>
                <Link
                  href="/en/sign-up"
                  className="block w-full text-center px-4 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: BRAND_COLORS.accentTeal }}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
              © 2025 StructureClerk. Montreal, Quebec |
              <Link href="/legal/privacy" className="hover:text-white ml-2">Privacy</Link> |
              <Link href="/legal/terms" className="hover:text-white ml-2">Terms</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}