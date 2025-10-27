import { Inter, Sora } from 'next/font/google';
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
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
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'StructureClerk - Your AI Admin Assistant',
  description: 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices. Organize. Draft. Send. Get paid.',
  keywords: 'AI assistant, document management, transcription, task automation, invoicing, Canadian business',
  authors: [{ name: 'StructureClerk' }],
  creator: 'StructureClerk',
  publisher: 'StructureClerk',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://structureclerk.ca'),
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://structureclerk.ca',
    title: 'StructureClerk - Your AI Admin Assistant',
    description: 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices.',
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
    title: 'StructureClerk - Your AI Admin Assistant',
    description: 'Transform documents and calls into actions: summary, tasks, follow-ups, contracts, invoices.',
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
};