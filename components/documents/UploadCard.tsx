'use client'

import { useState, useRef, useCallback } from 'react'

interface UploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onUpload: (files: File[]) => void
  isUploading?: boolean
  dragActive?: boolean
}

export default function UploadCard({
  accept = "image/*,.pdf,.doc,.docx,.txt",
  multiple = true,
  maxSize = 10,
  onUpload,
  isUploading = false,
  dragActive = false
}: UploadOptions) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useState(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  })

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFiles = (files: File[]): File[] => {
    return Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Max size is ${maxSize}MB`)
        return false
      }

      // Check file type
      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map(type => type.trim())
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        const isAccepted = acceptedTypes.some(acceptedType => {
          if (acceptedType.startsWith('.')) {
            return fileExtension === acceptedType.toLowerCase()
          }
          if (acceptedType.includes('*')) {
            const baseType = acceptedType.split('/')[0]
            return file.type.startsWith(baseType)
          }
          return file.type === acceptedType || fileExtension === acceptedType.toLowerCase()
        })

        if (!isAccepted) {
          alert(`File "${file.name}" type not supported`)
          return false
        }
      }

      return true
    })
  }

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onUpload(validFiles)
    }
  }, [onUpload, maxSize, accept])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    handleFiles(Array.from(files))
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }, [handleFiles])

  // Handle camera capture on mobile
  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment' // Use rear camera by default
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        handleFiles(Array.from(files))
      }
    }
    input.click()
  }, [handleFiles])

  // Handle paste from clipboard
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile()
        if (file) {
          files.push(file)
        }
      }
    }

    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  // Add paste event listener
  useState(() => {
    const handlePasteGlobal = (e: ClipboardEvent) => handlePaste(e)
    document.addEventListener('paste', handlePasteGlobal)
    return () => document.removeEventListener('paste', handlePasteGlobal)
  })

  if (isUploading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem',
          animation: 'pulse 2s infinite'
        }}>
          🤖
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          AI Processing Your Documents
        </h3>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          Extracting text, classifying, and organizing automatically...
        </p>

        <div style={{ width: '100%', maxWidth: '300px' }}>
          <div style={{
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              width: `${uploadProgress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {uploadProgress}% Complete
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: isDragOver
          ? 'rgba(59, 130, 246, 0.1)'
          : dragActive
            ? 'rgba(139, 92, 246, 0.1)'
            : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: isDragOver
          ? '2px dashed #3b82f6'
          : dragActive
            ? '2px dashed #8b5cf6'
            : '2px dashed rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Upload Icon */}
      <div style={{
        width: '5rem',
        height: '5rem',
        background: isDragOver
          ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
          : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        fontSize: '2.5rem',
        boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
        animation: isDragOver ? 'pulse 1s infinite' : 'none'
      }}>
        {isDragOver ? '📥' : '📄'}
      </div>

      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: isDragOver ? '#3b82f6' : '#fff'
      }}>
        {isDragOver ? 'Drop files here' : '📸 Capture Documents Instantly'}
      </h3>

      <p style={{
        color: '#9ca3af',
        marginBottom: '2rem',
        lineHeight: 1.6,
        fontSize: '1rem'
      }}>
        {isDragOver
          ? 'Release to upload and let AI organize everything'
          : 'Take a photo, drag & drop, or paste from clipboard'
        }
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {/* Mobile Camera Button */}
        {isMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCameraCapture()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            📷
            <span>Take Photo</span>
          </button>
        )}

        {/* Browse Files Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          📁
          <span>Browse Files</span>
        </button>

        {/* Paste Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Trigger paste by focusing and simulating Ctrl+V
            const tempInput = document.createElement('input')
            tempInput.style.position = 'absolute'
            tempInput.style.left = '-9999px'
            document.body.appendChild(tempInput)
            tempInput.focus()
            document.execCommand('paste')
            document.body.removeChild(tempInput)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}
        >
          📋
          <span>Paste</span>
        </button>
      </div>

      {/* Supported Formats */}
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        lineHeight: 1.5
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>✨ AI will automatically:</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span>📝 Extract text</span>
          <span>🏷️ Classify document</span>
          <span>💰 Extract amounts</span>
          <span>📅 Find dates</span>
          <span>👤 Detect vendors</span>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}>
          Supports: PDF, Images, Word, Text • Max {maxSize}MB per file
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Drag overlay indicator */}
      {isDragOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '1rem',
          border: '2px solid #3b82f6',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  )
}