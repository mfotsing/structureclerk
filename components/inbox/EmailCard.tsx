'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, DollarSign, FileText, Star, Trash2, Archive, Reply, Forward, AlertCircle, CheckCircle, Clock, User, Paperclip, ChevronRight } from 'lucide-react';
import { Email } from '@/lib/email/types';

interface EmailCardProps {
  email: Email;
  onSelect: (email: Email) => void;
  onAction: (emailId: string, action: string) => void;
  isSelected?: boolean;
}

export default function EmailCard({ email, onSelect, onAction, isSelected = false }: EmailCardProps) {
  const [showActions, setShowActions] = useState(false);

  // Get category icon and color
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      invoice: {
        icon: DollarSign,
        color: 'green',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        label: 'Invoice'
      },
      contract: {
        icon: FileText,
        color: 'orange',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        label: 'Contract'
      },
      important: {
        icon: Star,
        color: 'purple',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30',
        label: 'Important'
      },
      urgent: {
        icon: AlertCircle,
        color: 'red',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        label: 'Urgent'
      },
      newsletter: {
        icon: Mail,
        color: 'blue',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        label: 'Newsletter'
      },
      personal: {
        icon: User,
        color: 'indigo',
        bgColor: 'bg-indigo-500/20',
        borderColor: 'border-indigo-500/30',
        label: 'Personal'
      }
    };

    return categoryMap[category as keyof typeof categoryMap] || categoryMap.personal;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'text-gray-500';
      case 'unread': return 'text-blue-500';
      case 'processed': return 'text-green-500';
      case 'archived': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  // Handle action click
  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(email.id, action);
  };

  // Handle email click
  const handleEmailClick = () => {
    onSelect(email);
  };

  const categoryInfo = getCategoryInfo(email.category);
  const CategoryIcon = categoryInfo.icon;

  return (
    <motion.div
      className={`
        relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer
        transition-all duration-300
        ${categoryInfo.borderColor}
        ${isSelected ? 'bg-white/15 scale-[1.02] shadow-xl' : 'hover:bg-white/10'}
        ${email.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}
      `}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleEmailClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Email Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Sender Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {email.sender.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Email Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h3 className={`font-semibold text-white truncate ${
                  email.status === 'unread' ? 'font-bold' : ''
                }`}>
                  {email.sender}
                </h3>
                <span className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${categoryInfo.bgColor} text-${categoryInfo.color}-300
                `}>
                  {categoryInfo.label}
                </span>
                {email.priority === 'high' && (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {formatDate(email.date)}
                </span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(email.status)}`} />
              </div>
            </div>

            <h4 className={`text-white mb-2 ${
              email.status === 'unread' ? 'font-semibold' : 'font-normal'
            }`}>
              {email.subject}
            </h4>

            <p className="text-gray-300 leading-relaxed mb-3 line-clamp-2">
              {email.content}
            </p>

            {/* AI Insights */}
            {email.aiInsights && (
              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-400 font-medium">AI Insights</span>
                </div>
                <div className="space-y-1">
                  {email.aiInsights.amount && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      <span className="text-gray-300">Amount: ${email.aiInsights.amount}</span>
                    </div>
                  )}
                  {email.aiInsights.dueDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-3 h-3 text-yellow-400" />
                      <span className="text-gray-300">Due: {email.aiInsights.dueDate}</span>
                    </div>
                  )}
                  {email.aiInsights.actionItems && email.aiInsights.actionItems.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                      <span className="text-gray-300">
                        {email.aiInsights.actionItems.length} action items
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Paperclip className="w-4 h-4" />
                <span>{email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-end space-y-2">
          {email.status === 'unread' && (
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
          )}
          {email.isProcessed && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between pt-4 border-t border-white/10"
          >
            <div className="flex items-center space-x-2">
              {email.aiInsights?.suggestedActions && email.aiInsights.suggestedActions.slice(0, 3).map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleAction(action.type, e)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium
                    bg-white/10 text-white hover:bg-white/20
                    transition-all duration-200 flex items-center space-x-1
                  `}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAction('reply', e)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Reply"
              >
                <Reply className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAction('archive', e)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAction('delete', e)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-red-500/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4"
        >
          <ChevronRight className="w-5 h-5 text-blue-400" />
        </motion.div>
      )}
    </motion.div>
  );
}