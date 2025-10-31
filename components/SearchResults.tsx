'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Mail, Receipt, Mic, Folder, User, ExternalLink, Share2, Download, Reply, ArrowRight, Star, Calendar, TrendingUp } from 'lucide-react';
import type { SearchResult } from '@/types/search';
import { clerkSearch } from '@/lib/ai/search-engine';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  onResultAction?: (result: SearchResult, action: string) => void;
  className?: string;
}

export default function SearchResults({
  results,
  query,
  isLoading = false,
  onResultClick,
  onResultAction,
  className = ''
}: SearchResultsProps) {
  const { t, language } = useLanguage();
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);

  // Get icon and color for result type
  const getResultTypeInfo = (type: string) => {
    const typeMap = {
      document: {
        icon: FileText,
        color: 'blue',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        label: language === 'fr' ? 'Document' : 'Document'
      },
      email: {
        icon: Mail,
        color: 'purple',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30',
        label: language === 'fr' ? 'Email' : 'Email'
      },
      invoice: {
        icon: Receipt,
        color: 'green',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        label: language === 'fr' ? 'Facture' : 'Invoice'
      },
      audio: {
        icon: Mic,
        color: 'red',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        label: language === 'fr' ? 'Audio' : 'Audio'
      },
      project: {
        icon: Folder,
        color: 'orange',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        label: language === 'fr' ? 'Projet' : 'Project'
      },
      client: {
        icon: User,
        color: 'indigo',
        bgColor: 'bg-indigo-500/20',
        borderColor: 'border-indigo-500/30',
        label: language === 'fr' ? 'Client' : 'Client'
      }
    };

    return typeMap[type as keyof typeof typeMap] || typeMap.document;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return language === 'fr' ? 'Hier' : 'Yesterday';
    if (diffDays < 7) return `${diffDays} ${language === 'fr' ? 'jours' : 'days'} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${language === 'fr' ? 'semaines' : 'weeks'} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ${language === 'fr' ? 'mois' : 'months'} ago`;
    return `${Math.floor(diffDays / 365)} ${language === 'fr' ? 'années' : 'years'} ago`;
  };

  // Get action buttons for result type
  const getResultActions = (result: SearchResult) => {
    const typeInfo = clerkSearch.formatResult(result, language);
    return typeInfo.actions;
  };

  // Handle result action
  const handleAction = (result: SearchResult, action: string) => {
    onResultAction?.(result, action);
  };

  // Get confidence score color
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-400">
          {language === 'fr' ? 'Recherche en cours...' : 'Searching...'}
        </p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <Search className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {language === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
        </h3>
        <p className="text-gray-400 max-w-md">
          {language === 'fr'
            ? `Nous n'avons trouvé aucun résultat pour "${query}". Essayez d'autres mots-clés ou modifiez votre recherche.`
            : `We couldn't find any results for "${query}". Try different keywords or modify your search.`
          }
        </p>
      </div>
    );
  }

  if (results.length === 0 && !query) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <Search className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {language === 'fr' ? 'Commencez votre recherche' : 'Start your search'}
        </h3>
        <p className="text-gray-400 max-w-md">
          {language === 'fr'
            ? 'Utilisez la barre de recherche ci-dessus pour trouver des documents, emails, factures et bien plus.'
            : 'Use the search bar above to find documents, emails, invoices and more.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">
            {language === 'fr' ? 'Résultats de recherche' : 'Search Results'}
          </h2>
          {query && (
            <span className="text-gray-400">
              {language === 'fr' ? 'pour' : 'for'} "{query}"
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>{results.length} {language === 'fr' ? 'résultats' : 'results'}</span>
        </div>
      </div>

      {/* Results List */}
      <AnimatePresence mode="popLayout">
        {results.map((result, index) => {
          const typeInfo = getResultTypeInfo(result.type);
          const Icon = typeInfo.icon;
          const actions = getResultActions(result);

          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`
                relative group bg-white/5 backdrop-blur-xl border rounded-2xl p-6
                transition-all duration-300 cursor-pointer
                ${typeInfo.borderColor}
                ${hoveredResult === result.id ? 'bg-white/10 scale-[1.02] shadow-xl' : 'hover:bg-white/10'}
              `}
              onMouseEnter={() => setHoveredResult(result.id)}
              onMouseLeave={() => setHoveredResult(null)}
              onClick={() => onResultClick?.(result)}
            >
              {/* Result Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Type Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${typeInfo.bgColor}
                  `}>
                    <Icon className={`w-6 h-6 text-${typeInfo.color}-400`} />
                  </div>

                  {/* Title and Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {result.title}
                      </h3>
                      <span className={`
                        px-2 py-1 text-xs rounded-lg font-medium
                        ${typeInfo.bgColor} text-${typeInfo.color}-300
                      `}>
                        {typeInfo.label}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(result.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span className={getConfidenceColor(result.confidence_score)}>
                          {Math.round(result.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Score Badge */}
                <div className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${result.confidence_score >= 0.8 ? 'bg-green-500/20 text-green-400' :
                    result.confidence_score >= 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'}
                `}>
                  {Math.round(result.confidence_score * 100)}% match
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">
                  {result.content.length > 200
                    ? `${result.content.substring(0, 200)}...`
                    : result.content
                  }
                </p>

                {/* Highlights */}
                {result.highlights && result.highlights.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {result.highlights.map((highlight, highlightIndex) => (
                      <div
                        key={highlightIndex}
                        className="text-sm text-gray-400 bg-white/5 rounded-lg p-2 border-l-2 border-blue-500/30"
                      >
                        <span className="text-blue-400">→</span> {highlight}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {actions.slice(0, 3).map((action, actionIndex) => (
                    <motion.button
                      key={actionIndex}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(result, action.action);
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium
                        bg-white/10 text-white hover:bg-white/20
                        transition-all duration-200 flex items-center space-x-1
                      `}
                      title={action.label}
                    >
                      <span>{action.icon}</span>
                      <span className="hidden sm:inline">{action.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  {result.url && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(result.url, '_blank');
                      }}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                      title={language === 'fr' ? 'Ouvrir dans un nouvel onglet' : 'Open in new tab'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 rounded-2xl pointer-events-none
                bg-gradient-to-r from-blue-500/5 to-purple-500/5
                ${hoveredResult === result.id ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-300
              `} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Load More Button */}
      {results.length >= 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-semibold text-white hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>{language === 'fr' ? 'Charger plus de résultats' : 'Load more results'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}