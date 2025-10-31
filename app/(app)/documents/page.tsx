'use client'

import { useState, useEffect } from 'react'
import UploadCard from '@/components/documents/UploadCard'
import AIExtractPanel from '@/components/documents/AIExtractPanel'
import AutoAssignModal from '@/components/documents/AutoAssignModal'

interface Document {
  id: string;
  title: string;
  type: 'contract' | 'invoice' | 'report' | 'receipt' | 'bank_statement' | 'tax_file' | 'identity' | 'handwritten' | 'general';
  size: number;
  uploadDate: Date;
  processed: boolean;
  extractedData?: {
    documentType: string;
    confidence: number;
    keyFields: {
      vendor?: string;
      client?: string;
      amount?: number;
      invoiceNumber?: string;
      date?: Date;
      dueDate?: Date;
      [key: string]: any;
    };
    extractedText?: string;
    suggestions?: string[];
    actionItems?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      priority: string;
      action: string;
    }>;
  };
  tags: string[];
  client?: string;
  project?: string;
  folder?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadCard, setShowUploadCard] = useState(false)
  const [processingFiles, setProcessingFiles] = useState<Array<{
    file: File;
    extractedData: any;
    isProcessing: boolean;
  }>>([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedFileForAssign, setSelectedFileForAssign] = useState<File | null>(null)
  const [selectedExtractedData, setSelectedExtractedData] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    pending: 0,
    contracts: 0,
    invoices: 0,
    receipts: 0,
    thisMonth: 0
  })

  // Fetch documents data
  useEffect(() => {
    const fetchDocumentsData = async () => {
      try {
        // Simulate API calls
        setStats({
          total: 1247,
          processed: 1198,
          pending: 49,
          contracts: 342,
          invoices: 156,
          receipts: 289,
          thisMonth: 47
        })

        setDocuments([
          {
            id: '1',
            title: 'Service Agreement - TechCorp LLC',
            type: 'contract',
            size: 2.4,
            uploadDate: new Date('2024-01-15T10:30:00'),
            processed: true,
            extractedData: {
              documentType: 'contract',
              confidence: 92,
              keyFields: {
                client: 'TechCorp LLC',
                vendor: 'StructureClerk Inc',
                value: 125000,
                endDate: new Date('2025-01-15')
              }
            },
            tags: ['contract', 'techcorp', 'active']
          },
          {
            id: '2',
            title: 'Invoice #2024-001 - ABC Consulting',
            type: 'invoice',
            size: 0.8,
            uploadDate: new Date('2024-01-14T14:20:00'),
            processed: true,
            extractedData: {
              documentType: 'invoice',
              confidence: 95,
              keyFields: {
                amount: 15750,
                dueDate: new Date('2024-02-14'),
                status: 'paid'
              }
            },
            tags: ['invoice', 'consulting', 'paid']
          },
          {
            id: '3',
            title: 'Quarterly Report Q4 2023',
            type: 'report',
            size: 4.2,
            uploadDate: new Date('2024-01-13T09:15:00'),
            processed: true,
            tags: ['report', 'quarterly', '2023']
          },
          {
            id: '4',
            title: 'NDA Discussion - StartupXYZ',
            type: 'contract',
            size: 1.1,
            uploadDate: new Date('2024-01-12T16:45:00'),
            processed: false,
            tags: ['nda', 'startupxyz', 'review']
          }
        ])
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentsData()
  }, [])

  // Handle file upload with AI processing
  const handleFileUpload = async (files: File[]) => {
    setShowUploadCard(false)
    setIsUploading(true)

    // Add files to processing queue
    const newProcessingFiles = files.map(file => ({
      file,
      extractedData: null,
      isProcessing: true
    }))

    setProcessingFiles(prev => [...prev, ...newProcessingFiles])

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      // Call AI processing API
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to process files')
      }

      const result = await response.json()

      // Update processing files with extracted data
      setProcessingFiles(prev =>
        prev.map(pf => {
          const processedFile = result.results.find((r: any) => r.fileName === pf.file.name)
          if (processedFile && !processedFile.error) {
            return {
              ...pf,
              extractedData: processedFile.extractedData,
              isProcessing: false
            }
          }
          return pf
        })
      )

    } catch (error) {
      console.error('Failed to upload files:', error)
      // Mark files as failed
      setProcessingFiles(prev =>
        prev.map(pf => ({ ...pf, isProcessing: false }))
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Handle confirming extracted data
  const handleConfirmExtraction = (file: File, extractedData: any) => {
    // Show assignment modal for organization
    setSelectedFileForAssign(file)
    setSelectedExtractedData(extractedData)
    setShowAssignModal(true)
  }

  // Handle document assignment
  const handleDocumentAssignment = (assignment: any) => {
    if (!selectedFileForAssign || !selectedExtractedData) return

    // Create new document with assigned organization
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: selectedFileForAssign.name,
      type: selectedExtractedData.documentType as any,
      size: selectedFileForAssign.size / 1024 / 1024,
      uploadDate: new Date(),
      processed: true,
      extractedData: selectedExtractedData,
      tags: assignment.tags,
      client: assignment.client,
      project: assignment.project,
      folder: assignment.folder
    }

    setDocuments(prev => [newDocument, ...prev])

    // Remove from processing files
    setProcessingFiles(prev =>
      prev.filter(pf => pf.file.name !== selectedFileForAssign.name)
    )

    // Close modal
    setShowAssignModal(false)
    setSelectedFileForAssign(null)
    setSelectedExtractedData(null)

    // Update stats
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      processed: prev.processed + 1,
      thisMonth: prev.thisMonth + 1
    }))
  }

  // Handle retry processing
  const handleRetryProcessing = (file: File) => {
    handleFileUpload([file])
  }

  // Handle skipping organization
  const handleSkipOrganization = (file: File, extractedData: any) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: file.name,
      type: extractedData.documentType as any,
      size: file.size / 1024 / 1024,
      uploadDate: new Date(),
      processed: true,
      extractedData: extractedData,
      tags: []
    }

    setDocuments(prev => [newDocument, ...prev])
    setProcessingFiles(prev =>
      prev.filter(pf => pf.file.name !== file.name)
    )

    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      processed: prev.processed + 1,
      thisMonth: prev.thisMonth + 1
    }))
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.type === filter || (filter === 'processed' && doc.processed) || (filter === 'pending' && !doc.processed)
    const matchesSearch = searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return '📄';
      case 'invoice': return '💰';
      case 'receipt': return '🧾';
      case 'bank_statement': return '🏦';
      case 'tax_file': return '📊';
      case 'identity': return '🆔';
      case 'handwritten': return '✍️';
      case 'report': return '📊';
      default: return '📁';
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case 'invoice': return { background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' };
      case 'receipt': return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      case 'bank_statement': return { background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
      case 'tax_file': return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      case 'identity': return { background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' };
      case 'handwritten': return { background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' };
      case 'report': return { background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' };
      default: return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            height: '2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            width: '33%'
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{
                  height: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.25rem',
                  width: '66%',
                  marginBottom: '1rem'
                }} />
                <div style={{
                  height: '2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.25rem',
                  width: '50%'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Document AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            AI-powered document processing and extraction
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowUploadCard(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              color: '#fff',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            📸
            <span>Capture Documents</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📁</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Documents</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#22c55e' }}>✅</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.processed}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Processed</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#f59e0b' }}>⏳</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pending}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Pending</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>📄</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.contracts}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Contracts</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#34d399' }}>💰</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.invoices}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Invoices</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1rem', color: '#9ca3af' }}>🔍</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'contract', 'invoice', 'receipt', 'bank_statement', 'tax_file', 'identity', 'processed', 'pending'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === filterOption
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <span style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            color: '#9ca3af'
          }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            📤 Uploading and processing documents...
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            AI is analyzing your documents. This may take a moment.
          </div>
        </div>
      )}

      {/* Upload Card Modal */}
      {showUploadCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh' }}>
            <UploadCard
              onUpload={handleFileUpload}
              isUploading={isUploading}
              dragActive={showUploadCard}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setShowUploadCard(false)}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Processing Panels */}
      {processingFiles.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            🤖 AI Processing ({processingFiles.length} files)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {processingFiles.map((processingFile, index) => (
              <AIExtractPanel
                key={`${processingFile.file.name}-${index}`}
                file={processingFile.file}
                extractedData={processingFile.extractedData}
                isProcessing={processingFile.isProcessing}
                onConfirm={(data) => handleConfirmExtraction(processingFile.file, data)}
                onEdit={() => {}}
                onRetry={() => handleRetryProcessing(processingFile.file)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Auto Assign Modal */}
      {showAssignModal && selectedFileForAssign && selectedExtractedData && (
        <AutoAssignModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false)
            setSelectedFileForAssign(null)
            setSelectedExtractedData(null)
          }}
          onAssign={handleDocumentAssignment}
          extractedData={selectedExtractedData}
          documentName={selectedFileForAssign.name}
        />
      )}

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1rem'
        }}>
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: doc.processed ? '4px solid #22c55e' : '4px solid #f59e0b'
              }}
              onClick={() => setSelectedDocument(doc)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {getDocumentIcon(doc.type)}
                </div>
                <div style={{ flex: 1, minWidth: '0' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {doc.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {(doc.size).toFixed(1)} MB • {doc.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  ...getTypeColor(doc.type)
                }}>
                  {doc.type}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  background: doc.processed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: doc.processed ? '#22c55e' : '#f59e0b'
                }}>
                  {doc.processed ? 'Processed' : 'Pending'}
                </span>
              </div>

              {doc.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {doc.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '9999px',
                        color: '#9ca3af'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {doc.extractedData && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    🤖 AI Extracted Data
                  </div>
                  {Object.entries(doc.extractedData).map(([key, value]) => (
                    <div key={key} style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            No documents found
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'Upload your first documents to see AI-powered processing.'
            }
          </p>
          <label style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            border: 'none',
            color: '#fff',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📤 Upload Documents
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}
    </div>
  )
}