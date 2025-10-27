"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
  locale?: string;
}

export function ClerkProviderWrapper({
  children,
  locale = "en"
}: ClerkProviderWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Get the appropriate appearance based on theme and locale
  const getAppearance = () => {
    const isDarkMode = document?.documentElement?.classList?.contains("dark");

    return {
      // baseTheme: isDarkMode ? dark : undefined, // Commented out - using CSS variables instead
      elements: {
        formButtonPrimary: "bg-brand-blue hover:bg-brand-blue-dark text-white",
        footerActionLink: "text-brand-blue hover:text-brand-blue-dark",
        card: "shadow-lg border border-gray-200 dark:border-gray-700",
        headerTitle: "text-gray-900 dark:text-gray-100",
        headerSubtitle: "text-gray-600 dark:text-gray-400"
      },
      variables: {
        colorPrimary: "#0A84FF",
        colorBackground: isDarkMode ? "#0A0F1C" : "#ffffff",
        colorInputBackground: isDarkMode ? "#111827" : "#ffffff",
        colorInputText: isDarkMode ? "#F8FAFC" : "#0B1220"
      }
    };
  };

  // Handle sign-in redirects based on locale
  const signInUrl = `/${locale}/sign-in`;
  const signUpUrl = `/${locale}/sign-up`;
  const afterSignInUrl = `/${locale}/app`;
  const afterSignUpUrl = `/${locale}/app`;

  return (
    <ClerkProvider
      appearance={getAppearance()}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
      localization={{
        // Simplified French translations
        ...(locale === "fr" ? {
          socialButtonsBlockButtonText: "Continuer avec {{provider}}",
          formFieldLabelEmailAddress: "Adresse email",
          formFieldLabelPassword: "Mot de passe",
          formButtonPrimary: "Continuer",
          footerActionLinkSignIn: "Vous avez déjà un compte ?",
          footerActionLinkSignUp: "Pas encore de compte ?",
          signInButtonText: "Se connecter",
          signUpButtonText: "S'inscrire"
        } : {})
      }}
    >
      {children}
    </ClerkProvider>
  );
}