'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogIn, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HeroNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <>
      {/* Navigation Desktop */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo minimaliste */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">SC</span>
            </div>
            <span className="text-white font-bold text-lg">StructureClerk</span>
          </Link>

          {/* Bouton connexion discret */}
          {user ? (
            <Link
              href="/dashboard"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium border border-white/20 px-4 py-2 rounded-full"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-white hover:text-blue-200 transition-colors text-sm font-medium border border-white/20 px-4 py-2 rounded-full"
            >
              <LogIn className="w-4 h-4 mr-1" />
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo minimaliste mobile */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">SC</span>
            </div>
            <span className="text-white font-bold text-base">StructureClerk</span>
          </Link>

          {/* Menu burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="p-4 space-y-3">
              <Link
                href="/login"
                className="block w-full text-white hover:text-blue-200 transition-colors text-center py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2 inline" />
                Connexion
              </Link>
              <Link
                href="/dashboard"
                className="block w-full text-white hover:text-blue-200 transition-colors text-center py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}