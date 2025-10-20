import Link from 'next/link'

export const metadata = {
  title: 'Conditions d\'utilisation - StructureClerk | TechVibes',
  description: 'Conditions d\'utilisation de la plateforme StructureClerk par TechVibes',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-brand-orange hover:underline mb-4 inline-block">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-brand-navy mb-4">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              En accédant et en utilisant StructureClerk (le &quot;Service&quot;), vous acceptez d&apos;être lié par les présentes conditions d&apos;utilisation.
              Le Service est fourni par <strong>TechVibes</strong> (&quot;nous&quot;, &quot;notre&quot; ou &quot;nos&quot;), une entreprise enregistrée au Québec, Canada.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Description du service</h2>
            <p className="text-gray-700 leading-relaxed">
              StructureClerk est une plateforme de gestion administrative conçue pour les entrepreneurs en construction au Québec.
              Le Service comprend, sans s&apos;y limiter:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2 ml-4">
              <li>Gestion de clients, projets et factures</li>
              <li>Extraction et analyse de documents par intelligence artificielle</li>
              <li>Génération automatique de documents conformes aux normes québécoises</li>
              <li>Calcul automatique des taxes TPS/TVQ</li>
              <li>Stockage sécurisé de documents</li>
              <li>Assistant conversationnel IA</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">3. Compte utilisateur</h2>
            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.1 Création de compte</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pour utiliser le Service, vous devez créer un compte en fournissant des informations exactes et complètes.
              Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.2 Période d&apos;essai</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous offrons une période d&apos;essai gratuite de 30 jours. Aucune carte de crédit n&apos;est requise pendant cette période.
              À la fin de la période d&apos;essai, vous devrez souscrire à un plan payant pour continuer à utiliser le Service.
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.3 Résiliation</h3>
            <p className="text-gray-700 leading-relaxed">
              Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre compte.
              Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation de ces conditions.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Abonnements et paiements</h2>
            <h3 className="text-xl font-semibold text-brand-navy mb-2">4.1 Plans tarifaires</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les prix de nos plans d&apos;abonnement sont affichés en dollars canadiens (CAD) et incluent les taxes applicables.
              Les prix peuvent être modifiés avec un préavis de 30 jours.
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">4.2 Facturation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les abonnements sont facturés mensuellement ou annuellement selon le plan choisi.
              Le paiement est traité par notre partenaire de paiement sécurisé Stripe.
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">4.3 Remboursements</h3>
            <p className="text-gray-700 leading-relaxed">
              Les paiements ne sont généralement pas remboursables, sauf exigence légale.
              Vous pouvez annuler votre abonnement à tout moment, mais aucun remboursement ne sera effectué pour la période en cours.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Utilisation acceptable</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Vous vous engagez à ne pas:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Utiliser le Service à des fins illégales ou non autorisées</li>
              <li>Violer les lois applicables dans votre juridiction</li>
              <li>Transmettre des virus ou du code malveillant</li>
              <li>Tenter d&apos;accéder à des systèmes non autorisés</li>
              <li>Partager votre compte avec des tiers non autorisés</li>
              <li>Copier, modifier ou distribuer le contenu du Service sans autorisation</li>
              <li>Utiliser le Service pour spammer ou harceler d&apos;autres utilisateurs</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le Service et son contenu original, ses fonctionnalités et sa fonctionnalité sont et resteront la propriété exclusive de TechVibes et de ses concédants de licence.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vous conservez tous les droits sur les données que vous téléchargez sur le Service.
              En utilisant le Service, vous nous accordez une licence limitée pour utiliser vos données uniquement dans le but de fournir le Service.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Protection des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous engageons à protéger vos données personnelles conformément à notre{' '}
              <Link href="/legal/privacy" className="text-brand-orange hover:underline">
                Politique de confidentialité
              </Link>{' '}
              et aux lois applicables, notamment la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) au Canada.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Intelligence artificielle</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre Service utilise l&apos;intelligence artificielle pour analyser et traiter vos documents.
              Nous utilisons des fournisseurs tiers (Anthropic Claude) pour ces fonctionnalités.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> Bien que notre IA soit hautement performante, elle peut occasionnellement produire des erreurs.
              Vous devez toujours vérifier les informations extraites ou générées avant de les utiliser dans un contexte professionnel ou légal.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Limitation de responsabilité</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le Service est fourni &quot;tel quel&quot; sans garantie d&apos;aucune sorte.
              TechVibes ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de votre utilisation du Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notre responsabilité totale ne dépassera pas le montant que vous avez payé pour le Service au cours des 12 derniers mois.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">10. Modifications des conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Nous vous informerons des modifications importantes par email ou via le Service.
              Votre utilisation continue du Service après ces modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Loi applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Ces conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables.
              Tout litige sera soumis à la juridiction exclusive des tribunaux du Québec.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">12. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant ces conditions d&apos;utilisation, veuillez nous contacter:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>TechVibes</strong></p>
              <p className="text-gray-700">Email: <a href="mailto:info@structureclerk.ca" className="text-brand-orange hover:underline">info@structureclerk.ca</a></p>
              <p className="text-gray-700">Site web: <a href="https://structureclerk.ca" className="text-brand-orange hover:underline">https://structureclerk.ca</a></p>
            </div>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-8 text-center">
          <Link href="/legal/privacy" className="text-brand-orange hover:underline">
            Politique de confidentialité
          </Link>
          {' '} | {' '}
          <Link href="/" className="text-brand-orange hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
