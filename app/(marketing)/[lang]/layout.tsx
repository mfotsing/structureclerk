import { Inter, Sora } from 'next/font/google';
import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      {/* Main content will be rendered here */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}