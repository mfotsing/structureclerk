import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewDashboardNav from '@/components/navigation/NewDashboardNav'
import ChatAssistant from '@/components/chat/ChatAssistant'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-ui-background-secondary">
      <NewDashboardNav userName={profile?.full_name || user.email || ''}>
        {children}
      </NewDashboardNav>

      {/* AI Chat Assistant - Available on all dashboard pages */}
      <ChatAssistant />
    </div>
  )
}
