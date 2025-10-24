'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { useUserSegmentation, getNavigationForSegment } from '@/contexts/UserSegmentationContext'
import { SimplifiedText } from '@/contexts/TerminologyContext'

interface DashboardNavProps {
  userName: string
  children: React.ReactNode
}

export default function DashboardNav({ userName, children }: DashboardNavProps) {
  const t = useTranslations()
  const { segment, isLoaded, updateActivity } = useUserSegmentation()

  // Get adaptive navigation based on user segment
  const navigationItems = isLoaded ? getNavigationForSegment(segment) : []

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
          {/* User Segment Badge */}
          {isLoaded && (
            <div className="px-4 pt-4 pb-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-700">
                    Votre profil:
                  </span>
                </div>
                <div className="text-sm font-semibold text-blue-900 capitalize">
                  <SimplifiedText text={segment.replace('_', ' ')} />
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  <SimplifiedText text="Navigation adaptée à vos besoins" />
                </div>
              </div>
            </div>
          )}

          <nav className="p-4 space-y-1">
            {isLoaded ? (
              <>
                {/* Primary Navigation */}
                {navigationItems
                  .filter(item => item.priority === 'high')
                  .map((item) => (
                    <AdaptiveNavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => updateActivity(item.href.split('/')[2])}
                    />
                  ))}

                {/* Secondary Navigation */}
                {navigationItems.filter(item => item.priority === 'medium').length > 0 && (
                  <div className="pt-4 mt-4 border-t border-brand-blue/20">
                    <div className="px-3 py-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SimplifiedText text="Outils avancés" />
                      </span>
                    </div>
                    {navigationItems
                      .filter(item => item.priority === 'medium')
                      .map((item) => (
                        <AdaptiveNavLink
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          onClick={() => updateActivity(item.href.split('/')[2])}
                        />
                      ))}
                  </div>
                )}

                {/* Settings */}
                {navigationItems.filter(item => item.priority === 'low').length > 0 && (
                  <div className="pt-4 mt-4 border-t border-brand-blue/20">
                    {navigationItems
                      .filter(item => item.priority === 'low')
                      .map((item) => (
                        <AdaptiveNavLink
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          onClick={() => updateActivity(item.href.split('/')[2])}
                        />
                      ))}
                  </div>
                )}
              </>
            ) : (
              // Loading skeleton
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
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

function AdaptiveNavLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: string
  label: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-2 text-brand-navy rounded-lg hover:bg-brand-orange/10 hover:text-brand-orange transition-colors group"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium"><SimplifiedText text={label} /></span>
    </Link>
  )
}
