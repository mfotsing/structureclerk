'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}