<<<<<<< HEAD
=======
import Image from 'next/image'

>>>>>>> feat/ai-integration
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
<<<<<<< HEAD
          <h1 className="text-5xl font-bold text-gray-900">
            Structure<span className="text-blue-600">Clerk</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestion de factures et documents pour entrepreneurs en construction au Québec
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Commencer gratuitement
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
=======
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/logo.jpg"
              alt="StructureClerk Logo"
              width={80}
              height={80}
              className="rounded-xl shadow-md"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Structure<span className="text-blue-600">Clerk</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Gestion de factures et documents pour entrepreneurs en construction au Québec
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button className="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Commencer gratuitement
            </button>
            <button className="px-6 sm:px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
>>>>>>> feat/ai-integration
              En savoir plus
            </button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Factures & Soumissions</h3>
            <p className="text-gray-600">
              Créez et gérez vos factures avec calcul automatique des taxes québécoises (TPS/TVQ)
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion de projets</h3>
            <p className="text-gray-600">
              Organisez vos chantiers, suivez l&apos;avancement et centralisez tous vos documents
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaboration d&apos;équipe</h3>
            <p className="text-gray-600">
              Invitez votre équipe, partagez des documents et collaborez en temps réel
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
