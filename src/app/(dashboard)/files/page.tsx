'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Upload, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  Tag,
  Folder,
  File,
  Image,
  FileText as FileIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react'

interface DocumentFile {
  id: string
  name: string
  file_size: number
  mime_type: string
  category: string
  type_detecte: string
  ai_summary: string
  ai_metadata: any
  ai_confidence: number
  created_at: string
  file_path: string
  project_id?: string
  project_name?: string
}

interface ProcessingNotification {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
  timestamp: Date
}

export default function FilesPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDragOver, setIsDragOver] = useState(false)
  const [notifications, setNotifications] = useState<ProcessingNotification[]>([])
  const [recentlyUploaded, setRecentlyUploaded] = useState<DocumentFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const loadDocuments = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile?.organization_id) return

      const { data: docs } = await supabase
        .from('documents')
        .select('*, projects(name)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(10)

      setDocuments(docs || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return
    
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [notifications])

  const addNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const newNotification: ProcessingNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    setUploading(true)
    setProcessing(true)
    setUploadProgress(0)
    
    const uploadedFiles: DocumentFile[] = []
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        
        // Update progress for each file
        setUploadProgress(Math.round((i / files.length) * 100))
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erreur lors de l\'upload')
        }
        
        const result = await response.json()
        uploadedFiles.push(result.document)
      }
      
      setUploadProgress(100)
      
      // Show success notification
      addNotification(
        `${files.length} document${files.length > 1 ? 's' : ''} extrait${files.length > 1 ? 's' : ''}. Prêt pour l'affectation.`,
        'success'
      )
      
      // Add to recently uploaded
      setRecentlyUploaded(prev => [...uploadedFiles, ...prev].slice(0, 5))
      
      // Reload documents
      await loadDocuments()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      addNotification(error.message || 'Erreur lors de l\'upload du fichier', 'error')
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProcessing(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)

      if (error) throw error

      setDocuments(documents.filter(doc => doc.id !== docId))
      setSelectedFile(null)
    } catch (error: any) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression du document')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" aria-label="Icone d'image" />
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />
    return <FileIcon className="w-8 h-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.ai_summary && doc.ai_summary.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-fade-in ${
              notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
              'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Extraction Fichier IA</h1>
          <p className="text-ui-text-muted mt-1">Vitesse 10x : De document à information en temps réel</p>
        </div>
      </div>

      {/* Smart Drop Zone - Dominant Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card variant="default" padding="lg" className="h-full">
            <CardContent className="pt-6 h-full">
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 h-full flex flex-col justify-center ${
                  isDragOver 
                    ? 'border-brand-orange bg-brand-orange/5' 
                    : uploading || processing
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
              >
                {uploading || processing ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      {processing ? (
                        <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
                      ) : (
                        <Upload className="w-8 h-8 text-blue-500 animate-bounce" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-ui-text">
                      {processing ? 'Analyse IA en cours...' : 'Upload en cours...'}
                    </h3>
                    <p className="text-ui-text-muted">
                      {processing 
                        ? 'L\'IA extrait et analyse les données de vos documents' 
                        : `Progression : ${uploadProgress}%`
                      }
                    </p>
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-ui-text">
                      Glissez-Déposez vos documents
                    </h3>
                    <p className="text-lg text-ui-text-muted">
                      (Factures, Soumissions, Reçus). L(Factures, Soumissions, Reçus). L'IA fait le reste.rsquo;IA fait le reste.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        variant="primary" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Sélectionner des fichiers
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileInputChange}
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                        multiple
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-ui-text-muted">
                      Formats supportés : PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Uploaded */}
        <div className="space-y-4">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Extraits Récemment
              </CardTitle>
              <CardDescription>
                Documents traités par lDocuments traités par l'IArsquo;IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentlyUploaded.length === 0 ? (
                <div className="text-center py-4">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucun document récent</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentlyUploaded.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.mime_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-brand-orange/10 text-brand-orange rounded-full">
                            {doc.type_detecte}
                          </span>
                          {doc.project_name && (
                            <span className="text-xs text-gray-500">
                              → {doc.project_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                VDI (Vitesse Donnée-Information)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Temps moyen</span>
                  <span className="text-sm font-semibold text-green-600">{'<'} 3s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documents traités</span>
                  <span className="text-sm font-semibold">{documents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Précision IA</span>
                  <span className="text-sm font-semibold text-blue-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      {documents.length > 0 && (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Toutes les catégories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Grid */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredDocuments.length === 0 ? (
              <Card variant="default" padding="lg">
                <CardContent className="pt-6 text-center">
                  <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun document trouvé
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Essayez de modifier votre recherche ou vos filtres
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((doc) => (
                <Card 
                  key={doc.id} 
                  variant="default" 
                  padding="lg"
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedFile?.id === doc.id ? 'ring-2 ring-brand-orange' : ''
                  }`}
                  onClick={() => setSelectedFile(doc)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.mime_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(doc.created_at)}
                          </span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          {doc.type_detecte && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {doc.type_detecte}
                            </span>
                          )}
                        </div>
                        {doc.ai_summary && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {doc.ai_summary}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle download
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDocument(doc.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Document Details */}
          <div className="lg:col-span-1">
            {selectedFile ? (
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Détails du document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(selectedFile.mime_type)}
                      <div>
                        <h4 className="font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.file_size)}
                        </p>
                      </div>
                    </div>

                    {selectedFile.type_detecte && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Type détecté</label>
                        <p className="mt-1 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-sm inline-block">
                          {selectedFile.type_detecte}
                        </p>
                      </div>
                    )}

                    {selectedFile.project_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Projet suggéré</label>
                        <p className="mt-1 text-sm text-gray-600">{selectedFile.project_name}</p>
                      </div>
                    )}

                    {selectedFile.category && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Catégorie</label>
                        <p className="mt-1 text-sm text-gray-600">{selectedFile.category}</p>
                      </div>
                    )}

                    {selectedFile.ai_confidence && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confiance IA</label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-brand-orange h-2 rounded-full"
                              style={{ width: `${selectedFile.ai_confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.round(selectedFile.ai_confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedFile.ai_summary && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Résumé IA</label>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedFile.ai_summary}
                        </p>
                      </div>
                    )}

                    {selectedFile.ai_metadata && Object.keys(selectedFile.ai_metadata).length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Métadonnées extraites</label>
                        <div className="mt-1 space-y-2">
                          {Object.entries(selectedFile.ai_metadata).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium text-gray-700">{key}:</span>
                              <span className="ml-2 text-gray-600">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card variant="default" padding="lg">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez un document
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Cliquez sur un document pour voir ses détails
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}