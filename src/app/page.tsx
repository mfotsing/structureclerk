import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-orange-50">
      <main className="flex-1">
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

          {/* Hero Headline - Seth Godin style: Clear problem + clear solution */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy max-w-4xl mx-auto px-4 leading-tight">
            Arrêtez de perdre du temps avec la paperasse.
            <span className="text-brand-orange"> Concentrez-vous sur ce que vous faites le mieux : bâtir.</span>
          </h1>

          {/* Value Proposition - Alexandra Martel style: Emotional + specific */}
          <p className="text-lg sm:text-xl text-brand-gray max-w-3xl mx-auto px-4 leading-relaxed">
            Vous êtes entrepreneur en construction au Québec. Votre expertise, c&apos;est sur le chantier, pas derrière un bureau à chercher des factures.
            <strong className="text-brand-navy"> StructureClerk automatise toute votre gestion administrative</strong> — de l&apos;analyse de documents par IA à la génération de réponses aux appels d&apos;offres.
          </p>

          {/* Social Proof Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-brand-gray">
            <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>30 jours d&apos;essai gratuit • Aucune carte requise • Prêt en 2 minutes</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/signup"
              className="px-8 sm:px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center text-lg"
            >
              Démarrer mon essai gratuit →
            </Link>
            <a
              href="#features"
              className="px-8 sm:px-10 py-4 bg-white text-brand-navy border-2 border-brand-navy rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
            >
              Voir comment ça marche
            </a>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-brand-gray italic">
            &ldquo;Enfin une solution pensée pour les entrepreneurs québécois. Fini les heures perdues dans Excel.&rdquo;
          </p>
        </div>

        {/* Features Section - Benefit-driven */}
        <div id="features" className="mt-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-navy mb-4">
            Comment StructureClerk transforme votre quotidien
          </h2>
          <p className="text-center text-brand-gray text-lg mb-16 max-w-2xl mx-auto">
            Plus qu&apos;un simple logiciel de facturation. Une plateforme intelligente qui comprend les défis des entrepreneurs québécois.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: AI-Powered */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">IA qui travaille pour vous</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">Uploadez un PDF d&apos;appel d&apos;offres le matin, obtenez une réponse professionnelle l&apos;après-midi.</strong> Notre IA analyse, extrait les données clés et génère des documents conformes aux standards québécois.
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Analyse de contrats et détection des risques</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Génération automatique de réponses aux appels d&apos;offres</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Classification intelligente de vos documents</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Quebec-Specific */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-navy to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">Pensé pour le Québec</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">TPS, TVQ, RBQ, CCQ...</strong> Tous les formulaires et calculs spécifiques au Québec sont intégrés. Plus besoin de vérifier vos pourcentages ou de chercher les bons modèles.
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Calcul automatique TPS (5%) + TVQ (9.975%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Conformité aux normes de construction québécoises</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Modèles bilingues français/anglais inclus</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: All-in-One */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-brand-blue/20 hover:border-brand-orange transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-navy">Tout au même endroit</h3>
              <p className="text-brand-gray mb-4 leading-relaxed">
                <strong className="text-brand-navy">Clients, projets, factures, soumissions, documents.</strong> Finies les 5 applications différentes. Tout est centralisé, synchronisé et accessible depuis n&apos;importe où.
              </p>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tableau de bord en temps réel de tous vos projets</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Collaboration d&apos;équipe avec permissions personnalisées</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Stockage sécurisé et sauvegarde automatique</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-32 bg-gradient-to-br from-brand-navy to-blue-900 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à reprendre le contrôle de votre temps ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les entrepreneurs québécois qui ont déjà économisé des centaines d&apos;heures de paperasse.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            Essayer gratuitement pendant 30 jours →
          </Link>
          <p className="text-sm text-blue-200 mt-6">
            Installation en 2 minutes • Aucune carte de crédit requise • Annulation en 1 clic
          </p>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
