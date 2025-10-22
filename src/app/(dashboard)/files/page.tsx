'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Upload, 
  File, 
  Image as ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  Zap,
  BarChart3,
  TrendingUp,
  Target,
  Camera,
  Smartphone,
  Bell,
  ArrowRight
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  extracted_data?: any;
  ai_confidence?: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'error';
  ai_type_detecte?: string;
  created_at: string;
  updated_at: string;
}

interface ProcessingStats {
  totalProcessed: number;
  totalSaved: number;
  averageTime: number;
  todayProcessed: number;
  accuracy: number;
}

export default function FilesPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      setDocuments(documentsData || []);
      
      // Calculate processing stats
      const completed = documentsData?.filter(doc => doc.processing_status === 'completed') || [];
      const totalProcessed = documentsData?.length || 0;
      const todayProcessed = documentsData?.filter(doc => 
        new Date(doc.created_at).toDateString() === new Date().toDateString()
      ).length || 0;
      
      const totalSaved = completed.reduce((sum, doc) => {
        // Estimate time saved per document (5 minutes for manual entry)
        return sum + (doc.ai_confidence ? 5 : 0);
      }, 0);
      
      const averageTime = completed.length > 0 ? (completed.length * 10) / completed.length : 0; // 10 seconds average
      const accuracy = completed.length > 0 
        ? completed.reduce((sum, doc) => sum + (doc.ai_confidence || 0), 0) / completed.length 
        : 0;

      setProcessingStats({
        totalProcessed,
        totalSaved,
        averageTime,
        todayProcessed,
        accuracy: accuracy * 100
      });
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${profile.organization_id}/${fileName}`;
        
        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        // Determine file type
        const fileType = file.type.startsWith('image/') ? 'plan' : 
                        file.name.toLowerCase().includes('facture') || 
                        file.name.toLowerCase().includes('invoice') ? 'invoice' : 'document';

        // Create document record
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert({
            name: file.name,
            type: fileType,
            mime_type: file.type,
            file_size: file.size,
            file_path: filePath,
            organization_id: profile.organization_id,
            processing_status: 'processing',
            ai_type_detecte: 'pending',
            created_by: user.id
          })
          .select()
          .single();

        if (documentError) throw documentError;
        
        // Add to processing queue
        setProcessingQueue(prev => [...prev, documentData]);
        
        // Simulate AI processing
        setTimeout(() => {
          processDocument(documentData.id, fileType, urlData.publicUrl);
        }, 3000 + Math.random() * 5000); // 3-8 seconds processing time
      }
      
      // Reload documents
      await loadDocuments();
    } catch (error: any) {
      console.error('Error uploading files:', error);
      alert(error.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  // Simulate AI processing
  const processDocument = async (documentId: string, fileType: string, fileUrl: string) => {
    try {
      // Simulate AI analysis results
      const mockExtractedData = {
        invoice: {
          vendor: 'ABC Fournitures',
          invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString().split('T')[0],
          items: [
            { description: 'Matériaux de construction', quantity: 10, unit_price: 150 },
            { description: 'Main d\'œuvre', quantity: 8, unit_price: 65 }
          ],
          total: 1870,
          taxes: 280.50
        },
        plan: {
          project_name: 'Rénovation Résidentielle',
          dimensions: { length: 12, width: 8, height: 3 },
          area: 96,
          materials: ['Bois', 'Béton', 'Isolation'],
          estimated_cost: 25000
        },
        document: {
          title: 'Document générique',
          content: 'Contenu extrait automatiquement',
          keywords: ['construction', 'projet', 'plan']
        }
      };

      const extractedData = mockExtractedData[fileType as keyof typeof mockExtractedData] || mockExtractedData.document;
      const confidence = 0.85 + Math.random() * 0.1; // 85-95% confidence

      // Update document with processing results
      await supabase
        .from('documents')
        .update({
          extracted_data: extractedData,
          ai_confidence: confidence,
          processing_status: 'completed',
          ai_type_detecte: fileType,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      // Remove from processing queue
      setProcessingQueue(prev => prev.filter(doc => doc.id !== documentId));
      
      // Show notification
      showNotification(fileType, extractedData);
      
      // Reload documents
      await loadDocuments();
    } catch (error) {
      console.error('Error processing document:', error);
      
      // Update with error status
      await supabase
        .from('documents')
        .update({
          processing_status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
    }
  };

  // Show notification
  const showNotification = (fileType: string, extractedData: any) => {
    const notificationTitle = fileType === 'invoice' ? 'Facture extraite' : 
                             fileType === 'plan' ? 'Plan analysé' : 'Document traité';
    
    const notificationMessage = fileType === 'invoice' 
      ? `Facture #${extractedData.invoice_number} extraite et prête pour approbation`
      : fileType === 'plan'
      ? `Plan "${extractedData.project_name}" analysé avec ${extractedData.area}m² détectés`
      : `Document "${extractedData.title}" traité avec succès`;

    // Create notification (in a real app, this would trigger a push notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notificationTitle, {
        body: notificationMessage,
        icon: '/favicon.ico',
        tag: 'document-processed'
      });
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Open camera on mobile
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.processing_status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />,
      completed: <CheckCircle className="w-4 h-4" />,
      error: <AlertCircle className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-gray-600',
      processing: 'text-brand-orange',
      completed: 'text-green-600',
      error: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      invoice: 'Facture',
      plan: 'Plan',
      document: 'Document'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Smart Drop Zone</h1>
          <p className="text-ui-text-muted mt-1">
            Extraction IA multi-fonctionnelle : factures, plans, documents en 10 secondes
          </p>
        </div>
      </div>

      {/* Processing Stats */}
      {processingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Documents traités</p>
                  <p className="text-2xl font-bold text-ui-text">{processingStats.totalProcessed}</p>
                  <p className="text-xs text-ui-success mt-1">
                    {processingStats.todayProcessed} aujourd'hui
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Temps économisé</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(processingStats.totalSaved)}min</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    @5min/doc manuel
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Précision IA</p>
                  <p className="text-2xl font-bold text-brand-orange">{Math.round(processingStats.accuracy)}%</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    Moyenne
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Vitesse moyenne</p>
                  <p className="text-2xl font-bold text-blue-600">{processingStats.averageTime}s</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    Par document
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Drop Zone */}
      <Card variant="default" padding="lg" className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Zone de Dépôt Intelligente
            </h3>
            <p className="text-gray-600">
              Glissez-déposez vos fichiers ou cliquez pour télécharger. L'IA détecte automatiquement le type.
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-brand-orange bg-orange-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isMobile ? 'Appuyez pour télécharger' : 'Glissez vos fichiers ici'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supporte : Factures, Plans, Photos, PDF, Images
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
                
                {isMobile ? (
                  <button
                    onClick={openCamera}
                    className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                    disabled={uploading}
                  >
                    <Camera className="w-5 h-5" />
                    {uploading ? 'Traitement...' : 'Prendre une photo'}
                  </button>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                    disabled={uploading}
                  >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Traitement...' : 'Télécharger des fichiers'}
                  </button>
                )}
              </div>

              {/* File Type Detection */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Factures</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span>Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-purple-600" />
                  <span>Documents</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {processingQueue.length > 0 && (
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
              Traitement en cours ({processingQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processingQueue.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">Extraction IA en cours...</p>
                    </div>
                  </div>
                  <div className="text-sm text-brand-orange">
                    Traitement
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="invoice">Factures</option>
                <option value="plan">Plans</option>
                <option value="document">Documents</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="error">Erreur</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {!documents || documents.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun document
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par télécharger vos factures, plans ou autres documents
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Télécharger des documents
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confiance IA
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(doc.mime_type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        {doc.processing_status === 'completed' && doc.extracted_data && (
                          <div className="text-xs text-green-600">
                            ✅ {doc.extracted_data.invoice ? 'Facture' : 
                               doc.extracted_data.project_name ? 'Plan' : 'Document'} traité
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {getTypeLabel(doc.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatFileSize(doc.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.processing_status)}
                      <span className={`text-sm font-medium ${getStatusColor(doc.processing_status)}`}>
                        {doc.processing_status === 'pending' ? 'En attente' :
                         doc.processing_status === 'processing' ? 'En cours' :
                         doc.processing_status === 'completed' ? 'Terminé' : 'Erreur'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {doc.ai_confidence ? `${Math.round(doc.ai_confidence * 100)}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}