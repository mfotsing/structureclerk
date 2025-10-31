'use client'

import { useState, useEffect } from 'react'

interface AudioRecording {
  id: string;
  title: string;
  duration: number;
  uploadDate: Date;
  processed: boolean;
  transcript?: string;
  extractedData?: {
    summary: string;
    actionItems: string[];
    keyTopics: string[];
    participants: string[];
  };
  tags: string[];
}

export default function AudioPage() {
  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    transcribed: 0,
    pending: 0,
    totalMinutes: 0
  })

  // Fetch audio data
  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        // Simulate API calls
        setStats({
          total: 89,
          transcribed: 76,
          pending: 13,
          totalMinutes: 456
        })

        setRecordings([
          {
            id: '1',
            title: 'Client Meeting - Q1 Planning',
            duration: 1800,
            uploadDate: new Date('2024-01-15T10:30:00'),
            processed: true,
            transcript: 'Full transcript of the client meeting discussing Q1 planning...',
            extractedData: {
              summary: 'Client discussed Q1 objectives and budget allocations',
              actionItems: ['Send proposal by Jan 20', 'Schedule follow-up call', 'Review technical requirements'],
              keyTopics: ['Budget', 'Timeline', 'Technical requirements', 'Team structure'],
              participants: ['John Smith (Client)', 'Sarah Johnson (PM)', 'Mike Chen (Tech Lead)']
            },
            tags: ['client', 'planning', 'q1', 'meeting']
          },
          {
            id: '2',
            title: 'Team Standup - Project Alpha',
            duration: 300,
            uploadDate: new Date('2024-01-15T09:00:00'),
            processed: true,
            extractedData: {
              summary: 'Daily standup discussing progress on Project Alpha',
              actionItems: ['Fix authentication bug', 'Update documentation', 'Prepare demo for client'],
              keyTopics: ['Development progress', 'Blockers', 'Timeline'],
              participants: ['Development Team']
            },
            tags: ['standup', 'project-alpha', 'team']
          },
          {
            id: '3',
            title: 'Sales Call - New Prospect',
            duration: 2400,
            uploadDate: new Date('2024-01-14T14:15:00'),
            processed: true,
            extractedData: {
              summary: 'Initial sales call with enterprise prospect interested in AI solutions',
              actionItems: ['Send pricing proposal', 'Schedule technical demo', 'Prepare case studies'],
              keyTopics: ['AI solutions', 'Pricing', 'Integration', 'Timeline'],
              participants: ['Sales Team', 'Prospect Representative']
            },
            tags: ['sales', 'prospect', 'ai-solutions']
          },
          {
            id: '4',
            title: 'Interview - Senior Developer',
            duration: 3600,
            uploadDate: new Date('2024-01-13T11:00:00'),
            processed: false,
            tags: ['interview', 'hiring', 'developer']
          }
        ])
      } catch (error) {
        console.error('Failed to fetch audio data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAudioData()
  }, [])

  // Handle recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    try {
      // Simulate upload processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      const newRecordings = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        title: file.name,
        duration: 0, // Will be determined by processing
        uploadDate: new Date(),
        processed: false,
        tags: []
      }))

      setRecordings([...newRecordings, ...recordings])
    } catch (error) {
      console.error('Failed to upload files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins < 60) return `${mins}m ${secs}s`
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
  }

  // Filter recordings
  const filteredRecordings = recordings.filter(recording => {
    const matchesFilter = filter === 'all' || (filter === 'transcribed' && recording.processed) || (filter === 'pending' && !recording.processed)
    const matchesSearch = searchQuery === '' ||
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

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
            background: 'linear-gradient(135deg, #fff, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Audio AI
          </h1>
          <p style={{ color: '#9ca3af' }}>
            AI-powered audio transcription and analysis
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setIsRecording(!isRecording)}
            style={{
              padding: '0.75rem 1.5rem',
              background: isRecording ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
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
            {isRecording ? '⏹️' : '🎙️'}
            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>

          <label style={{
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
            📁
            <span>Upload Audio</span>
            <input
              type="file"
              multiple
              accept=".mp3,.wav,.m4a,.ogg"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Recording Interface */}
      {isRecording && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            animation: 'pulse 2s infinite'
          }}>
            🎙️
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Recording in Progress
          </h2>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>
            {formatTime(recordingTime)}
          </div>
          <p style={{ color: '#9ca3af' }}>
            Click "Stop Recording" to end and process the audio
          </p>
        </div>
      )}

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
            <span style={{ fontSize: '1.5rem' }}>🎙️</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Total Recordings</div>
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.transcribed}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Transcribed</div>
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
            <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>⏰</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalMinutes}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Minutes Transcribed</div>
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
            {['all', 'transcribed', 'pending'].map((filterOption) => (
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
                    ? 'linear-gradient(135deg, #10b981, #059669)'
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
            placeholder="Search recordings..."
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
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            📤 Uploading and transcribing audio...
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            AI is processing your audio files. This may take a few minutes.
          </div>
        </div>
      )}

      {/* Recordings Grid */}
      {filteredRecordings.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1rem'
        }}>
          {filteredRecordings.map((recording) => (
            <div
              key={recording.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: recording.processed ? '4px solid #10b981' : '4px solid #f59e0b'
              }}
              onClick={() => setSelectedRecording(recording)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  🎙️
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
                    {recording.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {formatDuration(recording.duration)} • {recording.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  background: recording.processed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: recording.processed ? '#10b981' : '#f59e0b'
                }}>
                  {recording.processed ? 'Transcribed' : 'Processing'}
                </span>
              </div>

              {recording.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {recording.tags.map((tag, index) => (
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

              {recording.extractedData && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    🤖 AI Analysis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                    {recording.extractedData.summary}
                  </div>
                  {recording.extractedData.actionItems.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        Action Items:
                      </div>
                      {recording.extractedData.actionItems.map((item, index) => (
                        <div key={index} style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  )}
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎙️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            No audio recordings found
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'Start recording or upload audio files to see AI-powered transcription.'
            }
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsRecording(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
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
              🎙️ Start Recording
            </button>
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
              📁 Upload Audio
              <input
                type="file"
                multiple
                accept=".mp3,.wav,.m4a,.ogg"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}