'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import HCaptcha from '@/components/ui/HCaptcha';

export default function ContactPage() {
  const t = useTranslations('contact');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'en';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // hCaptcha state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // hCaptcha callback handlers
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setSubmitStatus({
      type: 'error',
      message: 'Captcha verification failed. Please try again.'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Verify captcha token is present
      if (!captchaToken) {
        throw new Error('Please complete the captcha verification');
      }

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken: captchaToken,
          language: locale,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully!'
        });
        // Reset form
        setFormData({ name: '', email: '', company: '', message: '' });
        setCaptchaToken(null);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
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
              className="mb-8"
            >
              <Mail className="h-16 w-16 text-brand-blue mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Have questions about StructureClerk? We're here to help. Reach out to our Canadian
                support team and we'll get back to you within 24 business hours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card p-8 rounded-xl border shadow-sm">
                <h2 className="text-2xl font-bold font-heading mb-6">Send us a message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Your full name"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="your.email@company.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Company Field */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Your company name (optional)"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* hCaptcha */}
                  <HCaptcha
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                    onError={handleCaptchaError}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !captchaToken}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Status Message */}
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg flex items-center gap-3 ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {submitStatus.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{submitStatus.message}</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Quick Contact */}
              <div className="bg-card p-8 rounded-xl border shadow-sm">
                <h3 className="text-xl font-bold font-heading mb-6">Get in touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground">hello@structureclerk.ca</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground">+1 (514) 555-0123</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Office</h4>
                      <address className="text-muted-foreground not-italic">
                        123 Rue Sainte-Catherine<br />
                        Montréal, QC H3B 1B6<br />
                        Canada
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Ways to Reach Us */}
              <div className="bg-card p-8 rounded-xl border shadow-sm">
                <h3 className="text-xl font-bold font-heading mb-6">Other ways to connect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Live Chat</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Chat with our AI assistant for instant answers to common questions.
                    </p>
                    <button className="text-brand-blue hover:text-brand-blue-dark text-sm font-medium">
                      Open Chat →
                    </button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Schedule a Demo</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Book a personalized demo with our team to see StructureClerk in action.
                    </p>
                    <button className="text-brand-blue hover:text-brand-blue-dark text-sm font-medium">
                      Schedule Demo →
                    </button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Technical Support</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      For technical issues or account help, please email our support team.
                    </p>
                    <button className="text-brand-blue hover:text-brand-blue-dark text-sm font-medium">
                      support@structureclerk.ca →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}