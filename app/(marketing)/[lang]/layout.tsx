import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Sora } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

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

// Supported locales
const locales = ['en', 'fr'];

export default async function LocaleLayout({
  children,
  params: { lang }
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  // Validate that the incoming `lang` is a supported locale
  if (!locales.includes(lang)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={lang} className={`h-full ${inter.variable} ${sora.variable}`}>
      <body className="h-full bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            {/* Main content will be rendered here */}
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}