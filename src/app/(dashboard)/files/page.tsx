'use client'

import { useState, useEffect, useRef } from 'react'
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
  FileText as FileIcon
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
}

export default function FilesPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
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
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      setDocuments(docs || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      // Reload documents
      await loadDocuments()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Erreur lors de l\'upload du fichier')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
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
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Fichiers</h1>
          <p className="text-ui-text-muted mt-1">GED intelligent - Gérez vos documents avec l'IA</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? `Upload ${uploadProgress}%` : 'Uploader un fichier'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload en cours...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-brand-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card variant="default" padding="lg">
              <CardContent className="pt-6 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'all' ? 'Aucun document trouvé' : 'Aucun document'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Essayez de modifier votre recherche ou vos filtres' 
                    : 'Commencez par uploader votre premier document'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <Button 
                    variant="primary" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                   Uploader un fichier
                  </Button>
                )}
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
    </div>
  )
}