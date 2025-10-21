'use client'

import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import Button from '@/components/ui/Button'

export default function TopNavigationBar() {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-icon.svg"
                alt="StructureClerk"
                width={40}
                height={40}
                className="hidden sm:block"
              />
              <Image
                src="/logo-icon.svg"
                alt="StructureClerk"
                width={32}
                height={32}
                className="sm:hidden"
              />
            </Link>
          </div>

          {/* Center - Empty for now or could add branding */}
          <div className="flex-1" />

          {/* Right - Login and Language Switcher */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Connexion
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}