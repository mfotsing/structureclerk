'use client'

import { useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Globe, Check } from 'lucide-react'
import { locales, type Locale } from '@/i18n/config'

const LANGUAGE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

const LANGUAGE_FLAGS: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      // Set cookie for locale
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

      // Reload page to apply new locale
      window.location.reload()
    })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-brand-orange hover:bg-gray-100 rounded-lg transition-colors"
        disabled={isPending}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">
          {LANGUAGE_FLAGS[currentLocale]} {LANGUAGE_NAMES[currentLocale]}
        </span>
        <span className="sm:hidden">
          {LANGUAGE_FLAGS[currentLocale]}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                disabled={isPending}
                className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                  currentLocale === locale ? 'bg-brand-orange/10' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{LANGUAGE_FLAGS[locale]}</span>
                  <span className="font-medium text-gray-700">
                    {LANGUAGE_NAMES[locale]}
                  </span>
                </span>
                {currentLocale === locale && (
                  <Check className="w-5 h-5 text-brand-orange" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {isPending && (
        <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
