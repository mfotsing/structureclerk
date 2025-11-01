'use client';

import { useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface TranslationHook {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.getStarted': 'Get Started',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',

    // Common
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.startTrial': 'Start Free Trial',
    'common.contactUs': 'Contact Us',
    'common.readMore': 'Read More',
    'common.viewDemo': 'View Demo',
    'common.pricing': 'Pricing',
    'common.features': 'Features',

    // Footer
    'footer.product': 'Product',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© {{year}} StructureClerk Inc. All rights reserved.',
    'footer.builtInCanada': 'Built with ❤️ in Canada.',

    // Accessibility
    'accessibility.title': 'Accessibility',
    'accessibility.simplifiedMode': 'Simplified Mode',
    'accessibility.simplifiedDesc': 'Reduced interface for better clarity',
    'accessibility.largeFonts': 'Larger Fonts',
    'accessibility.largeFontsDesc': 'Increases text size by 50%',
    'accessibility.highContrast': 'High Contrast',
    'accessibility.highContrastDesc': 'Improves readability for sensitive eyes',
    'accessibility.reducedMotion': 'Reduced Motion',
    'accessibility.reducedMotionDesc': 'Reduces animations and transitions',
    'accessibility.settingsSaved': 'Settings saved automatically',

    // Auth
    'auth.signIn': 'Sign in to your account',
    'auth.signInDesc': 'Welcome back! Please sign in to continue.',
    'auth.signUp': 'Start your free trial',
    'auth.signUpDesc': 'Transform your business documents with AI. No credit card required.',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.agreeToTerms': 'I agree to the',
    'auth.and': 'and',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.signInLink': 'Sign in',
    'auth.signUpLink': 'Sign up for free',
    'auth.createAccount': 'Create Account',
    'auth.creatingAccount': 'Creating Account...',
    'auth.signingIn': 'Signing In...',
    'auth.invalidCredentials': 'Invalid email or password. Please try again.',

    // Form validation
    'form.required': 'This field is required',
    'form.emailInvalid': 'Please enter a valid email address',
    'form.passwordMin': 'Password must be at least 8 characters',
    'form.passwordMatch': 'Passwords do not match',
  },
  fr: {
    // Navigation
    'nav.features': 'Fonctionnalités',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.getStarted': 'Commencer',
    'nav.signIn': 'Se connecter',
    'nav.signUp': "S'inscrire",

    // Common
    'common.learnMore': 'En savoir plus',
    'common.getStarted': 'Commencer',
    'common.startTrial': 'Essai gratuit',
    'common.contactUs': 'Nous contacter',
    'common.readMore': 'Lire plus',
    'common.viewDemo': 'Voir démo',
    'common.pricing': 'Tarifs',
    'common.features': 'Fonctionnalités',

    // Footer
    'footer.product': 'Produit',
    'footer.legal': 'Légal',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.copyright': '© {{year}} StructureClerk Inc. Tous droits réservés.',
    'footer.builtInCanada': 'Conçu avec ❤️ au Canada.',

    // Accessibility
    'accessibility.title': 'Accessibilité',
    'accessibility.simplifiedMode': 'Mode simplifié',
    'accessibility.simplifiedDesc': 'Interface réduite pour plus de clarté',
    'accessibility.largeFonts': 'Polices plus grandes',
    'accessibility.largeFontsDesc': 'Augmente la taille du texte de 50%',
    'accessibility.highContrast': 'Contraste élevé',
    'accessibility.highContrastDesc': 'Améliore la lisibilité pour les yeux sensibles',
    'accessibility.reducedMotion': 'Mouvements réduits',
    'accessibility.reducedMotionDesc': 'Réduit les animations et transitions',
    'accessibility.settingsSaved': 'Paramètres sauvegardés automatiquement',

    // Auth
    'auth.signIn': 'Connectez-vous à votre compte',
    'auth.signInDesc': 'Bon retour ! Veuillez vous connecter pour continuer.',
    'auth.signUp': 'Commencez votre essai gratuit',
    'auth.signUpDesc': 'Transformez vos documents d\'affaires avec l\'IA. Aucune carte de crédit requise.',
    'auth.email': 'Adresse email',
    'auth.password': 'Mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.agreeToTerms': 'J\'accepte les',
    'auth.and': 'et les',
    'auth.haveAccount': 'Vous avez déjà un compte ?',
    'auth.noAccount': 'Vous n\'avez pas de compte ?',
    'auth.signInLink': 'Se connecter',
    'auth.signUpLink': 'S\'inscrire gratuitement',
    'auth.createAccount': 'Créer un compte',
    'auth.creatingAccount': 'Création du compte...',
    'auth.signingIn': 'Connexion...',
    'auth.invalidCredentials': 'Email ou mot de passe invalide. Veuillez réessayer.',

    // Form validation
    'form.required': 'Ce champ est requis',
    'form.emailInvalid': 'Veuillez entrer une adresse email valide',
    'form.passwordMin': 'Le mot de passe doit contenir au moins 8 caractères',
    'form.passwordMatch': 'Les mots de passe ne correspondent pas',
  }
};

export function useTranslation(): TranslationHook {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Handle template variables like {{year}}
    return translation.replace(/{{(\w+)}}/g, (match, varName) => {
      if (varName === 'year') return new Date().getFullYear().toString();
      return match;
    });
  };

  return {
    language,
    setLanguage,
    t
  };
}