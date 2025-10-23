import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StructureClerk - Gestion de factures et documents pour entrepreneurs en construction',
  description: 'Solution SaaS minimaliste de gestion de factures, soumissions et documents pour PME et entrepreneurs en construction au Québec',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsTracker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
