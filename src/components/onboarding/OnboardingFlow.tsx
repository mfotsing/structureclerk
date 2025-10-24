'use client'

import React, { useState, useEffect } from 'react'
import { X, Check, Upload, FileText, Users, Camera, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
  primaryAction: string
  secondaryAction?: string
  completed: boolean
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'upload',
      title: 'Upload ton premier document',
      description: 'Facture, soumission ou contrat - notre IA analyse tout',
      icon: <Upload className="w-5 h-5" />,
      action: 'upload',
      primaryAction: 'Prendre une photo',
      secondaryAction: 'Choisir un fichier',
      completed: false
    },
    {
      id: 'project',
      title: 'Crée ton premier projet',
      description: 'Organise tes documents par projet pour une vue d\'ensemble claire',
      icon: <FileText className="w-5 h-5" />,
      action: 'project',
      primaryAction: 'Créer un projet',
      secondaryAction: undefined,
      completed: false
    },
    {
      id: 'team',
      title: 'Invite un membre (optionnel)',
      description: 'Collaborez facilement avec ton équipe',
      icon: <Users className="w-5 h-5" />,
      action: 'team',
      primaryAction: 'Inviter un membre',
      secondaryAction: 'Passer cette étape',
      completed: false
    }
  ])
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Récupérer le nom de l'utilisateur depuis localStorage ou API
    const storedName = localStorage.getItem('user_name') || ''
    setUserName(storedName || 'entrepreneur')

    // Vérifier si l'onboarding est nécessaire
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
    const hasDocuments = localStorage.getItem('has_uploaded_documents')
    const hasProjects = localStorage.getItem('has_created_projects')

    // Afficher l'onboarding si jamais complété OU si l'utilisateur n'a aucune activité
    if (!hasCompletedOnboarding && (!hasDocuments && !hasProjects)) {
      // Petit délai pour laisser la page se charger
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const updateStepProgress = (stepId: string, completed: boolean) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, completed } : step
    ))
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsVisible(false)
  }

  const handlePrimaryAction = () => {
    const step = steps[currentStep]

    switch (step.action) {
      case 'upload':
        // Rediriger vers dashboard avec mode upload actif
        router.push('/dashboard?mode=upload&onboarding=true')
        break
      case 'project':
        router.push('/projects/new?onboarding=true')
        break
      case 'team':
        router.push('/dashboard?mode=invite&onboarding=true')
        break
    }

    // Marquer l'étape comme complétée
    updateStepProgress(step.id, true)

    // Passer à l'étape suivante ou terminer
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem('onboarding_completed', 'true')
      setIsVisible(false)
    }
  }

  const handleSecondaryAction = () => {
    const step = steps[currentStep]

    if (step.action === 'upload' && step.secondaryAction) {
      // Alternative : upload de fichier
      router.push('/dashboard?mode=upload_file&onboarding=true')
    } else if (step.action === 'team') {
      // Passer l'étape d'équipe
      updateStepProgress(step.id, true)
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        localStorage.setItem('onboarding_completed', 'true')
        setIsVisible(false)
      }
    }
  }

  const completedSteps = steps.filter(step => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue dans StructureClerk, {userName} ! 👋
            </h2>
            <p className="text-gray-600 text-sm">
              Pour commencer à économiser du temps, complète ces {steps.length} actions (2 min) :
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progressPercentage)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${
                steps[currentStep].completed
                  ? 'bg-green-100'
                  : 'bg-blue-100'
              }`}>
                {steps[currentStep].completed ? (
                  <Check className="w-8 h-8 text-green-600" />
                ) : (
                  steps[currentStep].icon
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600 mb-6">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Checklist Overview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 ${
                    index === currentStep ? 'font-semibold' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-500 border-green-500'
                      : index === currentStep
                        ? 'border-blue-500'
                        : 'border-gray-300'
                  }`}>
                    {step.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm ${
                    step.completed
                      ? 'text-green-700 line-through'
                      : index === currentStep
                        ? 'text-blue-700'
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handlePrimaryAction}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {steps[currentStep].primaryAction}
              <ArrowRight className="w-4 h-4" />
            </button>

            {steps[currentStep].secondaryAction && (
              <button
                onClick={handleSecondaryAction}
                className="w-full px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
              >
                {steps[currentStep].secondaryAction}
              </button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center pt-4">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              Je ferai ça plus tard
            </button>
          </div>
        </div>

        {/* Footer Trust Signals */}
        <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Chiffrement AES-256</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Données au Canada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Essai 30 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}