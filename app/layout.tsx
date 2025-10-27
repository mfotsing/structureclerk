import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Sora } from 'next/font/google';
import { ClerkProviderWrapper } from '@/providers/clerk-provider';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

// Font configurations
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

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <ClerkProviderWrapper locale={locale}>
      <html
        lang={locale}
        suppressHydrationWarning
        className={`${inter.variable} ${sora.variable}`}
      >
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0A84FF" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="StructureClerk" />
          <meta name="application-name" content="StructureClerk" />
          <meta name="msapplication-TileColor" content="#0A84FF" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0A84FF" />
        </head>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const isEnglish = locale === 'en';

  return {
    title: {
      default: isEnglish
        ? 'StructureClerk - Your AI Admin Assistant'
        : 'StructureClerk - Votre Assistant Administratif IA',
      template: isEnglish
        ? '%s | StructureClerk'
        : '%s | StructureClerk'
    },
    description: isEnglish
      ? 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices. Organize. Draft. Send. Get paid.'
      : 'Transformez les documents et appels en actions: résumé, tâches, suivis, contrats, factures. Classez. Rédigez. Envoyez. Encaissez.',
    keywords: isEnglish
      ? 'AI assistant, document management, transcription, task automation, invoicing, Canadian business'
      : 'assistant IA, gestion documentaire, transcription, automatisation des tâches, facturation, entreprise canadienne',
    authors: [{ name: 'StructureClerk' }],
    creator: 'StructureClerk',
    publisher: 'StructureClerk',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://structureclerk.ca'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `/${locale}`,
      title: isEnglish
        ? 'StructureClerk - Your AI Admin Assistant'
        : 'StructureClerk - Votre Assistant Administratif IA',
      description: isEnglish
        ? 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices.'
        : 'Transformez les documents et appels en actions: résumé, tâches, suivis, contrats, factures.',
      siteName: 'StructureClerk',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'StructureClerk - AI Admin Assistant',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEnglish
        ? 'StructureClerk - Your AI Admin Assistant'
        : 'StructureClerk - Votre Assistant Administratif IA',
      description: isEnglish
        ? 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices.'
        : 'Transformez les documents et appels en actions: résumé, tâches, suivis, contrats, factures.',
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}