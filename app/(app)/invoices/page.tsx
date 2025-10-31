'use client'

import { useState, useEffect } from 'react'

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  extractedFrom?: string;
  tags: string[];
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    outstanding: 0,
    overdue: 0,
    totalValue: 0
  })

  // Fetch invoices data
  useEffect(() => {
    const fetchInvoicesData = async () => {
      try {
        // Simulate API calls
        setStats({
          total: 156,
          paid: 134,
          outstanding: 18,
          overdue: 4,
          totalValue: 284750
        })

        setInvoices([
          {
            id: '1',
            invoiceNumber: 'INV-2024-001',
            client: 'TechCorp LLC',
            amount: 15750,
            dueDate: new Date('2024-02-15'),
            status: 'sent',
            issueDate: new Date('2024-01-15'),
            items: [
              { description: 'AI Consulting Services', quantity: 40, unitPrice: 350, total: 14000 },
              { description: 'Documentation Review', quantity: 5, unitPrice: 350, total: 1750 }
            ],
            extractedFrom: 'Email: Service Agreement Discussion',
            tags: ['techcorp', 'consulting', 'ai-services']
          },
          {
            id: '2',
            invoiceNumber: 'INV-2024-002',
            client: 'ABC Consulting',
            amount: 8250,
            dueDate: new Date('2024-02-01'),
            status: 'paid',
            issueDate: new Date('2024-01-10'),
            items: [
              { description: 'Development Services', quantity: 25, unitPrice: 300, total: 7500 },
              { description: 'Support & Maintenance', quantity: 3, unitPrice: 250, total: 750 }
            ],
            extractedFrom: 'Document: Project Contract',
            tags: ['abc-consulting', 'development', 'paid']
          },
          {
            id: '3',
            invoiceNumber: 'INV-2024-003',
            client: 'StartupXYZ',
            amount: 22500,
            dueDate: new Date('2024-01-30'),
            status: 'overdue',
            issueDate: new Date('2023-12-30'),
            items: [
              { description: 'Platform Integration', quantity: 60, unitPrice: 375, total: 22500 }
            ],
            extractedFrom: 'Audio: Client Meeting - Q1 Planning',
            tags: ['startupxyz', 'integration', 'overdue']
          },
          {
            id: '4',
            invoiceNumber: 'INV-2024-004',
            client: 'Global Industries',
            amount: 45000,
            dueDate: new Date('2024-03-15'),
            status: 'draft',
            issueDate: new Date(),
            items: [
              { description: 'Enterprise AI Solution', quantity: 120, unitPrice: 375, total: 45000 }
            ],
            tags: ['global-industries', 'enterprise', 'draft']
          }
        ])
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoicesData()
  }, [])

  // Handle invoice creation
  const handleCreateInvoice = async (invoiceData: Partial<Invoice>) => {
    setIsCreating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newInvoice: Invoice = {
        id: `new-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        client: invoiceData.client || 'New Client',
        amount: invoiceData.amount || 0,
        dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'draft',
        issueDate: new Date(),
        items: invoiceData.items || [],
        tags: ['new']
      }

      setInvoices([newInvoice, ...invoices])
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create invoice:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter
    const matchesSearch = searchQuery === '' ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      case 'sent': return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case 'overdue': return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      case 'draft': return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
      case 'cancelled': return { background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' };
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
            background: 'linear-gradient(135deg, #fff, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Invoice AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            AI-powered invoice generation and management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowCreateForm(true)}
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
            }}
          >
            💰
            <span>Create Invoice</span>
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
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Invoices</div>
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.paid}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Paid</div>
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.outstanding}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Outstanding</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#ef4444' }}>⚠️</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.overdue}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Overdue</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>📈</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalValue)}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Value</div>
        </div>
      </div>

      {/* Create Invoice Form */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
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
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Create New Invoice
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  placeholder="Invoice description or services rendered"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateInvoice({
                    client: 'New Client',
                    amount: 5000,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    items: [{ description: 'Professional Services', quantity: 1, unitPrice: 5000, total: 5000 }]
                  })}
                  disabled={isCreating}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: isCreating ? 0.5 : 1
                  }}
                >
                  {isCreating ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {['all', 'draft', 'sent', 'paid', 'overdue'].map((filterOption) => (
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
                    ? 'linear-gradient(135deg, #34d399, #10b981)'
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
            placeholder="Search invoices..."
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

      {/* Invoices Grid */}
      {filteredInvoices.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1rem'
        }}>
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: `4px solid ${getStatusColor(invoice.status).color}`
              }}
              onClick={() => setSelectedInvoice(invoice)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem'
                  }}>
                    {invoice.invoiceNumber}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    {invoice.client}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  ...getStatusColor(invoice.status)
                }}>
                  {invoice.status}
                </span>
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399', marginBottom: '1rem' }}>
                {formatCurrency(invoice.amount)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Issue Date</div>
                  <div>{invoice.issueDate.toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Due Date</div>
                  <div>{invoice.dueDate.toLocaleDateString()}</div>
                </div>
              </div>

              {invoice.extractedFrom && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(52, 211, 153, 0.1)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#34d399'
                }}>
                  🤖 Extracted from: {invoice.extractedFrom}
                </div>
              )}

              {invoice.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {invoice.tags.map((tag, index) => (
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            No invoices found
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'Create your first invoice or let AI extract them from your communications.'
            }
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
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
            }}
          >
            💰 Create Invoice
          </button>
        </div>
      )}
    </div>
  )
}