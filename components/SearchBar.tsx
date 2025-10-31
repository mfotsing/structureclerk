'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Loader2, X, Bot, Clock, TrendingUp } from 'lucide-react';
import { clerkSearch, useClerkSearch } from '@/lib/ai/search-engine';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  userId: string;
  onResultClick?: (result: any) => void;
  onSearch?: (response: any) => void;
  placeholder?: string;
  className?: string;
  showShortcuts?: boolean;
}

const exampleQueries = [
  'facture Bell mars 2022',
  'contrat signé avec Hugo Tremblay',
  'montant total abonnements 2023',
  'emails client XYZ',
  'réunion projet alpha',
  'dernière facture impayée',
  'documents fiscaux 2023',
  'appels avec client ABC',
];

export default function SearchBar({
  userId,
  onResultClick,
  placeholder,
  className = '',
  showShortcuts = true
}: SearchBarProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { search, isLoading, results, error } = useClerkSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('clerk-search-recent');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get suggestions with debouncing
  const getSuggestions = useCallback(async (partialQuery: string) => {
    if (partialQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsTyping(true);
    try {
      const results = await clerkSearch.getSuggestions(partialQuery, userId, language);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsTyping(false);
    }
  }, [userId, language]);

  // Handle query change
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowExamples(false);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      getSuggestions(value);
    }, 300);
  };

  // Handle search
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('clerk-search-recent', JSON.stringify(newRecentSearches));

    try {
      const response = await search(searchQuery, userId, { language });
      setSuggestions([]);

      // Note: onSearch callback temporarily disabled for build
      // TODO: Fix onSearch callback after build issues are resolved
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Handle key down in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSearch(suggestions[0]);
      } else {
        handleSearch();
      }
    }
  };

  // Handle example click
  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
    handleSearch(example);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  const displayPlaceholder = placeholder || t('searchDemo.placeholder') ||
    (language === 'fr' ? 'Rechercher des documents, emails, factures...' : 'Search documents, emails, invoices...');

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            transition-all duration-300
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-400' : 'hover:bg-white/15'}
            ${isLoading ? 'border-blue-400' : ''}
          `}
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={displayPlaceholder}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-3 px-4 pr-20"
          />

          <div className="flex items-center space-x-2 pr-4">
            {showShortcuts && (
              <div className="hidden md:flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg">
                <Command className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">K</span>
              </div>
            )}

            {isLoading ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : query ? (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {(isOpen || isLoading || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-6 text-center">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  {language === 'fr' ? 'Recherche en cours...' : 'Searching...'}
                </p>
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Suggestions' : 'Suggestions'}
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading && !query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{language === 'fr' ? 'Recherches récentes' : 'Recent searches'}</span>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Example Queries */}
            {!isLoading && !query && showExamples && (
              <div className="p-2">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>{language === 'fr' ? 'Essayez ces exemples' : 'Try these examples'}</span>
                </div>
                {exampleQueries.slice(0, 5).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                    <span>{example}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Résultats' : 'Results'}
                </div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => onResultClick?.(result)}
                    className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {result.type === 'document' && '📄'}
                        {result.type === 'email' && '📧'}
                        {result.type === 'invoice' && '🧾'}
                        {result.type === 'audio' && '🎙️'}
                        {result.type === 'project' && '📁'}
                        {result.type === 'client' && '👤'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {result.content.substring(0, 100)}...
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">
                            {language === 'fr' ? result.type : result.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(result.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && results.length === 0 && suggestions.length === 0 && query.length >= 2 && (
              <div className="p-6 text-center">
                <Bot className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  {language === 'fr'
                    ? 'Aucun résultat trouvé. Essayez une autre recherche.'
                    : 'No results found. Try another search.'
                  }
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}