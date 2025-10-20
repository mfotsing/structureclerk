import Link from 'next/link'

export const metadata = {
  title: 'Politique de confidentialité - StructureClerk | TechVibes',
  description: 'Politique de confidentialité et protection des données personnelles de StructureClerk par TechVibes',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-brand-orange hover:underline mb-4 inline-block">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-brand-navy mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Chez <strong>TechVibes</strong> (&quot;nous&quot;, &quot;notre&quot; ou &quot;nos&quot;), nous prenons très au sérieux la protection de vos données personnelles.
              Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez StructureClerk (le &quot;Service&quot;).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nous nous conformons à toutes les lois applicables en matière de protection des données, notamment:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
              <li>Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) - Canada</li>
              <li>Loi sur la protection des renseignements personnels dans le secteur privé - Québec</li>
              <li>Règlement général sur la protection des données (RGPD) - UE (le cas échéant)</li>
            </ul>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Informations que nous collectons</h2>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">1.1 Informations que vous nous fournissez</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Informations de compte:</strong> Nom, prénom, adresse email, mot de passe (crypté)</li>
              <li><strong>Informations d&apos;organisation:</strong> Nom d&apos;entreprise, numéro TPS/TVQ, adresse professionnelle, téléphone</li>
              <li><strong>Informations de facturation:</strong> Traitées par notre partenaire Stripe (nous ne stockons pas vos informations bancaires)</li>
              <li><strong>Données professionnelles:</strong> Clients, projets, factures, devis, documents que vous téléchargez sur le Service</li>
              <li><strong>Communications:</strong> Emails et messages que vous nous envoyez</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">1.2 Informations collectées automatiquement</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Données de connexion:</strong> Adresse IP, type de navigateur, pages visitées, durée de visite</li>
              <li><strong>Cookies:</strong> Nous utilisons des cookies essentiels pour le fonctionnement du Service (voir section Cookies)</li>
              <li><strong>Données d&apos;utilisation:</strong> Fonctionnalités utilisées, fréquence d&apos;utilisation, erreurs rencontrées</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Comment nous utilisons vos informations</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Nous utilisons vos informations personnelles pour:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Fournir le Service:</strong> Créer votre compte, gérer vos abonnements, traiter vos paiements</li>
              <li><strong>Fonctionnalités IA:</strong> Analyser vos documents avec l&apos;intelligence artificielle, extraire des données, générer des documents</li>
              <li><strong>Support client:</strong> Répondre à vos questions, résoudre les problèmes techniques</li>
              <li><strong>Amélioration du Service:</strong> Analyser l&apos;utilisation pour améliorer les fonctionnalités</li>
              <li><strong>Communications:</strong> Vous envoyer des notifications importantes, mises à jour du Service, newsletters (avec votre consentement)</li>
              <li><strong>Sécurité:</strong> Détecter et prévenir la fraude, les abus et les activités illégales</li>
              <li><strong>Conformité légale:</strong> Respecter nos obligations légales et réglementaires</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">3. Partage de vos informations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants:
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.1 Fournisseurs de services</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              Nous travaillons avec des partenaires de confiance qui nous aident à fournir le Service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Supabase:</strong> Hébergement de la base de données et authentification (USA - conformité RGPD)</li>
              <li><strong>Vercel:</strong> Hébergement de l&apos;application web (USA - conformité RGPD)</li>
              <li><strong>Anthropic:</strong> Intelligence artificielle pour l&apos;analyse de documents (USA - conformité RGPD)</li>
              <li><strong>Stripe:</strong> Traitement des paiements (Irlande - conformité PCI-DSS)</li>
              <li><strong>Resend:</strong> Envoi d&apos;emails transactionnels (USA)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tous nos fournisseurs sont tenus par contrat de protéger vos données et de les utiliser uniquement pour les services qu&apos;ils nous fournissent.
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.2 Obligations légales</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous pouvons divulguer vos informations si la loi l&apos;exige ou en réponse à une demande légale valide (assignation, mandat, ordonnance judiciaire).
            </p>

            <h3 className="text-xl font-semibold text-brand-navy mb-2">3.3 Transfert d&apos;entreprise</h3>
            <p className="text-gray-700 leading-relaxed">
              En cas de fusion, acquisition ou vente d&apos;actifs, vos données pourraient être transférées. Nous vous informerons de tout changement de propriété.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Intelligence artificielle et traitement des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre Service utilise l&apos;intelligence artificielle (Anthropic Claude) pour analyser vos documents.
              Voici comment vos données sont traitées:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Traitement temporaire:</strong> Vos documents sont envoyés temporairement à l&apos;API Anthropic pour analyse</li>
              <li><strong>Pas de stockage tiers:</strong> Anthropic ne stocke pas vos données au-delà de 30 jours (politique de rétention)</li>
              <li><strong>Pas d&apos;entraînement:</strong> Vos données ne sont pas utilisées pour entraîner les modèles d&apos;IA</li>
              <li><strong>Cryptage en transit:</strong> Toutes les communications sont cryptées (TLS 1.3)</li>
              <li><strong>Conformité:</strong> Anthropic est conforme au RGPD et certifié SOC 2 Type II</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Sécurité des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Cryptage:</strong> Vos données sont cryptées en transit (HTTPS/TLS) et au repos (AES-256)</li>
              <li><strong>Authentification:</strong> Protection par mot de passe avec hachage bcrypt</li>
              <li><strong>Contrôle d&apos;accès:</strong> Système de permissions granulaires (Row Level Security)</li>
              <li><strong>Sauvegardes:</strong> Sauvegardes automatiques quotidiennes de toutes les données</li>
              <li><strong>Surveillance:</strong> Monitoring 24/7 des activités suspectes</li>
              <li><strong>Audits:</strong> Revues de sécurité régulières et tests de pénétration</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Conservation des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le Service et respecter nos obligations légales:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Compte actif:</strong> Pendant toute la durée de votre abonnement</li>
              <li><strong>Après résiliation:</strong> 30 jours (pour vous permettre de réactiver votre compte)</li>
              <li><strong>Données de facturation:</strong> 7 ans (obligation légale au Canada)</li>
              <li><strong>Logs de sécurité:</strong> 90 jours maximum</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Après ces périodes, vos données sont supprimées définitivement de nos systèmes.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Vos droits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément aux lois applicables, vous avez les droits suivants:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Droit d&apos;accès:</strong> Obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification:</strong> Corriger les données inexactes ou incomplètes</li>
              <li><strong>Droit à l&apos;effacement:</strong> Demander la suppression de vos données (&quot;droit à l&apos;oubli&quot;)</li>
              <li><strong>Droit à la portabilité:</strong> Recevoir vos données dans un format structuré et lisible (export JSON/CSV)</li>
              <li><strong>Droit d&apos;opposition:</strong> Vous opposer au traitement de vos données pour certaines finalités</li>
              <li><strong>Droit de restriction:</strong> Demander la limitation du traitement de vos données</li>
              <li><strong>Droit de retirer le consentement:</strong> Retirer votre consentement à tout moment</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:privacy@structureclerk.ca" className="text-brand-orange hover:underline">
                privacy@structureclerk.ca
              </a>
              {' '}ou via les paramètres de votre compte.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Cookies et technologies similaires</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous utilisons des cookies pour faire fonctionner le Service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Cookies essentiels:</strong> Nécessaires pour l&apos;authentification et la sécurité (impossible de les désactiver)</li>
              <li><strong>Cookies de session:</strong> Maintiennent votre session active pendant votre navigation</li>
              <li><strong>Cookies de préférences:</strong> Mémorisent vos choix (langue, thème, etc.)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nous n&apos;utilisons PAS de cookies publicitaires ou de tracking tiers.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Transferts internationaux de données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Certains de nos fournisseurs de services sont situés aux États-Unis ou dans d&apos;autres pays.
              Lorsque vos données sont transférées hors du Canada:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Nous nous assurons que des garanties appropriées sont en place (clauses contractuelles types)</li>
              <li>Nos fournisseurs sont conformes aux cadres de protection reconnus (Privacy Shield successors, RGPD)</li>
              <li>Vos données bénéficient du même niveau de protection qu&apos;au Canada</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">10. Protection des mineurs</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre Service n&apos;est pas destiné aux personnes de moins de 18 ans.
              Nous ne collectons pas sciemment d&apos;informations personnelles auprès de mineurs.
              Si vous êtes un parent ou tuteur et que vous pensez que votre enfant nous a fourni des données personnelles, contactez-nous immédiatement.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Modifications de cette politique</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous pouvons mettre à jour cette politique de confidentialité occasionnellement.
              Nous vous informerons de tout changement important par email ou via une notification dans le Service.
              La date de &quot;Dernière mise à jour&quot; en haut de cette page indique quand la politique a été modifiée pour la dernière fois.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">12. Plaintes et réclamations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si vous avez des préoccupations concernant notre traitement de vos données personnelles, contactez-nous d&apos;abord à{' '}
              <a href="mailto:privacy@structureclerk.ca" className="text-brand-orange hover:underline">
                privacy@structureclerk.ca
              </a>
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vous avez également le droit de déposer une plainte auprès de l&apos;autorité de protection des données compétente:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Commissariat à la protection de la vie privée du Canada</strong></p>
              <p className="text-gray-700">30, rue Victoria</p>
              <p className="text-gray-700">Gatineau, QC K1A 1H3</p>
              <p className="text-gray-700">Téléphone: 1-800-282-1376</p>
              <p className="text-gray-700">Site web:{' '}
                <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                  www.priv.gc.ca
                </a>
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">13. Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>TechVibes - Responsable de la protection des données</strong></p>
              <p className="text-gray-700">Email: <a href="mailto:privacy@structureclerk.ca" className="text-brand-orange hover:underline">privacy@structureclerk.ca</a></p>
              <p className="text-gray-700">Email général: <a href="mailto:info@structureclerk.ca" className="text-brand-orange hover:underline">info@structureclerk.ca</a></p>
              <p className="text-gray-700">Site web: <a href="https://structureclerk.ca" className="text-brand-orange hover:underline">https://structureclerk.ca</a></p>
            </div>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-8 text-center">
          <Link href="/legal/terms" className="text-brand-orange hover:underline">
            Conditions d&apos;utilisation
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
