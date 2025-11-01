'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '@/components/brand/BrandColors';
import Logo from '@/components/brand/Logo';
import { useTranslation } from '@/hooks/useTranslation';
import { Mail, Phone, Shield, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">

          {/* Logo and Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 text-center md:text-left"
          >
            <div className="mb-6">
              <Logo className="h-8 w-auto inline-block" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              AI-powered business automation platform designed for Canadian entrepreneurs.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start text-gray-300">
                <Mail className="h-4 w-4 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                <span className="text-sm">info@structureclerk.ca</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-300">
                <Phone className="h-4 w-4 mr-3" style={{ color: BRAND_COLORS.accentTeal }} />
                <span className="text-sm">1-833-STRUCTURE</span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-8 justify-center"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_COLORS.accentTeal }}>
                {t('footer.product')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/en/features"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('common.features')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/en/pricing"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('common.pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/en/contact"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_COLORS.accentTeal }}>
                {t('footer.legal')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/en/privacy"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/en/terms"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('footer.terms')}
                  </Link>
                </li>
              </ul>
            </div>
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
              {t('footer.copyright')}
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