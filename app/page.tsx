'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleStartFree = () => {
    router.push('/en/signup') // Default to English, can be made dynamic
  }

  const handleWatchDemo = () => {
    router.push('/en#demo')
  }

  const handleFeatures = () => {
    router.push('/en#features')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background with gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Navigation */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              SC
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>StructureClerk</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              marginLeft: '0.5rem'
            }}>
              🍁 CA
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleFeatures}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Features
            </button>
            <a
              href="/en/pricing"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Pricing
            </a>
            <a
              href="/en/contact"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Contact
            </a>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', padding: '0.125rem' }}>
              <a
                href="/en"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                EN
              </a>
              <a
                href="/fr"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                FR
              </a>
            </div>
            <button
              onClick={handleStartFree}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                color: '#fff',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
            >
              Start Free
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '3rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '0.25rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              🍁 Canada's AI-Powered Business Assistant | Bilingual EN/FR Support
            </div>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Your Canadian Business<br />
              <span style={{ color: '#fca5a5' }}>AI Administrative Assistant</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              color: '#d1d5db',
              lineHeight: 1.6
            }}>
              🤖 Real AI document processing • 💰 Canadian tax calculations (GST/HST/QST)<br />
              🇨🇦 All provinces supported • 💵 CAD/USD multi-currency • 🔄 Bilingual EN/FR<br />
              <span style={{ color: '#fca5a5', fontWeight: '600' }}>
                Built for Canadian entrepreneurs, freelancers, and small businesses.
              </span>
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleStartFree}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                Start Free Trial - No Credit Card
              </button>
              <button
                onClick={handleWatchDemo}
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Watch 2-Min Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                <span>🔒</span>
                <span>PIPEDA Compliant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                <span>🇨🇦</span>
                <span>Data Stored in Canada</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                <span>⚡</span>
                <span>Real AI Processing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #fff, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Everything Canadian Businesses Need
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {[
              {
                icon: '🤖',
                title: 'Real AI Document Processing',
                description: 'Upload invoices, receipts, contracts. Our AI extracts data, categorizes expenses, and suggests actions with Canadian business context.',
                color: '#60a5fa'
              },
              {
                icon: '💰',
                title: 'Canadian Tax Calculations',
                description: 'Automatic GST/HST/QST calculations for all provinces. Tax advice tailored to your business type and location.',
                color: '#fca5a5'
              },
              {
                icon: '💵',
                title: 'Multi-Currency Support',
                description: 'Seamless CAD/USD handling with real-time exchange rates. Perfect for businesses serving Canadian and US clients.',
                color: '#a78bfa'
              },
              {
                icon: '🇨🇦',
                title: 'All Provinces Supported',
                description: 'From British Columbia to Newfoundland. Tax rates, regulations, and business practices for every Canadian province.',
                color: '#fbbf24'
              },
              {
                icon: '🔄',
                title: 'Bilingual EN/FR Interface',
                description: 'Complete bilingual support for English and French. Perfect for businesses operating anywhere in Canada.',
                color: '#34d399'
              },
              {
                icon: '💬',
                title: 'AI Business Assistant',
                description: 'Chat with our AI about Canadian business questions, tax advice, compliance, and administrative tasks.',
                color: '#f87171'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'transform 0.2s, border-color 0.2s'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  display: 'block'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: feature.color
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#d1d5db',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section style={{
          padding: '4rem 2rem',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { value: '50K+', label: 'Canadian Documents Processed' },
              { value: '13/13', label: 'Provinces & Territories Supported' },
              { value: '$5M+', label: 'Canadian Invoices Processed' },
              { value: '2,000+', label: 'Canadian Business Owners' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fca5a5', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '3rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff, #fca5a5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Ready to Transform Your Canadian Business?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#d1d5db',
              marginBottom: '2rem'
            }}>
              Join thousands of Canadian entrepreneurs saving time with AI-powered administrative assistance.
            </p>
            <button
              onClick={handleStartFree}
              style={{
                background: 'linear-gradient(135deg, #fca5a5, #ef4444)',
                border: 'none',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
                transition: 'transform 0.2s'
              }}
            >
              Start Your Free Canadian Trial
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            marginBottom: '2rem'
          }}>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fca5a5' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="/en#features" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/en/pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/api/ai/chat-secure" style={{ color: '#9ca3af', textDecoration: 'none' }}>AI Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fca5a5' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="/en/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/en/legal/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/en/legal/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fca5a5' }}>Canadian Features</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', color: '#9ca3af' }}>✅ PIPEDA Compliant</li>
                <li style={{ marginBottom: '0.5rem', color: '#9ca3af' }}>✅ Data Stored in Canada</li>
                <li style={{ marginBottom: '0.5rem', color: '#9ca3af' }}>✅ All Provinces Supported</li>
                <li style={{ marginBottom: '0.5rem', color: '#9ca3af' }}>✅ Bilingual EN/FR</li>
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>🍁 Made with ❤️ in Canada for Canadian businesses</p>
            <p style={{ fontSize: '0.875rem' }}>
              © 2024 StructureClerk Inc. | Montreal, Quebec |
              <a href="/en/legal/privacy" style={{ color: '#9ca3af', textDecoration: 'none', marginLeft: '0.5rem' }}>Privacy</a> |
              <a href="/en/legal/terms" style={{ color: '#9ca3af', textDecoration: 'none', marginLeft: '0.5rem' }}>Terms</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}