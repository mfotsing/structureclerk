import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ChatAssistant from '@/components/chat/ChatAssistant'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-brand-blue/20 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/logo-icon.svg"
                  alt="StructureClerk"
                  width={40}
                  height={40}
                  className="drop-shadow-sm"
                />
                <span className="text-2xl font-bold hidden sm:block">
                  <span className="text-brand-navy">Structure</span>
                  <span className="text-brand-orange">Clerk</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-sm text-brand-gray">
                {profile?.full_name || user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-brand-gray hover:text-brand-orange transition-colors"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-brand-blue/20 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            <NavLink href="/dashboard" icon="📊">
              Tableau de bord
            </NavLink>
            <NavLink href="/clients" icon="👥">
              Clients
            </NavLink>
            <NavLink href="/projects" icon="🏗️">
              Projets
            </NavLink>
            <NavLink href="/invoices" icon="📄">
              Factures
            </NavLink>
            <NavLink href="/quotes" icon="📝">
              Soumissions
            </NavLink>
            <NavLink href="/documents" icon="📁">
              Documents
            </NavLink>
            <div className="pt-4 mt-4 border-t border-brand-blue/20">
              <NavLink href="/invoices/extract" icon="🤖">
                Extraction IA
              </NavLink>
              <NavLink href="/forecasts" icon="📈">
                Prévisions IA
              </NavLink>
              <NavLink href="/approvals" icon="✅">
                Approbations
              </NavLink>
              <NavLink href="/admin" icon="📊">
                Analytics Admin
              </NavLink>
              <NavLink href="/settings" icon="⚙️">
                Paramètres
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* AI Chat Assistant - Available on all dashboard pages */}
      <ChatAssistant />
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-2 text-brand-navy rounded-lg hover:bg-brand-orange/10 hover:text-brand-orange transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
