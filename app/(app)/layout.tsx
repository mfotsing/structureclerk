'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import GlobalSearch from '@/components/GlobalSearch'
import AIAssistant from '@/components/AIAssistant'
import SidebarNavigation from '@/components/navigation/SidebarNavigation'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <SidebarNavigation />
      <div style={{ marginLeft: '20rem', transition: 'margin-left 0.3s ease' }}>
        <GlobalSearch />
        <AIAssistant />
        <main className="main-content">
          {children}
        </main>
      </div>
    </LanguageProvider>
  )
}