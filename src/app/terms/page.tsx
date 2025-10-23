import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, AlertTriangle, Scale, Users } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.svg"
                alt="StructureClerk"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-900">Structure</span>
                <span className="text-orange-500">Clerk</span>
              </span>
            </Link>

            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Conditions d\'Utilisation</h1>
          <p className="text-xl text-blue-100">
            Les règles et conditions régissant l\'utilisation de StructureClerk
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dernière mise à jour : 23 octobre 2024</h2>
              <p className="text-gray-600 leading-relaxed">
                Bienvenue sur StructureClerk. Ces conditions d\'utilisation (« Conditions ») régissent votre accès et utilisation
                de notre plateforme et services (collectivement, le « Service ») offerts par StructureClerk.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                En accédant ou en utilisant notre Service, vous acceptez d\'être lié par ces Conditions.
                Si vous n\'êtes pas d\'accord avec ces Conditions, veuillez ne pas utiliser notre Service.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptation des conditions</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                En créant un compte StructureClerk, vous confirmez que vous avez au moins 18 ans et que vous avez la capacité
                légale de conclure des contrats. Vous acceptez ces Conditions et notre Politique de Confidentialité.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. Description du service</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                StructureClerk est une plateforme SaaS conçue pour les entrepreneurs du bâtiment qui offre :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Gestion et traitement des documents administratifs</li>
                <li>Extraction automatique des données des factures et soumissions</li>
                <li>Évaluation du chaos administratif via notre scorecard</li>
                <li>Prévisions financières basées sur l\'IA</li>
                <li>Gestion de la relation client</li>
                <li>Rapports et analyses personnalisés</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilités de l\'utilisateur</h2>
              <p className="text-gray-600 leading-relaxed mb-4">En tant qu\'utilisateur StructureClerk, vous vous engagez à :</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Fournir des informations exactes et à jour lors de l\'inscription</li>
                <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                <li>Utiliser le Service uniquement à des fins professionnelles légales</li>
                <li>Ne pas téléverser de contenu illégal, offensant ou malveillant</li>
                <li>Respecter les droits de propriété intellectuelle des tiers</li>
                <li>Ne pas tenter de pirater ou nuire à nos systèmes</li>
                <li>Payer tous les frais applicables dans les délais prévus</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">4. Propriété intellectuelle</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                StructureClerk et son contenu, ses fonctionnalités et ses fonctionnalités sont et resteront la propriété exclusive
                de StructureClerk et de ses concédants de licence, protégés par les lois sur le droit d\'auteur, les marques de commerce
                et autres lois.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous ne pouvez pas :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Reproduire, distribuer ou modifier notre contenu sans autorisation</li>
                <li>Utiliser nos marques de commerce ou logos sans permission</li>
                <li>Extraire notre code source ou tenter de le reproduire</li>
                <li>Vendre ou sous-licencier l\'accès à notre Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contenu utilisateur</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous conservez la propriété de tout contenu que vous téléversez ou traitez via StructureClerk.
                En utilisant notre Service, vous nous accordez une licence mondiale, non exclusive, gratuit et sous-licenciable
                pour utiliser, traiter et stocker votre contenu uniquement pour fournir nos services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Vous déclarez et garantissez que vous disposez de tous les droits nécessaires sur votre contenu
                et que celui-ci ne viole aucun droit de tiers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Abonnements et paiement</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                StructureClerk offre des abonnements mensuels avec les caractéristiques suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Plan Pro :</strong> 99$ CAD par mois, facturation mensuelle</li>
                <li><strong>Plan Enterprise :</strong> 299$ CAD par mois, facturation mensuelle</li>
                <li><strong>Période d\'essai :</strong> 30 jours gratuits pour tous les nouveaux clients</li>
                <li><strong>Résiliation :</strong> Annulation possible à tout moment sans frais</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Les paiements sont traités via nos processeurs de paiement sécurisés. Vous autorisez StructureClerk
                à débiter votre carte de crédit pour le montant de l\'abonnement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Confidentialité</h2>
              <p className="text-gray-600 leading-relaxed">
                Votre confidentialité est importante pour nous. Notre utilisation de vos informations personnelles
                est régie par notre Politique de Confidentialité, qui fait partie intégrante de ces Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Garanties et exonération de responsabilité</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Notre Service est fourni « tel quel » et « tel que disponible ». Dans la mesure maximale autorisée par la loi,
                StructureClerk décline toute garantie, expresse ou implicite, y compris les garanties de qualité marchande,
                d\'adéquation à un usage particulier et de non-violation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                StructureClerk ne garantit pas que notre Service sera ininterrompu, sécurisé ou exempt d\'erreurs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation de responsabilité</h2>
              <p className="text-gray-600 leading-relaxed">
                Dans la mesure maximale permise par la loi, StructureClerk ne sera pas responsable des dommages directs,
                indirects, spéciaux, accessoires ou exemplaires résultant de l\'utilisation ou de l\'incapacité à utiliser notre Service.
                Notre responsabilité totale ne dépassera en aucun cas le montant que vous avez payé pour le Service au cours des 12 mois précédents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Résiliation</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous pouvez résilier votre compte StructureClerk à tout moment en supprimant votre compte ou en annulant votre abonnement.
                StructureClerk peut résilier votre compte et accéder immédiatement si vous violez ces Conditions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                En cas de résiliation, vous perdrez l\'accès à votre compte et à vos données, conformément à notre Politique de Confidentialité.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Lois applicables</h2>
              <p className="text-gray-600 leading-relaxed">
                Ces Conditions sont régies par les lois du Québec et du Canada, sans tenir compte des principes de conflit de lois.
                Tout litige sera résolu par les tribunaux compétents du Québec.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications des conditions</h2>
              <p className="text-gray-600 leading-relaxed">
                StructureClerk se réserve le droit de modifier ces Conditions à tout moment. Les modifications entreront en vigueur
                dès leur publication sur notre plateforme. Nous vous informerons des modifications importantes par email.
                Votre utilisation continue du Service après de telles modifications constitue votre acceptation des nouvelles Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant ces Conditions d\'Utilisation, contactez-nous :
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>Email :</strong> <a href="mailto:legal@structureclerk.ca" className="text-blue-600 hover:text-blue-800">legal@structureclerk.ca</a></p>
                <p className="text-gray-700"><strong>Support :</strong> <a href="mailto:support@structureclerk.ca" className="text-blue-600 hover:text-blue-800">support@structureclerk.ca</a></p>
                <p className="text-gray-700"><strong>Adresse :</strong> Québec, Canada</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}