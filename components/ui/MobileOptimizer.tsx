'use client'

import { useState, useEffect } from 'react'

interface MobileSettings {
  oneHandedMode: boolean
  largerTouchTargets: boolean
  thumbOptimizedLayout: boolean
  reduceAnimations: boolean
  hapticFeedback: boolean
  floatingActions: boolean
}

export default function MobileOptimizer() {
  const [settings, setSettings] = useState<MobileSettings>({
    oneHandedMode: false,
    largerTouchTargets: false,
    thumbOptimizedLayout: false,
    reduceAnimations: false,
    hapticFeedback: true,
    floatingActions: false
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      setIsMobile(isMobileDevice || isTouchDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load saved settings
    const savedSettings = localStorage.getItem('mobile-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applyMobileSettings(parsed)
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    applyMobileSettings(settings)
    localStorage.setItem('mobile-settings', JSON.stringify(settings))
  }, [settings])

  const applyMobileSettings = (newSettings: MobileSettings) => {
    const root = document.documentElement

    // Apply mobile optimization classes
    root.classList.toggle('mobile-one-handed', newSettings.oneHandedMode)
    root.classList.toggle('mobile-large-touch', newSettings.largerTouchTargets)
    root.classList.toggle('mobile-thumb-optimized', newSettings.thumbOptimizedLayout)
    root.classList.toggle('mobile-reduced-animations', newSettings.reduceAnimations)
    root.classList.toggle('mobile-floating-actions', newSettings.floatingActions)

    // Update viewport meta tag for better mobile experience
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport && isMobile) {
      if (newSettings.oneHandedMode) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0'
      }
    }
  }

  const updateSetting = (key: keyof MobileSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))

    // Haptic feedback if enabled
    if (settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const triggerHaptic = (intensity: number = 50) => {
    if (settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(intensity)
    }
  }

  // Don't show on desktop
  if (!isMobile) return null

  return (
    <>
      {/* Mobile Optimization Toggle Button */}
      <button
        onClick={() => {
          setIsShowing(!isShowing)
          triggerHaptic(30)
        }}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          width: '3.5rem',
          height: '3.5rem',
          background: 'rgba(59, 130, 246, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s ease'
        }}
        className="mobile-optimized-button"
      >
        📱
      </button>

      {/* Mobile Settings Panel */}
      {isShowing && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1rem',
          left: '1rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '1.5rem',
          padding: '2rem',
          zIndex: 9998,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              Mobile Experience
            </h3>
            <button
              onClick={() => {
                setIsShowing(false)
                triggerHaptic(30)
              }}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* One-Handed Mode */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: settings.oneHandedMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: settings.oneHandedMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🤚
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  One-Handed Mode
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.4
                }}>
                  Optimize layout for thumb reach on one side
                </div>
              </div>
              <div style={{
                width: '3rem',
                height: '1.75rem',
                background: settings.oneHandedMode ? '#3b82f6' : '#d1d5db',
                borderRadius: '2rem',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: settings.oneHandedMode ? '1.25rem' : '0.125rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>

            {/* Larger Touch Targets */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: settings.largerTouchTargets ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: settings.largerTouchTargets ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                👆
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  Larger Touch Targets
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.4
                }}>
                  Increase button sizes for easier tapping
                </div>
              </div>
              <div style={{
                width: '3rem',
                height: '1.75rem',
                background: settings.largerTouchTargets ? '#10b981' : '#d1d5db',
                borderRadius: '2rem',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: settings.largerTouchTargets ? '1.25rem' : '0.125rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>

            {/* Thumb-Optimized Layout */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: settings.thumbOptimizedLayout ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: settings.thumbOptimizedLayout ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                👍
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  Thumb-Optimized Layout
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.4
                }}>
                  Place important actions in thumb's natural reach zone
                </div>
              </div>
              <div style={{
                width: '3rem',
                height: '1.75rem',
                background: settings.thumbOptimizedLayout ? '#8b5cf6' : '#d1d5db',
                borderRadius: '2rem',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: settings.thumbOptimizedLayout ? '1.25rem' : '0.125rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>

            {/* Floating Actions */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: settings.floatingActions ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: settings.floatingActions ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🔘
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  Floating Action Buttons
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.4
                }}>
                  Quick access buttons that stay visible while scrolling
                </div>
              </div>
              <div style={{
                width: '3rem',
                height: '1.75rem',
                background: settings.floatingActions ? '#f59e0b' : '#d1d5db',
                borderRadius: '2rem',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: settings.floatingActions ? '1.25rem' : '0.125rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>

            {/* Haptic Feedback */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: settings.hapticFeedback ? 'rgba(236, 72, 153, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: settings.hapticFeedback ? 'rgba(236, 72, 153, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📳
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  Haptic Feedback
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.4
                }}>
                  Vibration feedback for better interaction确认
                </div>
              </div>
              <div style={{
                width: '3rem',
                height: '1.75rem',
                background: settings.hapticFeedback ? '#ec4899' : '#d1d5db',
                borderRadius: '2rem',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.125rem',
                  left: settings.hapticFeedback ? '1.25rem' : '0.125rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>
          </div>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <button
              onClick={() => {
                // Reset to defaults
                setSettings({
                  oneHandedMode: false,
                  largerTouchTargets: false,
                  thumbOptimizedLayout: false,
                  reduceAnimations: false,
                  hapticFeedback: true,
                  floatingActions: false
                })
                triggerHaptic(100)
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(107, 114, 128, 0.1)',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '0.75rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isShowing && (
        <div
          onClick={() => setIsShowing(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9997
          }}
        />
      )}
    </>
  )
}