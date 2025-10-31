'use client'

import { useState } from 'react'

export default function HomePage() {
  const [email, setEmail] = useState('')

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
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Features
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
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
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              padding: '0.25rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              🤖 Your AI Workspace for Business Productivity
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
              Your AI Workspace<br />
              <span style={{ color: '#a78bfa' }}>for Business Productivity</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              color: '#d1d5db',
              lineHeight: 1.6
            }}>
              Search anything. Capture everything. Automate admin with AI.
              <br />
              <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                The complete AI-powered platform for modern businesses.
              </span>
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button style={{
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
              }}>
                Start Free Trial
              </button>
              <button style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '4rem auto 0'
          }}>
            {[
              { value: '10K+', label: 'Documents Processed Daily' },
              { value: '95%', label: 'Time Saved' },
              { value: '$2.5M', label: 'Invoices Processed' },
              { value: '500+', label: 'Happy Entrepreneurs' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}