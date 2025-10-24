import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { UserSegmentationProvider } from '@/contexts/UserSegmentationContext'
import { TerminologyProvider } from '@/contexts/TerminologyContext'
import { FeedbackProvider } from '@/contexts/FeedbackContext'
import FeedbackSurvey from '@/components/feedback/FeedbackSurvey'
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
      <UserSegmentationProvider userId={user.id}>
        <TerminologyProvider>
          <FeedbackProvider userId={user.id}>
            <DashboardNav userName={profile?.full_name || user.email || ''}>
              {children}
            </DashboardNav>
            <FeedbackSurvey />
          </FeedbackProvider>
        </TerminologyProvider>
      </UserSegmentationProvider>

      {/* AI Chat Assistant - Available on all dashboard pages */}
      <ChatAssistant />
    </div>
  )
}
