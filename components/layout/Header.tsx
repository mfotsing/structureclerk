'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { BRAND_COLORS } from '@/components/brand/BrandColors';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: t('nav.features'), href: '/en/features' },
    { name: t('nav.pricing'), href: '/en/pricing' },
    { name: t('nav.contact'), href: '/en/contact' },
    { name: t('nav.blog'), href: '/en/blog' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/en" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href="/en/sign-up"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: BRAND_COLORS.primaryNavy }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = BRAND_COLORS.accentTeal;
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = BRAND_COLORS.primaryNavy;
              }}
            >
              {t('nav.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              <Link
                href="/en/sign-up"
                className="block px-3 py-2 rounded-lg text-white transition-colors font-medium"
                style={{ backgroundColor: BRAND_COLORS.primaryNavy }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}