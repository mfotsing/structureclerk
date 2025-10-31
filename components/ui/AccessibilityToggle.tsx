'use client'

import { useState, useEffect } from 'react'

interface AccessibilitySettings {
  simplifiedMode: boolean
  largeFonts: boolean
  highContrast: boolean
  reducedMotion: boolean
}

export default function AccessibilityToggle() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    simplifiedMode: false,
    largeFonts: false,
    highContrast: false,
    reducedMotion: false
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    // Apply classes to root element
    root.classList.toggle('accessibility-simplified', newSettings.simplifiedMode)
    root.classList.toggle('accessibility-large-fonts', newSettings.largeFonts)
    root.classList.toggle('accessibility-high-contrast', newSettings.highContrast)
    root.classList.toggle('accessibility-reduced-motion', newSettings.reducedMotion)

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
  }

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.75rem',
          background: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0.5rem',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          transition: 'all 0.2s',
        }}
        title="Accessibilité"
      >
        ♿
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          minWidth: '300px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          color: '#000'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Accessibilité
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Simplified Mode */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: settings.simplifiedMode ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={settings.simplifiedMode}
                onChange={(e) => updateSetting('simplifiedMode', e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>Mode Simplifié</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Interface réduite pour plus de clarté
                </div>
              </div>
            </label>

            {/* Large Fonts */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: settings.largeFonts ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={settings.largeFonts}
                onChange={(e) => updateSetting('largeFonts', e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>Polices Plus Grandes</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Augmente la taille du texte de 50%
                </div>
              </div>
            </label>

            {/* High Contrast */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: settings.highContrast ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>Contraste Élevé</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Améliore la lisibilité pour les yeux sensibles
                </div>
              </div>
            </label>

            {/* Reduced Motion */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: settings.reducedMotion ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>Mouvements Réduits</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Diminue les animations et transitions
                </div>
              </div>
            </label>
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Paramètres sauvegardés automatiquement
          </div>
        </div>
      )}
    </div>
  )
}