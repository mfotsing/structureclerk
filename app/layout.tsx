import { Inter } from 'next/font/google'
import './globals.css'
import AccessibilityToggle from '@/components/ui/AccessibilityToggle'
import MobileOptimizer from '@/components/ui/MobileOptimizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StructureClerk - AI That Works For Your Business',
  description: 'Transform documents and calls into actions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AccessibilityToggle />
        <MobileOptimizer />
        {children}
      </body>
    </html>
  )
}