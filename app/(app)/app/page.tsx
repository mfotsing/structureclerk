'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  FileText,
  Mic,
  DollarSign,
  Send,
  BarChart3,
  Clock,
  Upload,
  Plus,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import UsageMeters from '@/components/ui/UsageMeters';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import type { SearchResult } from '@/types/search';
import Link from 'next/link';

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
  const t = useTranslations('app.dashboard');
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

  // Search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const statsResponse = await fetch('/api/user/stats');
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data);
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/user/activity');
        if (activityResponse.ok) {
          const data = await activityResponse.json();
          setRecentActivity(data);
        }

        // Fetch usage data
        const usageResponse = await fetch('/api/stripe/customer-portal');
        if (usageResponse.ok) {
          const data = await usageResponse.json();
          setCurrentUsage(data.currentUsage);
          setUserPlan(data.plan.toLowerCase());
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Search handlers
  const handleSearch = async (response: any) => {
    setSearchResults(response.results);
    setSearchQuery(response.query);
    setShowSearchResults(true);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    // Handle navigation to the result
    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const handleResultAction = (result: SearchResult, action: string) => {
    console.log('Action clicked:', action, 'for result:', result);
    // Handle different actions based on type
    switch (action) {
      case 'open':
        if (result.url) window.open(result.url, '_blank');
        break;
      case 'summarize':
        // Navigate to summary view
        break;
      case 'share':
        // Open share dialog
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const quickActions = [
    {
      id: 'upload',
      title: t('upload_document'),
      description: 'Upload and process documents with AI',
      icon: Upload,
      href: '/app/documents',
      color: 'blue',
    },
    {
      id: 'record',
      title: t('record_audio'),
      description: 'Record and transcribe audio',
      icon: Mic,
      href: '/app/audio',
      color: 'green',
    },
    {
      id: 'invoice',
      title: t('create_invoice'),
      description: 'Generate and send invoices',
      icon: DollarSign,
      href: '/app/invoices',
      color: 'purple',
    },
    {
      id: 'followup',
      title: t('send_followup'),
      description: 'Send automated follow-ups',
      icon: Send,
      href: '/app/automations',
      color: 'orange',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'audio': return Mic;
      case 'task': return CheckCircle;
      case 'invoice': return DollarSign;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card p-6 rounded-lg border">
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header with Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            {t('welcome')}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Global Search Bar */}
        <SearchBar
          userId="demo-user" // In production, get from auth context
          onResultClick={handleResultClick}
          onSearch={handleSearch}
          placeholder="Search documents, emails, invoices, projects..."
          className="max-w-2xl"
        />
      </motion.div>

      {/* Search Results */}
      {showSearchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for "{searchQuery}"
            </h2>
            <button
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear Search
            </button>
          </div>

          <SearchResults
            results={searchResults}
            query={searchQuery}
            onResultClick={handleResultClick}
            onResultAction={handleResultAction}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          />
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-brand-blue" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.documentsProcessed}</div>
          <div className="text-sm text-muted-foreground">Documents Processed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-brand-green" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.audioMinutesTranscribed}</div>
          <div className="text-sm text-muted-foreground">Minutes Transcribed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-brand-purple" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.tasksCreated}</div>
          <div className="text-sm text-muted-foreground">Tasks Created</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card p-6 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <Send className="h-8 w-8 text-brand-orange" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.emailsSent}</div>
          <div className="text-sm text-muted-foreground">Emails Sent</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-blue" />
            {t('quick_actions')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group bg-card p-6 rounded-lg border hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${action.color}-10 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-20 transition-colors`}>
                      <Icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Usage Meters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <UsageMeters
            currentUsage={currentUsage}
            plan={userPlan}
          />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-blue" />
          {t('recent_activity')}
        </h2>

        {recentActivity.length > 0 ? (
          <div className="bg-card rounded-lg border">
            <div className="divide-y">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{activity.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {recentActivity.length > 0 && (
              <div className="p-4 border-t">
                <Link
                  href="/app/activity"
                  className="text-sm text-brand-blue hover:text-brand-blue-dark font-medium"
                >
                  View all activity →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-12 rounded-lg border text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
            <p className="text-muted-foreground mb-6">
              Get started by uploading your first document or recording audio.
            </p>
            <Link
              href="/app/documents"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}