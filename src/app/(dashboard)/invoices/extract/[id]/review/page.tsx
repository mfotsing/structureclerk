/**
 * Invoice Extraction Review Page
 * Review and edit extracted invoice data before creating actual invoice
 */

'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react'

interface ExtractedInvoice {
  id: string
  invoice_number: string | null
  invoice_date: string | null
  due_date: string | null
  vendor_name: string | null
  vendor_email: string | null
  vendor_phone: string | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  subtotal: number | null
  tps_amount: number | null
  tvq_amount: number | null
  total: number | null
  line_items: Array<{
    description: string
    quantity: number
    unit_price: number
    amount: number
  }>
  payment_terms: string | null
  notes: string | null
  confidence_score: number
  needs_review: boolean
  client_id: string | null
  project_id: string | null
}

export default function InvoiceReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [extractedInvoice, setExtractedInvoice] = useState<ExtractedInvoice | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Editable fields
  const [formData, setFormData] = useState<Partial<ExtractedInvoice>>({})

  // =========================================================================
  // Fetch Extracted Invoice
  // =========================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/invoices/extract/${resolvedParams.id}`)
        if (!res.ok) throw new Error('Extraction introuvable')

        const data = await res.json()
        setExtractedInvoice(data.extracted_invoice)
        setFormData(data.extracted_invoice)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id])

  // =========================================================================
  // Update Field
  // =========================================================================
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // =========================================================================
  // Save Changes
  // =========================================================================
  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/invoices/extract/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Erreur sauvegarde')

      const data = await res.json()
      setExtractedInvoice(data.extracted_invoice)
      alert('✅ Modifications sauvegardées')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // =========================================================================
  // Convert to Invoice
  // =========================================================================
  const handleConvert = async () => {
    try {
      const res = await fetch(`/api/invoices/extract/${resolvedParams.id}/convert`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Erreur conversion')

      const data = await res.json()
      router.push(`/invoices/${data.invoice_id}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // =========================================================================
  // RENDER
  // =========================================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    )
  }

  if (error || !extractedInvoice) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Erreur</h3>
            <p className="text-sm text-red-700">{error || 'Extraction introuvable'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Révision Facture Extraite</h1>
          <p className="mt-2 text-brand-gray">
            Vérifiez et modifiez les données avant de créer la facture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              extractedInvoice.confidence_score >= 0.85
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            Confiance: {Math.round(extractedInvoice.confidence_score * 100)}%
          </span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Informations Générales</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de facture
              </label>
              <input
                type="text"
                value={formData.invoice_number || ''}
                onChange={e => updateField('invoice_number', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="INV-20250101-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d&apos;émission
              </label>
              <input
                type="date"
                value={formData.invoice_date || ''}
                onChange={e => updateField('invoice_date', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d&apos;échéance
              </label>
              <input
                type="date"
                value={formData.due_date || ''}
                onChange={e => updateField('due_date', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Vendor Info */}
        <div>
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Fournisseur</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.vendor_name || ''}
                onChange={e => updateField('vendor_name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.vendor_email || ''}
                onChange={e => updateField('vendor_email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.vendor_phone || ''}
                onChange={e => updateField('vendor_phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Client</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.customer_name || ''}
                onChange={e => updateField('customer_name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.customer_email || ''}
                onChange={e => updateField('customer_email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.customer_phone || ''}
                onChange={e => updateField('customer_phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div>
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Montants</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-total</label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal || ''}
                onChange={e => updateField('subtotal', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TPS (5%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.tps_amount || ''}
                onChange={e => updateField('tps_amount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TVQ (9.975%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.tvq_amount || ''}
                onChange={e => updateField('tvq_amount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
              <input
                type="number"
                step="0.01"
                value={formData.total || ''}
                onChange={e => updateField('total', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange font-bold"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={e => updateField('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            placeholder="Notes additionnelles..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Sauvegarder Modifications
            </>
          )}
        </button>
        <button
          onClick={handleConvert}
          className="flex-1 px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Créer Facture
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Annuler
        </button>
      </div>
    </div>
  )
}
