'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">Structure</span>
              <span className="text-brand-orange">Clerk</span>
            </h3>
            <p className="text-blue-200 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/pricing" className="hover:text-brand-orange transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/qa" className="hover:text-brand-orange transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Portail & Support */}
          <div>
            <h4 className="font-semibold mb-4">Portail & Support</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/portal/login" className="hover:text-brand-orange transition-colors font-medium">
                  🔐 Portail Entreprise
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-brand-orange transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/legal/terms" className="hover:text-brand-orange transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-brand-orange transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@structureclerk.ca"
                  className="hover:text-brand-orange transition-colors"
                >
                  info@structureclerk.ca
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-300">
          <p>
            © 2025 StructureClerk. Un produit de TechVibes.
          </p>
        </div>
      </div>
    </footer>
  )
}
