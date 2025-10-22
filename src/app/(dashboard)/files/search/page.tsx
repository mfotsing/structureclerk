'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  FileText, 
  Image, 
  FileSpreadsheet,
  Calendar,
  Tag,
  User,
  Folder,
  Download,
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  X,
  ChevronDown,
  Plus
} from 'lucide-react';

interface DocumentFile {
  id: string;
  name: string;
  file_size: number;
  mime_type: string;
  category: string;
  type_detecte: string;
  ai_summary: string;
  ai_metadata: any;
  ai_confidence: number;
  created_at: string;
  file_path: string;
  project_id?: string;
  project_name?: string;
  client_id?: string;
  client_name?: string;
  content_text?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  type: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  confidence: number;
  hasContent: boolean;
  projects: string[];
  clients: string[];
}

interface SearchStats {
  totalDocuments: number;
  searchableDocuments: number;
  averageConfidence: number;
  topCategories: Array<{ category: string; count: number }>;
  topTypes: Array<{ type: string; count: number }>;
  recentSearches: Array<{ query: string; timestamp: string }>;
}

export default function AdvancedSearchPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; timestamp: string }>>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    type: 'all',
    dateRange: 'all',
    confidence: 0,
    hasContent: false,
    projects: [],
    clients: []
  });
  
  const [results, setResults] = useState<DocumentFile[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  
  const supabase = createClient();

  // Load initial data
  useEffect(() => {
    loadDocuments();
    loadProjects();
    loadClients();
    loadStats();
    loadSearchHistory();
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: docs } = await supabase
        .from('documents')
        .select(`
          *,
          projects(name),
          clients(name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      setDocuments(docs || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }, [supabase]);

  const loadProjects = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', profile.organization_id)
        .order('name', { ascending: true });

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [supabase]);

  const loadClients = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, name')
        .eq('organization_id', profile.organization_id)
        .order('name', { ascending: true });

      setClients(clientsData || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }, [supabase]);

  const loadStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Calculate stats from documents
      const totalDocuments = documents.length;
      const searchableDocuments = documents.filter(doc => 
        doc.ai_summary || doc.content_text || (doc.ai_metadata && Object.keys(doc.ai_metadata).length > 0)
      ).length;
      
      const averageConfidence = documents.length > 0 
        ? documents.reduce((sum, doc) => sum + (doc.ai_confidence || 0), 0) / documents.length 
        : 0;

      // Count categories
      const categoryCounts: Record<string, number> = {};
      documents.forEach(doc => {
        if (doc.category) {
          categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
        }
      });
      
      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Count types
      const typeCounts: Record<string, number> = {};
      documents.forEach(doc => {
        if (doc.type_detecte) {
          typeCounts[doc.type_detecte] = (typeCounts[doc.type_detecte] || 0) + 1;
        }
      });
      
      const topTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalDocuments,
        searchableDocuments,
        averageConfidence,
        topCategories,
        topTypes,
        recentSearches: searchHistory
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [documents, searchHistory]);

  const loadSearchHistory = useCallback(() => {
    // Load from localStorage
    try {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  const saveSearchHistory = useCallback((query: string) => {
    try {
      const newEntry = { query, timestamp: new Date().toISOString() };
      const updatedHistory = [newEntry, ...searchHistory.slice(0, 9)]; // Keep last 10
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [searchHistory]);

  const performSearch = useCallback(async (page = 1) => {
    if (!filters.query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setSearching(true);
    
    try {
      // Save to search history
      saveSearchHistory(filters.query);

      // Filter documents based on search criteria
      let filteredDocs = [...documents];

      // Text search
      const searchText = filters.query.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => {
        const nameMatch = doc.name.toLowerCase().includes(searchText);
        const summaryMatch = doc.ai_summary?.toLowerCase().includes(searchText);
        const contentMatch = doc.content_text?.toLowerCase().includes(searchText);
        const metadataMatch = doc.ai_metadata ? 
          Object.values(doc.ai_metadata).some(value => 
            String(value).toLowerCase().includes(searchText)
          ) : false;
        
        return nameMatch || summaryMatch || contentMatch || metadataMatch;
      });

      // Category filter
      if (filters.category !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.category === filters.category);
      }

      // Type filter
      if (filters.type !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.type_detecte === filters.type);
      }

      // Confidence filter
      if (filters.confidence > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          (doc.ai_confidence || 0) >= filters.confidence
        );
      }

      // Content filter
      if (filters.hasContent) {
        filteredDocs = filteredDocs.filter(doc => 
          doc.ai_summary || doc.content_text
        );
      }

      // Project filter
      if (filters.projects.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.projects.includes(doc.project_id || '')
        );
      }

      // Client filter
      if (filters.clients.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.clients.includes(doc.client_id || '')
        );
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;

        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        filteredDocs = filteredDocs.filter(doc => 
          new Date(doc.created_at) >= startDate
        );
      }

      // Sort by relevance (simple implementation)
      filteredDocs.sort((a, b) => {
        // Exact name match first
        const aExact = a.name.toLowerCase() === searchText;
        const bExact = b.name.toLowerCase() === searchText;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by confidence
        return (b.ai_confidence || 0) - (a.ai_confidence || 0);
      });

      setTotalResults(filteredDocs.length);
      
      // Pagination
      const startIndex = (page - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      const paginatedResults = filteredDocs.slice(startIndex, endIndex);
      
      setResults(paginatedResults);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setSearching(false);
    }
  }, [filters, documents, resultsPerPage, saveSearchHistory]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    performSearch(1);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      type: 'all',
      dateRange: 'all',
      confidence: 0,
      hasContent: false,
      projects: [],
      clients: []
    });
    setResults([]);
    setTotalResults(0);
  };

  const handlePageChange = (page: number) => {
    performSearch(page);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
        : part
    );
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Recherche Avancée</h1>
          <p className="text-ui-text-muted mt-1">Trouvez n'importe quel document en quelques secondes</p>
        </div>
      </div>

      {/* Search Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Documents totaux</p>
                  <p className="text-2xl font-bold text-ui-text">{stats.totalDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Consultables</p>
                  <p className="text-2xl font-bold text-green-600">{stats.searchableDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Confiance IA moyenne</p>
                  <p className="text-2xl font-bold text-ui-text">{Math.round(stats.averageConfidence * 100)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Recherches récentes</p>
                  <p className="text-2xl font-bold text-ui-text">{stats.recentSearches.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Interface */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          {/* Main Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher par nom, contenu, métadonnées..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={searching || !filters.query.trim()}
              className="flex items-center gap-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Rechercher
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Effacer
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="invoice">Facture</option>
                    <option value="quote">Devis</option>
                    <option value="contract">Contrat</option>
                    <option value="plan">Plan</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type détecté
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <option value="all">Tous les types</option>
                    <option value="invoice">Facture</option>
                    <option value="quote">Devis</option>
                    <option value="receipt">Reçu</option>
                    <option value="contract">Contrat</option>
                    <option value="plan">Plan</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>

                {/* Confidence Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confiance IA minimale: {Math.round(filters.confidence * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.confidence}
                    onChange={(e) => handleFilterChange('confidence', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Content Filter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasContent"
                    checked={filters.hasContent}
                    onChange={(e) => handleFilterChange('hasContent', e.target.checked)}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <label htmlFor="hasContent" className="ml-2 text-sm text-gray-700">
                    Avec contenu consultable
                  </label>
                </div>
              </div>

              {/* Projects and Clients Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Projects Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projets
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {projects.map(project => (
                      <div key={project.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`project-${project.id}`}
                          checked={filters.projects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('projects', [...filters.projects, project.id]);
                            } else {
                              handleFilterChange('projects', filters.projects.filter(id => id !== project.id));
                            }
                          }}
                          className="w-4 h-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                        />
                        <label htmlFor={`project-${project.id}`} className="ml-2 text-sm text-gray-700">
                          {project.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clients Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clients
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {clients.map(client => (
                      <div key={client.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`client-${client.id}`}
                          checked={filters.clients.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('clients', [...filters.clients, client.id]);
                            } else {
                              handleFilterChange('clients', filters.clients.filter(id => id !== client.id));
                            }
                          }}
                          className="w-4 h-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                        />
                        <label htmlFor={`client-${client.id}`} className="ml-2 text-sm text-gray-700">
                          {client.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Recherches récentes</h3>
                <button
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem('searchHistory');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Effacer l'historique
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleFilterChange('query', search.query);
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {totalResults > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''} pour "{filters.query}"
          </p>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((doc) => (
            <Card key={doc.id} variant="default" padding="lg" className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.mime_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {highlightText(doc.name, filters.query)}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(doc.created_at)}
                          </span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          {doc.type_detecte && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {doc.type_detecte}
                            </span>
                          )}
                          {doc.ai_confidence && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {Math.round(doc.ai_confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {doc.ai_summary && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          {highlightText(doc.ai_summary, filters.query)}
                        </p>
                      </div>
                    )}

                    {doc.project_name && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-brand-orange/10 text-brand-orange rounded-full">
                          Projet: {doc.project_name}
                        </span>
                      </div>
                    )}

                    {doc.client_name && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Client: {doc.client_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded ${
                      currentPage === page
                        ? 'bg-brand-orange text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      ) : filters.query ? (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier votre recherche ou d'ajuster les filtres
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Effacer les filtres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Commencez votre recherche
            </h3>
            <p className="text-gray-600">
              Entrez un mot-clé pour rechercher dans vos documents
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}