'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  
  // Rediriger vers la page d'extraction de fichiers IA
  useEffect(() => {
    router.push('/dashboard/files')
  }, [router])
  
  // Afficher un état de chargement pendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
    </div>
  )
}
