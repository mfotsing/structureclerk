'use client'

import { useState } from 'react'
import { X, Star, Send, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from 'lucide-react'
import { useFeedback } from '@/contexts/FeedbackContext'

interface FeedbackSurveyProps {
  className?: string
}

export default function FeedbackSurvey({ className = "" }: FeedbackSurveyProps) {
  const { currentSurvey, showSurvey, responses, submitFeedback, dismissSurvey, setResponses } = useFeedback()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  if (!showSurvey || !currentSurvey) return null

  const currentQuestion = currentSurvey.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentSurvey.questions.length) * 100

  const handleResponse = (questionId: string, value: any) => {
    setResponses((prev: Record<string, any>) => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentSurvey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitFeedback(currentSurvey.id, responses)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = () => {
    dismissSurvey(currentSurvey.id)
  }

  const renderQuestion = (question: any) => {
    const currentValue = responses[question.id]

    switch (question.type) {
      case 'nps':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-gray-500">0</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleResponse(question.id, score)}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        currentValue === score
                          ? score <= 6
                            ? 'border-red-500 bg-red-500 text-white'
                            : score <= 8
                            ? 'border-yellow-500 bg-yellow-500 text-white'
                            : 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <span className="text-gray-500">10</span>
              </div>
              <div className="flex justify-around text-sm text-gray-600">
                <span className="text-red-500">Pas probable</span>
                <span className="text-yellow-500">Neutre</span>
                <span className="text-green-500">Très probable</span>
              </div>
            </div>
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[...Array(question.max)].map((_, i) => i + 1).map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleResponse(question.id, rating)}
                  className={`transition-all hover:scale-110 ${
                    currentValue >= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.min}</span>
              <span>{question.max}</span>
            </div>
          </div>
        )

      case 'text':
        return (
          <textarea
            value={currentValue || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder={question.label}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        )

      case 'multiple':
        return (
          <div className="space-y-3">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentValue === option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = !currentQuestion.required || responses[currentQuestion.id] !== undefined
  const isLastQuestion = currentQuestionIndex === currentSurvey.questions.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentSurvey.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {currentSurvey.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Question {currentQuestionIndex + 1} sur {currentSurvey.questions.length}
            </p>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.label}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {renderQuestion(currentQuestion)}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi...
                </>
              ) : (
                <>
                  {isLastQuestion ? (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer
                    </>
                  ) : (
                    'Suivant'
                  )}
                </>
              )}
            </button>
          </div>

          {!canProceed && currentQuestion.required && (
            <p className="text-xs text-red-500 text-center mt-2">
              Cette question est requise
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <button
              onClick={handleDismiss}
              className="hover:text-gray-700 transition-colors"
            >
              Peut-être plus tard
            </button>
            <span>•</span>
            <span>Vos réponses nous aident à nous améliorer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact feedback button for quick feedback
interface QuickFeedbackProps {
  feature: string
  type: 'thumbs' | 'rating' | 'nps'
  className?: string
}

export function QuickFeedback({ feature, type = 'thumbs', className = "" }: QuickFeedbackProps) {
  const { submitFeedback } = useFeedback()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const handleFeedback = async (rating: number) => {
    setIsSubmitting(true)
    try {
      await submitFeedback('quick_feedback', {
        feature,
        rating,
        type,
        timestamp: new Date().toISOString()
      })
      setShowThanks(true)
      setTimeout(() => setShowThanks(false), 3000)
    } catch (error) {
      console.error('Error submitting quick feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showThanks) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">Merci pour votre feedback !</span>
      </div>
    )
  }

  switch (type) {
    case 'thumbs':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span className="text-sm text-gray-600">C'était utile ?</span>
          <div className="flex gap-1">
            <button
              onClick={() => handleFeedback(1)}
              disabled={isSubmitting}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => handleFeedback(0)}
              disabled={isSubmitting}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )

    case 'rating':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span className="text-sm text-gray-600">Notez cette fonctionnalité :</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleFeedback(rating)}
                disabled={isSubmitting}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}