'use client'

import { useState, useEffect } from 'react'
import BusinessDashboard from '@/components/analytics/BusinessDashboard'

interface DashboardStats {
  documentsProcessed: number;
  audioMinutesTranscribed: number;
  tasksCreated: number;
  emailsSent: number;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'audio' | 'task' | 'invoice';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'processing' | 'pending';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    documentsProcessed: 0,
    audioMinutesTranscribed: 0,
    tasksCreated: 0,
    emailsSent: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [currentUsage, setCurrentUsage] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls
        setStats({
          documentsProcessed: 1247,
          audioMinutesTranscribed: 456,
          tasksCreated: 89,
          emailsSent: 234,
        })

        setRecentActivity([
          {
            id: '1',
            type: 'document',
            title: 'Contract Review - Project Alpha',
            description: 'AI analysis complete. Key terms identified and flagged for review.',
            timestamp: new Date('2024-01-15T10:30:00'),
            status: 'completed'
          },
          {
            id: '2',
            type: 'audio',
            title: 'Client Meeting - Q1 Planning',
            description: '45-minute transcription with action items extracted.',
            timestamp: new Date('2024-01-15T09:15:00'),
            status: 'completed'
          },
          {
            id: '3',
            type: 'invoice',
            title: 'Invoice #2024-001',
            description: 'Generated automatically from contract terms discussion.',
            timestamp: new Date('2024-01-14T14:20:00'),
            status: 'completed'
          }
        ])

        setCurrentUsage({
          documents: 847,
          audio: 234,
          emails: 156
        })
        setUserPlan('pro')
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickActions = [
    {
      id: 'upload',
      title: 'Upload Document',
      description: 'Upload and process documents with AI',
      icon: '📄',
      href: '/app/documents',
      color: '#3b82f6',
    },
    {
      id: 'record',
      title: 'Record Audio',
      description: 'Record and transcribe audio',
      icon: '🎙️',
      href: '/app/audio',
      color: '#10b981',
    },
    {
      id: 'invoice',
      title: 'Create Invoice',
      description: 'Generate and send invoices',
      icon: '💰',
      href: '/app/invoices',
      color: '#8b5cf6',
    },
    {
      id: 'calendar',
      title: 'Manage Calendar',
      description: 'Schedule meetings and sync calendars',
      icon: '📅',
      href: '/app/calendar',
      color: '#ef4444',
    },
    {
      id: 'followup',
      title: 'Send Follow-up',
      description: 'Send automated follow-ups',
      icon: '📤',
      href: '/app/automations',
      color: '#f59e0b',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'audio': return '🎙️';
      case 'task': return '✅';
      case 'invoice': return '💰';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      case 'processing': return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case 'pending': return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      default: return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
    }
  };

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

  return <BusinessDashboard />
}