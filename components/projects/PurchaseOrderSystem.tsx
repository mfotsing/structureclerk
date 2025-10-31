'use client'

import { useState, useEffect } from 'react'

interface PurchaseOrder {
  id: string
  poNumber: string
  projectId: string
  vendorName: string
  vendorContact?: string
  description: string
  items: POItem[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'approved' | 'received' | 'invoiced' | 'paid'
  issueDate: Date
  expectedDeliveryDate?: Date
  actualDeliveryDate?: Date
  notes?: string
  attachments: string[]
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
}

interface POItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  unit: string
  total: number
  category: 'materials' | 'labor' | 'equipment' | 'subcontractor' | 'other'
}

interface Project {
  id: string
  name: string
  code: string
  client: string
  address: string
  budget: number
  spent: number
  status: 'planning' | 'active' | 'completed' | 'on_hold'
  startDate: Date
  endDate?: Date
  manager: string
}

export default function PurchaseOrderSystem() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'pos' | 'projects' | 'analytics'>('pos')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load mock data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Downtown Office Renovation',
        code: 'PROJ-2024-001',
        client: 'ABC Corp',
        address: '123 Main St, Toronto, ON',
        budget: 250000,
        spent: 87450,
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-30'),
        manager: 'Mike Chen'
      },
      {
        id: '2',
        name: 'Retail Store Construction',
        code: 'PROJ-2024-002',
        client: 'Retail Solutions Inc',
        address: '456 Commerce Ave, Mississauga, ON',
        budget: 180000,
        spent: 45200,
        status: 'active',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-15'),
        manager: 'Mike Chen'
      }
    ]

    const mockPOs: PurchaseOrder[] = [
      {
        id: '1',
        poNumber: 'PO-2024-001',
        projectId: '1',
        vendorName: 'Toronto Materials Supply',
        vendorContact: 'John Smith - 416-555-0101',
        description: 'Drywall and insulation materials',
        items: [
          {
            id: '1',
            description: 'Drywall Sheets 4x8',
            quantity: 200,
            unitPrice: 12.50,
            unit: 'sheets',
            total: 2500,
            category: 'materials'
          },
          {
            id: '2',
            description: 'Insulation Batts',
            quantity: 150,
            unitPrice: 45.00,
            unit: 'batts',
            total: 6750,
            category: 'materials'
          }
        ],
        subtotal: 9250,
        tax: 1202.50,
        total: 10452.50,
        status: 'approved',
        issueDate: new Date('2024-01-20'),
        expectedDeliveryDate: new Date('2024-01-25'),
        actualDeliveryDate: new Date('2024-01-24'),
        notes: 'Delivery to site entrance',
        attachments: ['quote_001.pdf', 'spec_sheet.pdf'],
        createdBy: 'Mike Chen',
        approvedBy: 'Sarah Johnson',
        approvedAt: new Date('2024-01-21')
      },
      {
        id: '2',
        poNumber: 'PO-2024-002',
        projectId: '2',
        vendorName: 'HVG Electrical Contractors',
        vendorContact: 'Maria Garcia - 905-555-0202',
        description: 'Electrical rough-in work',
        items: [
          {
            id: '3',
            description: 'Electrical Labor - Rough In',
            quantity: 80,
            unitPrice: 65.00,
            unit: 'hours',
            total: 5200,
            category: 'labor'
          }
        ],
        subtotal: 5200,
        tax: 676.00,
        total: 5876.00,
        status: 'sent',
        issueDate: new Date('2024-02-05'),
        expectedDeliveryDate: new Date('2024-02-15'),
        attachments: ['electrical_quote.pdf'],
        createdBy: 'Mike Chen'
      }
    ]

    setProjects(mockProjects)
    setPurchaseOrders(mockPOs)
    setIsLoading(false)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' },
      sent: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
      approved: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
      received: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
      invoiced: { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' },
      paid: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getProjectHealth = (project: Project) => {
    const budgetUsed = (project.spent / project.budget) * 100
    if (budgetUsed > 90) return { color: '#ef4444', status: 'Over Budget' }
    if (budgetUsed > 75) return { color: '#f59e0b', status: 'Near Limit' }
    return { color: '#10b981', status: 'On Track' }
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
        <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Loading PO system...</p>
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
            🏗️ Projects & Purchase Orders
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: 0
          }}>
            Manage construction projects and track all procurement
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ➕ Create Purchase Order
        </button>
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
          { id: 'pos', label: 'Purchase Orders', count: purchaseOrders.length },
          { id: 'projects', label: 'Projects', count: projects.length },
          { id: 'analytics', label: 'Analytics', count: null }
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

      {/* Purchase Orders Tab */}
      {activeTab === 'pos' && (
        <div>
          {/* PO Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { label: 'Total PO Value', value: formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.total, 0)), icon: '💰' },
              { label: 'Pending Approval', value: purchaseOrders.filter(po => po.status === 'sent').length.toString(), icon: '⏳' },
              { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length.toString(), icon: '🏗️' },
              { label: 'This Month', value: purchaseOrders.filter(po => new Date(po.issueDate).getMonth() === new Date().getMonth()).length.toString(), icon: '📅' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{stat.label}</span>
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* PO List */}
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
                Recent Purchase Orders
              </h3>
              <button style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.375rem',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                Filter
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>PO Number</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Project</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Vendor</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Total</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Delivery</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => {
                    const project = projects.find(p => p.id === po.projectId)
                    const statusStyle = getStatusColor(po.status)

                    return (
                      <tr key={po.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#fff' }}>{po.poNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {po.issueDate.toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#fff' }}>{project?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{project?.code}</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#fff' }}>{po.vendorName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{po.items.length} items</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>
                            {formatCurrency(po.total)}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {po.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                            {po.expectedDeliveryDate?.toLocaleDateString()}
                            {po.actualDeliveryDate && (
                              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                                ✅ Delivered {po.actualDeliveryDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => setSelectedPO(po)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: 'none',
                                borderRadius: '0.375rem',
                                color: '#3b82f6',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              View
                            </button>
                            <button style={{
                              padding: '0.375rem 0.75rem',
                              background: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '0.375rem',
                              color: '#fff',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {projects.map((project) => {
              const health = getProjectHealth(project)
              const projectPOs = purchaseOrders.filter(po => po.projectId === project.id)
              const totalPOValue = projectPOs.reduce((sum, po) => sum + po.total, 0)

              return (
                <div key={project.id} style={{
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
                        {project.name}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        {project.code} • {project.client}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: `${health.color}20`,
                      color: health.color,
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {health.status}
                    </span>
                  </div>

                  <div style={{
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    color: '#d1d5db'
                  }}>
                    📍 {project.address}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Budget</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                        {formatCurrency(project.budget)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Spent</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b' }}>
                        {formatCurrency(project.spent)}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginBottom: '1rem',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: health.color,
                      width: `${(project.spent / project.budget) * 100}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>{projectPOs.length} POs ({formatCurrency(totalPOValue)})</span>
                    <span>{((project.spent / project.budget) * 100).toFixed(1)}% used</span>
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
                      View Details
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
                      + PO
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#10b981',
              margin: '0 0 1rem 0'
            }}>
              📊 Project Budget Summary
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
              {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Total budget across {projects.length} projects
            </div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#f59e0b',
              margin: '0 0 1rem 0'
            }}>
              💰 Total PO Value
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
              {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.total, 0))}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Across {purchaseOrders.length} purchase orders
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#8b5cf6',
              margin: '0 0 1rem 0'
            }}>
              🏗️ Active Projects
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Currently under construction
            </div>
          </div>
        </div>
      )}
    </div>
  )
}