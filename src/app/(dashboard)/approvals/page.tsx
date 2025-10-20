'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, FileText, DollarSign, FolderOpen, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react'

interface ApprovalStep {
  id: string
  workflow_id: string
  approver_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  workflow: {
    id: string
    name: string
    description: string | null
    resource_type: 'invoice' | 'quote' | 'project' | 'document' | 'expense'
    resource_id: string
    status: string
    required_approvers: number
    created_at: string
    creator: {
      email: string
      full_name: string | null
    }
  }
}

const RESOURCE_ICONS = {
  invoice: DollarSign,
  quote: FileText,
  project: FolderOpen,
  document: FileSpreadsheet,
  expense: DollarSign,
}

const RESOURCE_LABELS = {
  invoice: 'Facture',
  quote: 'Soumission',
  project: 'Projet',
  document: 'Document',
  expense: 'Dépense',
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentApproval, setCurrentApproval] = useState<ApprovalStep | null>(null)
  const [comment, setComment] = useState('')
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/approvals')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setApprovals(data.approvals || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (approval: ApprovalStep) => {
    setCurrentApproval(approval)
    setActionType('approve')
    setComment('')
    setShowCommentModal(true)
  }

  const handleReject = (approval: ApprovalStep) => {
    setCurrentApproval(approval)
    setActionType('reject')
    setComment('')
    setShowCommentModal(true)
  }

  const submitDecision = async () => {
    if (!currentApproval) return

    if (actionType === 'reject' && !comment.trim()) {
      alert('Un commentaire est requis pour rejeter')
      return
    }

    try {
      setProcessingId(currentApproval.id)

      const endpoint = actionType === 'approve' ? 'approve' : 'reject'
      const response = await fetch(`/api/approvals/${currentApproval.id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: comment }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement')
      }

      // Remove from list
      setApprovals(prev => prev.filter(a => a.id !== currentApproval.id))
      setShowCommentModal(false)
      setCurrentApproval(null)
      setComment('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-orange animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des approbations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Erreur</h3>
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadApprovals}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy mb-2">
            Approbations en Attente
          </h1>
          <p className="text-gray-600">
            {approvals.length} {approvals.length === 1 ? 'approbation' : 'approbations'} en attente de votre décision
          </p>
        </div>
        {approvals.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Action requise</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {approvals.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune approbation en attente
          </h3>
          <p className="text-gray-600">
            Vous n&apos;avez aucune demande d&apos;approbation en attente pour le moment.
          </p>
        </div>
      )}

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.map((approval) => {
          const Icon = RESOURCE_ICONS[approval.workflow.resource_type]
          const label = RESOURCE_LABELS[approval.workflow.resource_type]

          return (
            <div
              key={approval.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-orange transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy text-lg">
                        {approval.workflow.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {label} • Créé par {approval.workflow.creator?.full_name || approval.workflow.creator?.email}
                      </p>
                    </div>
                  </div>

                  {approval.workflow.description && (
                    <p className="text-gray-700 mb-4 pl-13">
                      {approval.workflow.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-600 pl-13">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(approval.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>
                        {approval.workflow.required_approvers} {approval.workflow.required_approvers === 1 ? 'approbateur requis' : 'approbateurs requis'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(approval)}
                    disabled={processingId === approval.id}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processingId === approval.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(approval)}
                    disabled={processingId === approval.id}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Comment Modal */}
      {showCommentModal && currentApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-brand-navy mb-4">
              {actionType === 'approve' ? '✅ Approuver' : '❌ Rejeter'} - {currentApproval.workflow.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire {actionType === 'reject' && <span className="text-red-600">*</span>}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                placeholder={actionType === 'approve'
                  ? 'Commentaire optionnel...'
                  : 'Expliquez pourquoi vous rejetez cette demande...'
                }
                required={actionType === 'reject'}
              />
              {actionType === 'reject' && (
                <p className="text-xs text-gray-500 mt-1">
                  Un commentaire est requis pour rejeter une demande
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false)
                  setCurrentApproval(null)
                  setComment('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={processingId !== null}
              >
                Annuler
              </button>
              <button
                onClick={submitDecision}
                disabled={processingId !== null || (actionType === 'reject' && !comment.trim())}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processingId !== null ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Traitement...
                  </span>
                ) : (
                  actionType === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
