'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Inbox, Send, Calendar, DollarSign, FileText, Clock, Star, Trash2, Archive, Reply, Forward, Filter, Search, Plus, Settings, Zap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import EmailCard from '@/components/inbox/EmailCard';
import { EmailConnection, Email } from '@/lib/email/types';

// Temporary translations for inbox page (will be properly integrated later)
const useTempTranslations = () => {
  const translations = {
    inbox: {
      title: "Smart Inbox AI",
      connect: "Connect Email",
      noEmails: "No emails found",
      noEmailsDesc: "Your inbox is empty or emails are still being processed.",
      connectFirst: "Get Started",
      searchPlaceholder: "Search emails...",
      all: "All",
      invoice: "Invoice",
      contract: "Contract",
      important: "Important",
      urgent: "Urgent",
      unread: "Unread",
      processed: "Processed",
      total: "Total Emails",
      importantCount: "Important",
      invoiceCount: "Invoices",
      contractCount: "Contracts",
      aiInsights: "AI Insights",
      noConnections: "Connect Your Email Accounts",
      noConnectionsDesc: "Securely connect your email accounts to let AI detect invoices, contracts, and important business communications automatically.",
      processing: "Processing...",
      resultsFound: "results found",
      noResultsFor: `No results found for`,
      providers: [
        { id: 'gmail', name: 'Gmail', icon: '📧', description: 'Connect your Gmail account' },
        { id: 'outlook', name: 'Outlook', icon: '📨', description: 'Connect your Outlook/Office 365 account' },
        { id: 'yahoo', name: 'Yahoo Mail', icon: '📭', description: 'Connect your Yahoo Mail account' },
        { id: 'icloud', name: 'iCloud Mail', icon: '☁️', description: 'Connect your iCloud Mail account' },
        { id: 'proton', name: 'ProtonMail', icon: '🔒', description: 'Connect your ProtonMail account' },
        { id: 'imap', name: 'Custom IMAP', icon: '⚙️', description: 'Connect any IMAP email server' },
      ],
    },
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return { t };
};

interface EmailStats {
  total: number;
  unread: number;
  important: number;
  invoices: number;
  contracts: number;
}

export default function InboxPage() {
  // Use temporary translations to avoid static generation issues
  const { t } = useTempTranslations();
  const language = 'en';
  const [emails, setEmails] = useState<Email[]>([]);
  const [connections, setConnections] = useState<EmailConnection[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    unread: 0,
    important: 0,
    invoices: 0,
    contracts: 0,
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch inbox data
  useEffect(() => {
    const fetchInboxData = async () => {
      try {
        // Fetch email connections
        const connectionsResponse = await fetch('/api/email/connections');
        if (connectionsResponse.ok) {
          const data = await connectionsResponse.json();
          setConnections(data);
        }

        // Fetch emails
        const emailsResponse = await fetch('/api/emails');
        if (emailsResponse.ok) {
          const data = await emailsResponse.json();
          setEmails(data.emails || []);
          setStats(data.stats || stats);
        }
      } catch (error) {
        console.error('Failed to fetch inbox data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInboxData();
  }, []);

  // Handle email connection
  const handleConnectEmail = async (provider: string) => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/email/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect email:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle email action
  const handleEmailAction = async (emailId: string, action: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Update local state
        setEmails(emails.map(email =>
          email.id === emailId
            ? { ...email, status: action === 'archive' ? 'archived' : action === 'delete' ? 'deleted' : email.status }
            : email
        ));
      }
    } catch (error) {
      console.error('Failed to perform email action:', error);
    }
  };

  // Filter emails
  const filteredEmails = emails.filter(email => {
    const matchesFilter = filter === 'all' || email.category === filter;
    const matchesSearch = searchQuery === '' ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Email providers
  const emailProviders = [
    { id: 'gmail', name: 'Gmail', icon: '📧', description: 'Connect your Gmail account' },
    { id: 'outlook', name: 'Outlook', icon: '📨', description: 'Connect your Outlook/Office 365 account' },
    { id: 'yahoo', name: 'Yahoo Mail', icon: '📭', description: 'Connect your Yahoo Mail account' },
    { id: 'icloud', name: 'iCloud Mail', icon: '☁️', description: 'Connect your iCloud Mail account' },
    { id: 'proton', name: 'ProtonMail', icon: '🔒', description: 'Connect your ProtonMail account' },
    { id: 'imap', name: 'Custom IMAP', icon: '⚙️', description: 'Connect any IMAP email server' },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Smart Inbox AI
            </h1>
            <p className="text-gray-300">
              AI-powered email processing for invoices, contracts, and important communications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Email</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
            <div className="text-sm text-gray-300">Total Emails</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{stats.unread}</span>
            </div>
            <div className="text-sm text-gray-300">Unread</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="w-6 h-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">{stats.important}</span>
            </div>
            <div className="text-sm text-gray-300">Important</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.invoices}</span>
            </div>
            <div className="text-sm text-gray-300">Invoices</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span className="text-2xl font-bold text-white">{stats.contracts}</span>
            </div>
            <div className="text-sm text-gray-300">Contracts</div>
          </motion.div>
        </div>

        {/* No Email Connections */}
        {connections.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Connect Your Email Accounts
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Securely connect your email accounts to let AI detect invoices, contracts, and important business communications automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {emailProviders.map((provider, index) => (
                <motion.button
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleConnectEmail(provider.id)}
                  disabled={isConnecting}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">{provider.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{provider.name}</h3>
                  <p className="text-sm text-gray-400">{provider.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        {connections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                {['all', 'invoice', 'contract', 'important', 'unread'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filter === filterOption
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails..."
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Email List */}
      <AnimatePresence mode="popLayout">
        {connections.length > 0 && filteredEmails.length > 0 ? (
          <div className="space-y-4">
            {filteredEmails.map((email, index) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EmailCard
                  email={email}
                  onSelect={setSelectedEmail}
                  onAction={handleEmailAction}
                  isSelected={selectedEmail?.id === email.id}
                />
              </motion.div>
            ))}
          </div>
        ) : connections.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
          >
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No emails found
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : 'Your inbox is empty or emails are still being processed.'
              }
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}