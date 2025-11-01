import { Inter } from 'next/font/google'
import './globals.css'
import AccessibilityToggle from '@/components/ui/AccessibilityToggle'
import MobileOptimizer from '@/components/ui/MobileOptimizer'
import { ClerkProvider } from '@clerk/nextjs'

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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/en/sign-in"
      signUpUrl="/en/sign-up"
      afterSignInUrl="/app"
      afterSignUpUrl="/app"
    >
      <html lang="en" className="dark">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#0A1A33" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="apple-touch-icon" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </head>
        <body className={inter.className}>
          <AccessibilityToggle />
          <MobileOptimizer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}