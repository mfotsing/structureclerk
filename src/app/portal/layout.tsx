import { ReactNode } from 'react'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'

export default function PortalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <div className="min-h-screen">
          <AnalyticsTracker />
          {children}
        </div>
      </body>
    </html>
  )
}