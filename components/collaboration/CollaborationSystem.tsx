'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'viewer'
  avatar: string
  status: 'active' | 'away' | 'offline'
  lastActive: Date
}

interface SharedDocument {
  id: string
  title: string
  type: 'document' | 'invoice' | 'project' | 'audio' | 'contract'
  ownerId: string
  sharedWith: string[]
  permissions: {
    userId: string
    role: 'viewer' | 'editor' | 'admin'
    canShare: boolean
    canDelete: boolean
  }[]
  shareLink?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

interface ApprovalWorkflow {
  id: string
  title: string
  type: 'invoice' | 'contract' | 'po' | 'expense'
  documentId: string
  documentType: string
  currentStep: number
  totalSteps: number
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed'
  requestedBy: string
  requestedAt: Date
  approvers: {
    userId: string
    name: string
    role: string
    status: 'pending' | 'approved' | 'rejected'
    decisionAt?: Date
    comment?: string
  }[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline?: Date
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: Date
  replies?: Comment[]
  mentions?: string[]
  attachments?: string[]
}

export default function CollaborationSystem() {
  const [activeTab, setActiveTab] = useState<'sharing' | 'workflows' | 'team'>('sharing')
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([])
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load mock collaboration data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Mike Chen',
        email: 'mike@construction.com',
        role: 'owner',
        avatar: 'MC',
        status: 'active',
        lastActive: new Date()
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@construction.com',
        role: 'admin',
        avatar: 'SJ',
        status: 'active',
        lastActive: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '3',
        name: 'Tom Wilson',
        email: 'tom@construction.com',
        role: 'manager',
        avatar: 'TW',
        status: 'away',
        lastActive: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '4',
        name: 'Lisa Park',
        email: 'lisa@construction.com',
        role: 'employee',
        avatar: 'LP',
        status: 'offline',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    ]

    const mockSharedDocuments: SharedDocument[] = [
      {
        id: '1',
        title: 'Q1 Financial Report',
        type: 'document',
        ownerId: '1',
        sharedWith: ['2', '3'],
        permissions: [
          { userId: '2', role: 'editor', canShare: true, canDelete: false },
          { userId: '3', role: 'viewer', canShare: false, canDelete: false }
        ],
        isPublic: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        title: 'Project Alpha Contract',
        type: 'contract',
        ownerId: '1',
        sharedWith: ['2', '3', '4'],
        permissions: [
          { userId: '2', role: 'admin', canShare: true, canDelete: true },
          { userId: '3', role: 'editor', canShare: false, canDelete: false },
          { userId: '4', role: 'viewer', canShare: false, canDelete: false }
        ],
        shareLink: 'https://structureclerk.app/shared/abc123',
        isPublic: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      }
    ]

    const mockWorkflows: ApprovalWorkflow[] = [
      {
        id: '1',
        title: 'Invoice INV-2024-001 Approval',
        type: 'invoice',
        documentId: 'inv-001',
        documentType: 'Invoice',
        currentStep: 1,
        totalSteps: 2,
        status: 'in_review',
        requestedBy: '2',
        requestedAt: new Date('2024-01-20'),
        approvers: [
          {
            userId: '3',
            name: 'Tom Wilson',
            role: 'Project Manager',
            status: 'approved',
            decisionAt: new Date('2024-01-21'),
            comment: 'Approved - matches project budget'
          },
          {
            userId: '1',
            name: 'Mike Chen',
            role: 'Owner',
            status: 'pending'
          }
        ],
        priority: 'high',
        deadline: new Date('2024-01-25')
      },
      {
        id: '2',
        title: 'PO-2024-003 Material Purchase',
        type: 'po',
        documentId: 'po-003',
        documentType: 'Purchase Order',
        currentStep: 0,
        totalSteps: 1,
        status: 'pending',
        requestedBy: '3',
        requestedAt: new Date('2024-01-22'),
        approvers: [
          {
            userId: '1',
            name: 'Mike Chen',
            role: 'Owner',
            status: 'pending'
          }
        ],
        priority: 'medium'
      }
    ]

    setTeamMembers(mockUsers)
    setSharedDocuments(mockSharedDocuments)
    setApprovalWorkflows(mockWorkflows)
    setIsLoading(false)
  }, [])

  const getRoleColor = (role: string) => {
    const colors = {
      owner: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
      admin: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
      manager: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
      employee: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
      viewer: { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' }
    }
    return colors[role as keyof typeof colors] || colors.viewer
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: '#10b981',
      away: '#f59e0b',
      offline: '#6b7280',
      pending: '#f59e0b',
      in_review: '#3b82f6',
      approved: '#10b981',
      rejected: '#ef4444',
      completed: '#22c55e'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#9ca3af',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Loading collaboration tools...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            margin: '0 0 0.5rem 0'
          }}>
            👥 Collaboration Center
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: 0
          }}>
            Share documents, manage approvals, and work with your team
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            👤 Invite Team Member
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '0.25rem',
        borderRadius: '0.5rem'
      }}>
        {[
          { id: 'sharing', label: 'Shared Documents', count: sharedDocuments.length },
          { id: 'workflows', label: 'Approval Workflows', count: approvalWorkflows.filter(w => w.status !== 'completed').length },
          { id: 'team', label: 'Team Members', count: teamMembers.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id
                ? 'rgba(59, 130, 246, 0.2)'
                : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              color: activeTab === tab.id ? '#3b82f6' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{
                background: activeTab === tab.id ? '#3b82f6' : 'rgba(156, 163, 175, 0.3)',
                color: activeTab === tab.id ? '#fff' : '#9ca3af',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shared Documents Tab */}
      {activeTab === 'sharing' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {sharedDocuments.map((doc) => {
              const sharedUsers = doc.sharedWith.map(userId =>
                teamMembers.find(user => user.id === userId)
              ).filter(Boolean) as User[]

              return (
                <div key={doc.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {doc.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0,
                        textTransform: 'capitalize'
                      }}>
                        {doc.type}
                      </p>
                    </div>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      📄
                    </div>
                  </div>

                  {doc.isPublic && (
                    <div style={{
                      padding: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      fontSize: '0.75rem',
                      color: '#10b981'
                    }}>
                      🔗 Public Link Available
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      marginBottom: '0.5rem'
                    }}>
                      Shared with ({sharedUsers.length})
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {sharedUsers.map((user) => (
                        <div key={user.id} style={{
                          width: '2rem',
                          height: '2rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#3b82f6',
                          position: 'relative'
                        }}
                        title={user.name}
                        >
                          {user.avatar}
                          <div style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '0.5rem',
                            height: '0.5rem',
                            background: getStatusColor(user.status),
                            borderRadius: '50%',
                            border: '2px solid rgba(255, 255, 255, 0.1)'
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>Updated {doc.updatedAt.toLocaleDateString()}</span>
                    {doc.shareLink && (
                      <span>• Public link</span>
                    )}
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: '#3b82f6',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      Manage Access
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      Copy Link
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Approval Workflows Tab */}
      {activeTab === 'workflows' && (
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#fff',
                margin: 0
              }}>
                Pending Approvals
              </h3>
              <button style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                + New Workflow
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {approvalWorkflows.map((workflow) => (
                <div key={workflow.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  border: `1px solid ${getPriorityColor(workflow.priority)}40`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {workflow.title}
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        {workflow.documentType} • Requested by {workflow.requestedBy}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: `${getStatusColor(workflow.status)}20`,
                        color: getStatusColor(workflow.status),
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {workflow.status.toUpperCase()}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: `${getPriorityColor(workflow.priority)}20`,
                        color: getPriorityColor(workflow.priority),
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {workflow.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: getStatusColor(workflow.status),
                        width: `${(workflow.currentStep / workflow.totalSteps) * 100}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af'
                    }}>
                      {workflow.currentStep}/{workflow.totalSteps} steps
                    </span>
                  </div>

                  {/* Approvers */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      marginBottom: '0.5rem'
                    }}>
                      Approval Chain
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {workflow.approvers.map((approver, index) => (
                        <div key={approver.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            background: `${getStatusColor(approver.status)}20`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: getStatusColor(approver.status)
                          }}>
                            {approver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', color: '#fff' }}>
                              {approver.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {approver.role}
                            </div>
                          </div>
                          {index < workflow.approvers.length - 1 && (
                            <span style={{ color: '#6b7280' }}>→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {workflow.deadline && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#f59e0b',
                      marginBottom: '1rem'
                    }}>
                      ⏰ Deadline: {workflow.deadline.toLocaleDateString()}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: '#10b981',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      ✅ Approve
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      ❌ Reject
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      💬 Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Tab */}
      {activeTab === 'team' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {teamMembers.map((member) => {
              const roleStyle = getRoleColor(member.role)

              return (
                <div key={member.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: `${roleStyle.color}20`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: roleStyle.color,
                      position: 'relative'
                    }}>
                      {member.avatar}
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '0.75rem',
                        height: '0.75rem',
                        background: getStatusColor(member.status),
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.1)'
                      }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#fff',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {member.name}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: roleStyle.bg,
                      color: roleStyle.color,
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {member.role.toUpperCase()}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    Last active: {member.lastActive.toLocaleDateString()}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: '#3b82f6',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      View Profile
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      ⚙️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}