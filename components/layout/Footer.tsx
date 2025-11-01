'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '@/components/brand/BrandColors';
import Logo from '@/components/brand/Logo';
import { Mail, Phone, MapPin, Shield, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 py-12">

          {/* Logo Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              <Logo className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              AI-powered business automation platform designed for Canadian entrepreneurs.
              Save time, increase productivity, and scale your business with confidence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                <span className="text-sm">info@structureclerk.ca</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                <span className="text-sm">1-833-STRUCTURE</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                <span className="text-sm">Toronto, ON, Canada</span>
              </div>
            </div>
          </motion.div>

          {/* Product Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{ color: BRAND_COLORS.accentTeal }}>
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Features', href: '/en/features' },
                { name: 'Pricing', href: '/en/pricing' },
                { name: 'Contact', href: '/en/contact' }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{ color: BRAND_COLORS.accentTeal }}>
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Blog', href: '/en/blog' },
                { name: 'Privacy Policy', href: '/en/privacy' },
                { name: 'Terms of Service', href: '/en/terms' }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="py-8 border-t border-gray-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="h-4 w-4 mr-2" style={{ color: BRAND_COLORS.accentTeal }} />
              PIPEDA Compliant
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="h-4 w-4 mr-2" style={{ color: BRAND_COLORS.accentTeal }} />
              SOC 2 Type II
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="h-4 w-4 mr-2" style={{ color: BRAND_COLORS.accentTeal }} />
              Canadian Data Centers
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="h-4 w-4 mr-2" style={{ color: BRAND_COLORS.accentTeal }} />
              Bank-Level Security
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="py-6 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} StructureClerk Inc. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}