/**
 * Invoice Extraction Page
 * Drag-and-drop upload + AI extraction + review
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

interface ExtractedData {
  invoice_number: string | null
  invoice_date: string | null
  due_date: string | null
  vendor_name: string | null
  vendor_email: string | null
  vendor_phone: string | null
  customer_name: string | null
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
}

export default function InvoiceExtractionPage() {
  const router = useRouter()

  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [extractedInvoiceId, setExtractedInvoiceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processingTime, setProcessingTime] = useState<number | null>(null)

  // =========================================================================
  // Drag & Drop Handlers
  // =========================================================================
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Type de fichier non supporté. Utilisez PDF, JPEG, PNG ou WEBP.')
      return
    }

    // Validate file size (10 MB max)
    const maxSize = 10 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError('Fichier trop volumineux (max 10 MB).')
      return
    }

    setFile(selectedFile)
    setError(null)
    setExtractedData(null)
  }

  // =========================================================================
  // Upload & Extract
  // =========================================================================
  const handleExtract = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setExtractedData(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/invoices/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur extraction')
      }

      setExtractedData(data.extracted_data)
      setExtractedInvoiceId(data.extracted_invoice_id)
      setProcessingTime(data.processing_time_ms)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'extraction')
    } finally {
      setUploading(false)
    }
  }

  // =========================================================================
  // Navigate to Review Page
  // =========================================================================
  const handleReview = () => {
    if (extractedInvoiceId) {
      router.push(`/invoices/extract/${extractedInvoiceId}/review`)
    }
  }

  // =========================================================================
  // Auto-Create Invoice
  // =========================================================================
  const handleAutoCreate = async () => {
    if (!extractedInvoiceId) return

    try {
      const res = await fetch(`/api/invoices/extract/${extractedInvoiceId}/convert`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur création facture')
      }

      // Redirect to invoice edit page
      router.push(`/invoices/${data.invoice_id}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Extraction de Factures</h1>
        <p className="mt-2 text-brand-gray">
          Uploadez une facture PDF ou image et laissez l'IA extraire les données automatiquement
        </p>
      </div>

      {/* Upload Zone */}
      {!extractedData && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-brand-orange bg-orange-50'
              : 'border-gray-300 hover:border-brand-blue'
          }`}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-brand-blue" />

          {!file ? (
            <>
              <h3 className="text-lg font-semibold text-brand-navy mb-2">
                Glissez-déposez votre facture ici
              </h3>
              <p className="text-sm text-brand-gray mb-4">
                ou cliquez pour sélectionner un fichier
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-brand-orange text-white rounded-lg cursor-pointer hover:bg-orange-600 inline-block">
                  Choisir un fichier
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Formats acceptés: PDF, JPEG, PNG, WEBP (max 10 MB)
              </p>
            </>
          ) : (
            <>
              <FileText className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-brand-navy mb-2">{file.name}</h3>
              <p className="text-sm text-brand-gray mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleExtract}
                  disabled={uploading}
                  className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Extraction en cours...
                    </>
                  ) : (
                    <>
                      Extraire les données
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFile(null)
                    setError(null)
                  }}
                  disabled={uploading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Erreur</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Extraction Results */}
      {extractedData && (
        <div className="mt-8 space-y-6">
          {/* Success Banner */}
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              extractedData.confidence_score >= 0.85
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {extractedData.confidence_score >= 0.85 ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4
                className={`font-semibold ${
                  extractedData.confidence_score >= 0.85 ? 'text-green-900' : 'text-yellow-900'
                }`}
              >
                {extractedData.confidence_score >= 0.85
                  ? '✅ Extraction réussie avec haute confiance'
                  : '⚠️ Extraction réussie - Révision recommandée'}
              </h4>
              <p
                className={`text-sm ${
                  extractedData.confidence_score >= 0.85 ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                Confiance: {Math.round(extractedData.confidence_score * 100)}% | Temps:{' '}
                {processingTime ? (processingTime / 1000).toFixed(1) : '?'}s
              </p>
            </div>
          </div>

          {/* Extracted Data Preview */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-brand-navy mb-4">Données Extraites</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Informations Générales</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Numéro de facture</dt>
                    <dd className="font-medium">
                      {extractedData.invoice_number || <span className="text-red-500">Non détecté</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date d'émission</dt>
                    <dd className="font-medium">
                      {extractedData.invoice_date || <span className="text-red-500">Non détectée</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date d'échéance</dt>
                    <dd className="font-medium">
                      {extractedData.due_date || <span className="text-gray-500">N/A</span>}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Financial */}
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Montants</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Sous-total</dt>
                    <dd className="font-medium">
                      {extractedData.subtotal !== null
                        ? `${extractedData.subtotal.toFixed(2)} CAD`
                        : <span className="text-red-500">Non détecté</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">TPS (5%)</dt>
                    <dd className="font-medium">
                      {extractedData.tps_amount !== null
                        ? `${extractedData.tps_amount.toFixed(2)} CAD`
                        : <span className="text-gray-500">N/A</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">TVQ (9.975%)</dt>
                    <dd className="font-medium">
                      {extractedData.tvq_amount !== null
                        ? `${extractedData.tvq_amount.toFixed(2)} CAD`
                        : <span className="text-gray-500">N/A</span>}
                    </dd>
                  </div>
                  <div className="pt-2 border-t">
                    <dt className="text-gray-500 font-semibold">TOTAL</dt>
                    <dd className="font-bold text-lg text-brand-orange">
                      {extractedData.total !== null
                        ? `${extractedData.total.toFixed(2)} CAD`
                        : <span className="text-red-500">Non détecté</span>}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Vendor */}
              {extractedData.vendor_name && (
                <div>
                  <h4 className="font-semibold text-brand-navy mb-3">Fournisseur</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Nom</dt>
                      <dd className="font-medium">{extractedData.vendor_name}</dd>
                    </div>
                    {extractedData.vendor_email && (
                      <div>
                        <dt className="text-gray-500">Email</dt>
                        <dd className="font-medium">{extractedData.vendor_email}</dd>
                      </div>
                    )}
                    {extractedData.vendor_phone && (
                      <div>
                        <dt className="text-gray-500">Téléphone</dt>
                        <dd className="font-medium">{extractedData.vendor_phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Customer */}
              {extractedData.customer_name && (
                <div>
                  <h4 className="font-semibold text-brand-navy mb-3">Client</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Nom</dt>
                      <dd className="font-medium">{extractedData.customer_name}</dd>
                    </div>
                    {extractedData.customer_email && (
                      <div>
                        <dt className="text-gray-500">Email</dt>
                        <dd className="font-medium">{extractedData.customer_email}</dd>
                      </div>
                    )}
                    {extractedData.customer_phone && (
                      <div>
                        <dt className="text-gray-500">Téléphone</dt>
                        <dd className="font-medium">{extractedData.customer_phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>

            {/* Line Items */}
            {extractedData.line_items && extractedData.line_items.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-brand-navy mb-3">Items de la Facture</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Qté</th>
                        <th className="px-4 py-2 text-right">Prix unitaire</th>
                        <th className="px-4 py-2 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {extractedData.line_items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{item.unit_price.toFixed(2)} CAD</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {item.amount.toFixed(2)} CAD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            {extractedData.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-brand-navy mb-2">Notes</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedData.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReview}
              className="flex-1 px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2"
            >
              Réviser et Modifier
              <ArrowRight className="w-5 h-5" />
            </button>
            {extractedData.confidence_score >= 0.90 && (
              <button
                onClick={handleAutoCreate}
                className="flex-1 px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Créer Facture Automatiquement
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
