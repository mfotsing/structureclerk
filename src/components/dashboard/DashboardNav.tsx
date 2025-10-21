'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

interface DashboardNavProps {
  userName: string
  children: React.ReactNode
}

export default function DashboardNav({ userName, children }: DashboardNavProps) {
  const t = useTranslations()

  return (
    <>
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
                {userName}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-brand-gray hover:text-brand-orange transition-colors"
                >
                  {t('nav.logout')}
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
              {t('nav.dashboard')}
            </NavLink>
            <NavLink href="/clients" icon="👥">
              {t('nav.clients')}
            </NavLink>
            <NavLink href="/projects" icon="🏗️">
              {t('nav.projects')}
            </NavLink>
            <NavLink href="/invoices" icon="📄">
              {t('nav.invoices')}
            </NavLink>
            <NavLink href="/quotes" icon="📝">
              {t('nav.quotes')}
            </NavLink>
            <NavLink href="/documents" icon="📁">
              {t('nav.documents')}
            </NavLink>
            <div className="pt-4 mt-4 border-t border-brand-blue/20">
              <NavLink href="/invoices/extract" icon="🤖">
                {t('nav.extraction')}
              </NavLink>
              <NavLink href="/forecasts" icon="📈">
                {t('nav.forecasts')}
              </NavLink>
              <NavLink href="/approvals" icon="✅">
                {t('nav.approvals')}
              </NavLink>
              <NavLink href="/admin" icon="📊">
                {t('nav.admin')}
              </NavLink>
              <NavLink href="/settings" icon="⚙️">
                {t('nav.settings')}
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </>
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
