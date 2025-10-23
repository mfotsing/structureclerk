'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Cookie, Settings, Shield, Eye, Database, AlertCircle } from 'lucide-react'

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  })

  const handlePreferenceChange = (category: string, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const savePreferences = () => {
    // Simulation de la sauvegarde des préférences de cookies
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    alert('Préférences de cookies sauvegardées')
  }

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
            <Cookie className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Politique de Cookies</h1>
          <p className="text-xl text-blue-100">
            Comment nous utilisons les cookies pour améliorer votre expérience
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dernière mise à jour : 23 octobre 2024</h2>
              <p className="text-gray-600 leading-relaxed">
                StructureClerk utilise des cookies et technologies similaires pour améliorer votre expérience,
                analyser l\'utilisation de notre site et vous fournir du contenu personnalisé. Cette politique explique
                comment nous utilisons ces technologies et vos choix concernant les cookies.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Qu\'est-ce qu\'un cookie ?</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Un cookie est un petit fichier texte qui est sauvegardé sur votre appareil (ordinateur, tablette ou mobile)
                lorsque vous visitez notre site web. Les cookies nous permettent de :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Mémoriser vos préférences et paramètres</li>
                <li>Comprendre comment vous utilisez notre site</li>
                <li>Assurer la sécurité et prévenir les fraudes</li>
                <li>Vous fournir du contenu pertinent et personnalisé</li>
                <li>Améliorer nos services et fonctionnalités</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Types de cookies que nous utilisons</h2>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies essentiels</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Ces cookies sont nécessaires au fonctionnement de notre site web. Ils vous permettent de naviguer
                    sur notre site et d\'utiliser ses fonctionnalités essentielles.
                  </p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Toujours activés</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de performance et d\'analyse</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant
                    des informations anonymes sur le nombre de visiteurs, les pages visitées, le temps passé sur le site, etc.
                  </p>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Exemple : Google Analytics</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies fonctionnels</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Ces cookies permettent au site de se souvenir des choix que vous faites (comme votre nom d\'utilisateur,
                    la langue ou la région) et de fournir des fonctionnalités améliorées et plus personnelles.
                  </p>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600">Exemple : Préférences utilisateur</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies marketing</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Ces cookies sont utilisés pour diffuser des publicités pertinentes pour vous et vos intérêts.
                    Ils peuvent aussi être utilisés pour limiter le nombre de fois que vous voyez une publicité.
                  </p>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-600">Exemple : Facebook Pixel, Google Ads</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gérer vos préférences de cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Vous pouvez contrôler et gérer vos préférences de cookies de plusieurs manières :
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Personnaliser vos préférences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Cookies essentiels</div>
                      <div className="text-sm text-gray-600">Nécessaires au fonctionnement du site</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.essential}
                        disabled
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-500">Obligatoire</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Cookies d\'analyse</div>
                      <div className="text-sm text-gray-600">Nous aident à améliorer le site</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Cookies fonctionnels</div>
                      <div className="text-sm text-gray-600">Améliorent votre expérience</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.functional}
                        onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Cookies marketing</div>
                      <div className="text-sm text-gray-600">Publicités personnalisées</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={savePreferences}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Sauvegarder les préférences
                </button>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies tiers</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous utilisons des services tiers qui peuvent placer des cookies sur votre appareil. Voici les principaux services que nous utilisons :
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de cookies</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Google Analytics</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Analyse</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 ans</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Stripe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Essentiel</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Supabase</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Essentiel</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 jours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Durée de conservation des cookies</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Cookies de session :</strong> Supprimés lorsque vous fermez votre navigateur</li>
                <li><strong>Cookies persistants :</strong> Conservés sur votre appareil pendant une période définie (généralement de 30 jours à 2 ans)</li>
                <li><strong>Cookies essentiels :</strong> Conservés jusqu\'à la fin de votre session</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits et choix</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous avez le contrôle sur les cookies que vous acceptez :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Accepter ou refuser :</strong> Via notre bannière de cookies ou cette page</li>
                <li><strong>Paramètres du navigateur :</strong> Configurer votre navigateur pour bloquer ou supprimer les cookies</li>
                <li><strong>Extensions :</strong> Utiliser des extensions de navigateur pour gérer les cookies</li>
                <li><strong>Préférences publicitaires :</strong> Gérer les publicités personnalisées via les plateformes d\'opt-out</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Notez que le blocage de certains cookies peut affecter les fonctionnalités de notre site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mises à jour de cette politique</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous pouvons mettre à jour cette politique de cookies périodiquement pour refléter les changements
                dans nos pratiques ou pour des raisons opérationnelles, légales ou réglementaires.
                La date de la dernière mise à jour est indiquée en haut de cette page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant notre utilisation des cookies ou cette politique, contactez-nous :
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>Email :</strong> <a href="mailto:privacy@structureclerk.ca" className="text-blue-600 hover:text-blue-800">privacy@structureclerk.ca</a></p>
                <p className="text-gray-700"><strong>Support :</strong> <a href="mailto:support@structureclerk.ca" className="text-blue-600 hover:text-blue-800">support@structureclerk.ca</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}