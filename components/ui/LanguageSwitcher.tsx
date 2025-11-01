'use client';

import { useTranslation } from './TranslationProvider';
import { Globe, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'en' ? 'EN' : 'FR'}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          <button
            onClick={() => setLanguage('en')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span>English</span>
            </div>
            {language === 'en' && <Check className="h-4 w-4 text-blue-600" />}
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🇫🇷</span>
              <span>Français</span>
            </div>
            {language === 'fr' && <Check className="h-4 w-4 text-blue-600" />}
          </button>
        </div>
      </div>
    </div>
  );
}