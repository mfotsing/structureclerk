'use client';

import { TranslationProvider } from '@/components/ui/TranslationProvider';

interface TranslationWrapperProps {
  children: React.ReactNode;
}

export default function TranslationWrapper({ children }: TranslationWrapperProps) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  );
}