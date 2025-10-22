'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  FileSpreadsheet,
  Clock,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

interface ExtractedData {
  project_name: string | null
  client_name: string | null
  client_address: string | null
  client_email: string | null
  client_phone: string | null
  description: string | null
  scope: string | null
  requirements: string | null
  estimated_duration: string | null
  estimated_start_date: string | null
  total_area: number | null
  line_items: Array<{
    description: string
    quantity: number
    unit: string
    unit_price: number
    amount: number
  }>
  confidence_score: number
  processing_time_ms: number
}

export default function QuoteGeneratePage() {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Type de fichier non supporté. Utilisez PDF, JPEG, PNG ou WEBP.');
      return;
    }

    // Validate file size (15 MB max for plans)
    const maxSize = 15 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('Fichier trop volumineux (max 15 MB).');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setExtractedData(null);
  };

  // Extract Quote Data
  const handleExtract = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setExtractedData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'quote'); // Specify quote extraction

      const res = await fetch('/api/quotes/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur extraction devis');
      }

      setExtractedData(data.extracted_data);
      setProcessingTime(data.processing_time_ms);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'extraction');
    } finally {
      setUploading(false);
    }
  };

  // Navigate to Quote Creation Page
  const handleCreateQuote = () => {
    if (!extractedData) return;
    
    // Store extracted data in sessionStorage for the next page
    sessionStorage.setItem('extractedQuoteData', JSON.stringify(extractedData));
    
    // Navigate to new quote page with extracted data
    router.push('/quotes/new?extracted=true');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Génération Devis Automatique</h1>
        <p className="mt-2 text-brand-gray">
          Transformez un plan PDF en devis professionnel complet en moins de 15 minutes
        </p>
      </div>

      {/* Benefits Banner */}
      <div className="bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 border border-brand-orange/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-orange/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-navy">IA Spécialisée Construction</h3>
              <p className="text-sm text-brand-gray">Notre IA reconnaît les symboles, mesures et spécificités des plans de construction</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span className="font-medium">15 minutes max</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-orange" />
              <span className="font-medium">95% précision</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-orange" />
              <span className="font-medium">10x plus rapide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      {!extractedData && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-brand-orange bg-orange-50'
              : 'border-gray-300 hover:border-brand-blue bg-gray-50'
          }`}
        >
          <FileSpreadsheet className="w-20 h-20 mx-auto mb-4 text-brand-blue" />

          {!file ? (
            <>
              <h3 className="text-xl font-semibold text-brand-navy mb-2">
                Glissez-déposez votre plan PDF ici
              </h3>
              <p className="text-brand-gray mb-4">
                Notre IA extraira automatiquement les mesures, matériaux et quantités
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
              <p className="text-sm text-gray-500 mt-4">
                Formats acceptés: PDF, JPEG, PNG, WEBP (max 15 MB)
              </p>
              
              {/* Supported Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-brand-navy mb-2">📏 Extraction Dimensions</h4>
                  <p className="text-sm text-gray-600">Reconnaissance automatique des mesures, surfaces et volumes</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-brand-navy mb-2">🧱 Identification Matériaux</h4>
                  <p className="text-sm text-gray-600">Détection des types de matériaux et finitions spécifiés</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-brand-navy mb-2">⏱️ Calcul Durées</h4>
                  <p className="text-sm text-gray-600">Estimation automatique des temps par type de travail</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <FileText className="w-20 h-20 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold text-brand-navy mb-2">{file.name}</h3>
              <p className="text-sm text-brand-gray mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Prêt pour l'analyse IA
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
                      Analyse IA en cours...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-5 h-5" />
                      Extraire et Générer Devis
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
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
                Confiance: {Math.round(extractedData.confidence_score * 100)}% • Temps:{' '}
                {processingTime ? (processingTime / 1000).toFixed(1) : '?'}s
              </p>
            </div>
          </div>

          {/* Extracted Data Preview */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-brand-navy mb-4">Données Extraites</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Info */}
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Informations Projet</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Nom du projet</dt>
                    <dd className="font-medium">
                      {extractedData.project_name || <span className="text-red-500">Non détecté</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Description</dt>
                    <dd className="font-medium">
                      {extractedData.description || <span className="text-gray-500">Non spécifiée</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Périmètre</dt>
                    <dd className="font-medium">
                      {extractedData.scope || <span className="text-gray-500">Non spécifié</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Surface totale</dt>
                    <dd className="font-medium">
                      {extractedData.total_area ? `${extractedData.total_area} m²` : <span className="text-red-500">Non détectée</span>}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Client Info */}
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Informations Client</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Nom du client</dt>
                    <dd className="font-medium">
                      {extractedData.client_name || <span className="text-red-500">Non détecté</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Adresse</dt>
                    <dd className="font-medium">
                      {extractedData.client_address || <span className="text-gray-500">Non spécifiée</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium">
                      {extractedData.client_email || <span className="text-gray-500">Non spécifié</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Téléphone</dt>
                    <dd className="font-medium">
                      {extractedData.client_phone || <span className="text-gray-500">Non spécifié</span>}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Calendrier Prévisionnel</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Durée estimée</dt>
                    <dd className="font-medium">
                      {extractedData.estimated_duration || <span className="text-gray-500">Non estimée</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date de début</dt>
                    <dd className="font-medium">
                      {extractedData.estimated_start_date || <span className="text-gray-500">Non spécifiée</span>}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Exigences Techniques</h4>
                <p className="text-sm text-gray-700">
                  {extractedData.requirements || <span className="text-gray-500">Aucune exigence spécifique détectée</span>}
                </p>
              </div>
            </div>

            {/* Line Items */}
            {extractedData.line_items && extractedData.line_items.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-brand-navy mb-3">Postes de Travail Extraits</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Qté</th>
                        <th className="px-4 py-2 text-right">Unité</th>
                        <th className="px-4 py-2 text-right">Prix unitaire</th>
                        <th className="px-4 py-2 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {extractedData.line_items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{item.unit}</td>
                          <td className="px-4 py-2 text-right">{item.unit_price.toFixed(2)} $</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {item.amount.toFixed(2)} $
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCreateQuote}
              className="flex-1 px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 font-semibold"
            >
              <FileText className="w-5 h-5" />
              Créer Devis avec Ces Données
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setFile(null);
                setExtractedData(null);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Recommencer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}