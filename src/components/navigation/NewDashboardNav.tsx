'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface NavigationItem {
  id: string
  label: string
  href: string
  icon: string
  description?: string
  badge?: number
}

interface NewDashboardNavProps {
  userName: string
  children: React.ReactNode
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    href: '/dashboard',
    icon: '📊',
    description: 'Vue synthétique et alertes'
  },
  {
    id: 'projects',
    label: 'Projets',
    href: '/projects',
    icon: '🏗️',
    description: 'Hub central de vos chantiers'
  },
  {
    id: 'clients',
    label: 'Clients',
    href: '/clients',
    icon: '👤',
    description: 'Gestion des contacts'
  },
  {
    id: 'ged',
    label: 'GED Intelligente',
    href: '/documents',
    icon: '📁',
    description: 'Upload IA et classement'
  },
  {
    id: 'reports',
    label: 'Rapports & Suivi',
    href: '/reports',
    icon: '📈',
    description: 'Analyses et prévisions'
  },
  {
    id: 'settings',
    label: 'Paramètres & Admin',
    href: '/settings',
    icon: '⚙️',
    description: 'Configuration système'
  }
]

export default function NewDashboardNav({ userName, children }: NewDashboardNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white border-b border-ui-border shadow-sm sticky top-0 z-40">
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
              {/* Notifications */}
              <button className="relative p-2 text-ui-text-muted hover:text-ui-text transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-ui-text">{userName}</p>
                  <p className="text-xs text-ui-text-muted">Administrateur</p>
                </div>
                <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-ui-text hover:text-brand-orange transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-ui-border min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive(item.href)
                    ? "bg-brand-orange/10 text-brand-orange border-l-4 border-brand-orange"
                    : "text-ui-text hover:text-brand-orange hover:bg-ui-background-hover"
                )}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-ui-text-muted mt-0.5">{item.description}</p>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-ui-error text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-ui-border mt-4">
            <h3 className="text-xs font-semibold text-ui-text-muted uppercase tracking-wider mb-3">
              Actions Rapides
            </h3>
            <div className="space-y-2">
              <Link href="/documents/upload">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <span className="mr-2">⚡</span>
                  Upload Intelligent
                </Button>
              </Link>
              <Link href="/projects/new">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <span className="mr-2">➕</span>
                  Nouveau Projet
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
              <div className="p-4 border-b border-ui-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo-icon.svg"
                      alt="StructureClerk"
                      width={32}
                      height={32}
                    />
                    <span className="text-xl font-bold">
                      <span className="text-brand-navy">Structure</span>
                      <span className="text-brand-orange">Clerk</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-ui-text hover:text-brand-orange"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <nav className="p-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive(item.href)
                        ? "bg-brand-orange/10 text-brand-orange"
                        : "text-ui-text hover:text-brand-orange hover:bg-ui-background-hover"
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-ui-text-muted">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ui-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-ui-text">{userName}</p>
                    <p className="text-xs text-ui-text-muted">Administrateur</p>
                  </div>
                </div>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="ghost" className="w-full justify-start">
                    <span className="mr-2">🚪</span>
                    Déconnexion
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-ui-background-secondary">
          <div className="p-6 lg:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
