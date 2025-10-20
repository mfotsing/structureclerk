import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo-full.svg"
              alt="StructureClerk Logo"
              width={600}
              height={150}
              className="w-full max-w-2xl h-auto"
            />
          </div>
          <p className="text-lg sm:text-xl text-brand-gray max-w-2xl mx-auto px-4">
            Gestion de factures et documents pour entrepreneurs en construction au Québec
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button className="px-6 sm:px-8 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md">
              Commencer gratuitement
            </button>
            <button className="px-6 sm:px-8 py-3 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-medium">
              En savoir plus
            </button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-colors">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-navy">Factures & Soumissions</h3>
            <p className="text-brand-gray">
              Créez et gérez vos factures avec calcul automatique des taxes québécoises (TPS/TVQ)
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-colors">
            <div className="w-12 h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-navy">Gestion de projets</h3>
            <p className="text-brand-gray">
              Organisez vos chantiers, suivez l&apos;avancement et centralisez tous vos documents
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-colors">
            <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-navy">Collaboration d&apos;équipe</h3>
            <p className="text-brand-gray">
              Invitez votre équipe, partagez des documents et collaborez en temps réel
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
