'use client'

import React from 'react'
import { Upload, FileText, Sparkles, ArrowRight, CheckCircle, Users, Target, Zap } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-documents' | 'no-projects' | 'no-actions' | 'getting-started'
  userName?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

export default function EmptyState({
  type,
  userName = 'entrepreneur',
  onPrimaryAction,
  onSecondaryAction
}: EmptyStateProps) {
  const states = {
    'no-documents': {
      icon: <Upload className="w-16 h-16 text-gray-400" />,
      title: 'Commence à économiser du temps',
      subtitle: 'Upload ton premier document pour voir la magie opérer',
      description: 'Factures, soumissions, contrats - notre IA analyse tout',
      primaryAction: 'Prendre une photo maintenant',
      secondaryAction: 'Choisir un fichier',
      stats: [
        { label: 'Temps moyen économisé par document', value: '15 min' },
        { label: 'Précision moyenne', value: '94%' },
        { label: 'Entrepreneurs actifs', value: '127+' }
      ]
    },
    'no-projects': {
      icon: <FileText className="w-16 h-16 text-gray-400" />,
      title: 'Organise ton travail efficacement',
      subtitle: 'Crée ton premier projet pour structurer tes documents',
      description: 'Regroupe tes factures, soumissions et heures par projet',
      primaryAction: 'Créer un projet',
      secondaryAction: undefined,
      stats: [
        { label: 'Projets créés ce mois', value: '1,247' },
        { label: 'Documents organisés', value: '15.8K' },
        { label: 'Gain de visibilité', value: '+85%' }
      ]
    },
    'no-actions': {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Tout est en ordre !',
      subtitle: 'Aucune action critique détectée. Ton business tourne bien.',
      description: 'Continue comme ça, ou explore nos fonctionnalités avancées',
      primaryAction: 'Voir l\'historique',
      secondaryAction: 'Explorer les fonctionnalités',
      stats: [
        { label: 'Actions résolues cette semaine', value: '23' },
        { label: 'Temps économisé', value: '4h 32min' },
        { label: 'Satisfaction', value: '4.8/5' }
      ]
    },
    'getting-started': {
      icon: <Sparkles className="w-16 h-16 text-blue-500" />,
      title: 'Bienvenue dans StructureClerk !',
      subtitle: `Prêt à transformer ta gestion, ${userName} ?`,
      description: 'Suivez notre guide rapide de 2 minutes pour commencer',
      primaryAction: 'Commencer le setup rapide',
      secondaryAction: 'Regarder la vidéo de 30 sec',
      stats: [
        { label: 'Configuration moyenne', value: '2 min' },
        { label: 'Première valeur en', value: '5 min' },
        { label: 'Support disponible', value: '24/7' }
      ]
    }
  }

  const state = states[type]

  return (
    <div className="text-center py-12">
      {/* Icône principal */}
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-gray-100 rounded-full">
          {state.icon}
        </div>
      </div>

      {/* Titre et sous-titre */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {state.title}
      </h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        {state.subtitle}
      </p>

      {/* Description */}
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">
        {state.description}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          onClick={onPrimaryAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          {state.primaryAction}
          <ArrowRight className="w-4 h-4" />
        </button>

        {state.secondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            {state.secondaryAction}
          </button>
        )}
      </div>

      {/* Stats Social Proof */}
      <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {state.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-blue-900">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-blue-100">
          <div className="flex items-center justify-center gap-8 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>127 entrepreneurs utilisent StructureClerk</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span>+23 cette semaine</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>94% précision IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Target className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              💡 Conseil pro
            </p>
            <p className="text-xs text-yellow-700">
              Commence par les documents que tu traites le plus souvent. L\'IA apprendra tes schémas et deviendra plus précise avec le temps.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}