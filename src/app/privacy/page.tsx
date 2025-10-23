import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacyPage() {
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
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-xl text-blue-100">
            Notre engagement envers la protection de vos données personnelles
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dernière mise à jour : 23 octobre 2024</h2>
              <p className="text-gray-600 leading-relaxed">
                StructureClerk (« nous », « notre ») s\'engage à protéger la vie privée et la confidentialité des utilisateurs de nos services.
                Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles
                lorsque vous utilisez notre plateforme StructureClerk.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Informations que nous collectons</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Informations que vous nous fournissez</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Informations de compte :</strong> Nom, adresse email, numéro de téléphone, nom d\'entreprise</li>
                <li><strong>Informations de profil :</strong> Poste, taille d\'entreprise, préférences</li>
                <li><strong>Contenu et communications :</strong> Messages envoyés via notre formulaire de contact, feedback</li>
                <li><strong>Informations de paiement :</strong> Informations de carte de crédit traitées par nos processeurs de paiement sécurisés</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.2 Informations collectées automatiquement</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Données d\'utilisation :</strong> Pages visitées, temps passé, fonctionnalités utilisées</li>
                <li><strong>Informations techniques :</strong> Adresse IP, type de navigateur, système d\'exploitation</li>
                <li><strong>Cookies et données similaires :</strong> Pour améliorer votre expérience</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. Comment nous utilisons vos informations</h2>
              </div>

              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Pour fournir nos services :</strong> Traitement des documents, gestion des factures, génération de rapports</li>
                <li><strong>Pour améliorer nos services :</strong> Analyse de l\'utilisation, développement de nouvelles fonctionnalités</li>
                <li><strong>Pour la sécurité :</strong> Détection de fraudes, protection contre les accès non autorisés</li>
                <li><strong>Pour le support client :</strong> Répondre à vos questions et résoudre les problèmes</li>
                <li><strong>Pour la conformité légale :</strong> Respect des lois et réglementations applicables</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. Partage et divulgation</h2>
              </div>

              <p className="text-gray-600 mb-4">Nous ne vendons pas vos informations personnelles. Nous les partageons uniquement dans les cas suivants :</p>

              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Prestataires de services :</strong> Traitement des paiements, hébergement, analyse</li>
                <li><strong>Requêtes légales :</strong> Quand la loi nous y oblige ou pour protéger nos droits</li>
                <li><strong>Transferts d\'entreprise :</strong> En cas de fusion, acquisition ou vente</li>
                <li><strong>Avec votre consentement :</strong> Quand vous nous autorisez explicitement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sécurité des données</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Chiffrement de bout en bout (SSL/TLS)</li>
                <li>Serveurs hébergés au Canada</li>
                <li>Accès limité et authentifié aux données</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Audits de sécurité réguliers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos droits</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Conformément aux lois applicables (RGPD, CCPA), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Accès :</strong> Consulter vos données personnelles</li>
                <li><strong>Rectification :</strong> Corriger vos informations inexactes</li>
                <li><strong>Suppression :</strong> Demander la suppression de vos données</li>
                <li><strong>Portabilité :</strong> Transférer vos données vers un autre service</li>
                <li><strong>Opposition :</strong> Vous opposer à certains traitements</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@structureclerk.ca" className="text-blue-600 hover:text-blue-800">privacy@structureclerk.ca</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Conservation des données</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services,
                respecter nos obligations légales, résoudre les litiges et appliquer nos contrats.
                Les données sont automatiquement supprimées lorsqu\'elles ne sont plus nécessaires.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous utilisons des cookies pour améliorer votre expérience :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Cookies essentiels :</strong> Pour le fonctionnement de base du site</li>
                <li><strong>Cookies de performance :</strong> Pour analyser l\'utilisation et améliorer le site</li>
                <li><strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications de cette politique</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement.
                Nous vous informerons des modifications importantes par email ou via notre plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                contactez-nous :
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>Email :</strong> <a href="mailto:privacy@structureclerk.ca" className="text-blue-600 hover:text-blue-800">privacy@structureclerk.ca</a></p>
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