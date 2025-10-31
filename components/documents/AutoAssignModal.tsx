'use client'

import { useState, useEffect } from 'react'

interface Client {
  id: string
  name: string
  email?: string
  company?: string
  lastProject?: string
  documentCount: number
  matchScore?: number
}

interface Project {
  id: string
  name: string
  client: string
  status: 'active' | 'completed' | 'archived'
  documentCount: number
  matchScore?: number
}

interface Folder {
  id: string
  name: string
  path: string
  documentCount: number
  color: string
  icon: string
}

interface AutoAssignModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (assignment: {
    client?: string
    project?: string
    folder?: string
    tags: string[]
    createNew: boolean
  }) => void
  extractedData: {
    documentType: string
    keyFields: {
      vendor?: string
      client?: string
      amount?: number
      invoiceNumber?: string
      [key: string]: any
    }
    extractedText: string
  }
  documentName: string
}

export default function AutoAssignModal({
  isOpen,
  onClose,
  onAssign,
  extractedData,
  documentName
}: AutoAssignModalProps) {
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const [customTags, setCustomTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [createNewEntities, setCreateNewEntities] = useState(false)

  // Mock data - in real app, this would come from API
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    if (!isOpen) return

    // Simulate API calls to get suggestions based on extracted data
    const mockClients: Client[] = [
      { id: '1', name: 'TechCorp LLC', company: 'TechCorp LLC', email: 'billing@techcorp.com', documentCount: 47, matchScore: 92 },
      { id: '2', name: 'ABC Consulting', company: 'ABC Consulting', email: 'invoices@abc.com', documentCount: 23, matchScore: 78 },
      { id: '3', name: 'Global Industries', company: 'Global Industries Inc', documentCount: 15, matchScore: 65 },
      { id: '4', name: 'StartupXYZ', company: 'StartupXYZ', email: 'hello@startupxyz.com', documentCount: 8, matchScore: 45 }
    ]

    const mockProjects: Project[] = [
      { id: '1', name: 'Q1 2024 Consulting', client: 'TechCorp LLC', status: 'active', documentCount: 12, matchScore: 88 },
      { id: '2', name: 'Website Redesign', client: 'ABC Consulting', status: 'active', documentCount: 8, matchScore: 72 },
      { id: '3', name: 'Mobile App Development', client: 'Global Industries', status: 'completed', documentCount: 24, matchScore: 60 }
    ]

    const mockFolders: Folder[] = [
      { id: '1', name: 'Invoices', path: '/invoices', documentCount: 156, color: '#34d399', icon: '💰' },
      { id: '2', name: 'Contracts', path: '/contracts', documentCount: 42, color: '#3b82f6', icon: '📄' },
      { id: '3', name: 'Receipts', path: '/receipts', documentCount: 89, color: '#f59e0b', icon: '🧾' },
      { id: '4', name: 'Bank Statements', path: '/banking', documentCount: 24, color: '#10b981', icon: '🏦' },
      { id: '5', name: 'Tax Documents', path: '/tax', documentCount: 18, color: '#ef4444', icon: '📊' }
    ]

    // Auto-select based on extracted data
    if (extractedData.keyFields.client || extractedData.keyFields.vendor) {
      const entityName = extractedData.keyFields.client || extractedData.keyFields.vendor
      const matchingClient = mockClients.find(client =>
        entityName && (
          client.name.toLowerCase().includes(entityName.toLowerCase()) ||
          client.company?.toLowerCase().includes(entityName.toLowerCase())
        )
      )
      if (matchingClient) {
        setSelectedClient(matchingClient.id)
        // Filter projects for this client
        const clientProjects = mockProjects.filter(p => p.client === matchingClient.name)
        setProjects(clientProjects)
        if (clientProjects.length > 0) {
          setSelectedProject(clientProjects[0].id)
        }
      }
    }

    // Auto-select folder based on document type
    const docType = extractedData.documentType
    const autoFolder = mockFolders.find(folder =>
      folder.name.toLowerCase().includes(docType.replace('_', ' ').toLowerCase())
    )
    if (autoFolder) {
      setSelectedFolder(autoFolder.id)
    }

    // Auto-generate tags
    const autoTags = []
    if (extractedData.keyFields.invoiceNumber) autoTags.push(`invoice-${extractedData.keyFields.invoiceNumber}`)
    if (extractedData.keyFields.vendor) autoTags.push(extractedData.keyFields.vendor.toLowerCase())
    if (extractedData.keyFields.amount && extractedData.keyFields.amount > 1000) autoTags.push('high-value')
    if (docType) autoTags.push(docType)

    setClients(mockClients)
    setProjects(mockProjects)
    setFolders(mockFolders)
    setCustomTags(autoTags)
  }, [isOpen, extractedData])

  const handleAddTag = () => {
    if (newTagInput.trim() && !customTags.includes(newTagInput.trim())) {
      setCustomTags([...customTags, newTagInput.trim()])
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter(tag => tag !== tagToRemove))
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId)
    setSelectedProject('') // Reset project when client changes

    // Filter projects for selected client
    const client = clients.find(c => c.id === clientId)
    if (client) {
      // Mock filtering - in real app, fetch projects for this client
      const allProjects: Project[] = [
        { id: '1', name: 'Q1 2024 Consulting', client: 'TechCorp LLC', status: 'active', documentCount: 12 },
        { id: '2', name: 'Q2 2024 Consulting', client: 'TechCorp LLC', status: 'active', documentCount: 8 },
        { id: '3', name: 'Website Redesign', client: 'ABC Consulting', status: 'active', documentCount: 8 },
        { id: '4', name: 'Marketing Campaign', client: 'ABC Consulting', status: 'active', documentCount: 5 },
        { id: '5', name: 'Mobile App Development', client: 'Global Industries', status: 'completed', documentCount: 24 }
      ]
      const clientProjects = allProjects.filter(p => p.client === client.name)
      setProjects(clientProjects)
    }
  }

  const handleConfirm = () => {
    onAssign({
      client: selectedClient,
      project: selectedProject,
      folder: selectedFolder,
      tags: customTags,
      createNew: createNewEntities
    })
    onClose()
  }

  if (!isOpen) return null

  return (
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
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem 2rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🎯 Organize Your Document
          </h2>
          <p style={{ color: '#9ca3af' }}>
            AI detected patterns. Assign to client, project, and add tags for easy retrieval.
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Document Preview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                📄
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {documentName}
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  Type: {extractedData.documentType.replace('_', ' ')}
                  {extractedData.keyFields.amount && (
                    <span> • Amount: ${extractedData.keyFields.amount.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🤖</span>
              <span style={{ fontWeight: '600', color: '#a78bfa' }}>AI Suggestions</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
              {extractedData.keyFields.client && `Detected client: "${extractedData.keyFields.client}" • `}
              {extractedData.keyFields.vendor && `Vendor: "${extractedData.keyFields.vendor}" • `}
              Type: {extractedData.documentType.replace('_', ' ')} document
            </div>
          </div>

          {/* Client Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              👤 Client / Vendor
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientChange(client.id)}
                  style={{
                    padding: '1rem',
                    background: selectedClient === client.id
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedClient === client.id
                      ? '1px solid rgba(59, 130, 246, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{client.name}</span>
                    {client.matchScore && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        borderRadius: '9999px'
                      }}>
                        {client.matchScore}% match
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {client.documentCount} documents
                  </div>
                </button>
              ))}
              <button
                onClick={() => setCreateNewEntities(true)}
                style={{
                  padding: '1rem',
                  background: createNewEntities
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: createNewEntities
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  borderStyle: 'dashed'
                }}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>➕</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Create New Client</div>
              </button>
            </div>
          </div>

          {/* Project Selection */}
          {selectedClient && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                📁 Project (Optional)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    style={{
                      padding: '1rem',
                      background: selectedProject === project.id
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedProject === project.id
                        ? '1px solid rgba(59, 130, 246, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {project.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {project.documentCount} documents • {project.status}
                    </div>
                  </button>
                ))}
                <button
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>➕</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Create New Project</div>
                </button>
              </div>
            </div>
          )}

          {/* Folder Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              📂 Folder Organization
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  style={{
                    padding: '1rem',
                    background: selectedFolder === folder.id
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedFolder === folder.id
                      ? '1px solid rgba(59, 130, 246, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{folder.icon}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{folder.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{folder.documentCount} items</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              🏷️ Tags for Easy Search
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {customTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    color: '#a78bfa'
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#a78bfa',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '1rem'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add custom tag..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handleAddTag}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
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
              Skip
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              ✅ Organize Document
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}