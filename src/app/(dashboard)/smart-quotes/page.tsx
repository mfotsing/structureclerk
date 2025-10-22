'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  DollarSign,
  Calendar,
  User,
  Mail,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Smartphone,
  Mic,
  Camera,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface SmartQuote {
  id: string;
  user_id: string;
  client_name: string;
  project_address: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  logo_url?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sent_at?: string;
  pdf_url?: string;
  users?: {
    first_name: string;
    last_name: string;
    email: string;
    organizations?: {
      name: string;
      hourly_rate?: number;
      price_per_meter?: number;
      logo_url?: string;
    };
  };
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  unit: string;
  type: 'labor' | 'material' | 'equipment' | 'other';
}

interface QuoteStats {
  totalQuotes: number;
  totalAmount: number;
  thisMonthQuotes: number;
  thisMonthAmount: number;
  draftQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  averageQuoteValue: number;
  conversionRate: number;
}

export default function SmartQuotesPage() {
  const [quotes, setQuotes] = useState<SmartQuote[]>([]);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const supabase = createClient();

  const loadQuotes = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: quotesData } = await supabase
        .from('smart_quotes')
        .select(`
          *,
          users(
            first_name,
            last_name,
            email,
            organizations(
              name,
              hourly_rate,
              price_per_meter,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setQuotes(quotesData || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const loadStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate stats from quotes
      const totalQuotes = quotes.length;
      const totalAmount = quotes.reduce((sum, quote) => sum + quote.total, 0);
      
      // This month stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthQuotes = quotes.filter(quote => 
        new Date(quote.created_at) >= monthStart
      ).length;
      
      const thisMonthAmount = quotes
        .filter(quote => new Date(quote.created_at) >= monthStart)
        .reduce((sum, quote) => sum + quote.total, 0);

      // Status counts
      const draftQuotes = quotes.filter(quote => quote.status === 'draft').length;
      const sentQuotes = quotes.filter(quote => quote.status === 'sent').length;
      const acceptedQuotes = quotes.filter(quote => quote.status === 'accepted').length;
      
      // Average quote value
      const averageQuoteValue = totalQuotes > 0 ? totalAmount / totalQuotes : 0;
      
      // Conversion rate
      const conversionRate = sentQuotes > 0 ? (acceptedQuotes / sentQuotes) * 100 : 0;

      setStats({
        totalQuotes,
        totalAmount,
        thisMonthQuotes,
        thisMonthAmount,
        draftQuotes,
        sentQuotes,
        acceptedQuotes,
        averageQuoteValue,
        conversionRate
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [quotes]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  useEffect(() => {
    if (quotes.length > 0) {
      loadStats();
    }
  }, [quotes, loadStats]);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchTerm === '' || 
      quote.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.project_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
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
      
      matchesDate = new Date(quote.created_at) >= startDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('smart_quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;

      await loadQuotes();
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      alert(error.message || 'Erreur lors de la suppression du devis');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      sent: <Send className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <AlertCircle className="w-4 h-4" />,
    };

    return icons[status as keyof typeof icons] || icons.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyé',
      accepted: 'Accepté',
      rejected: 'Rejeté',
    };

    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Mes Devis Intelligents</h1>
          <p className="text-ui-text-muted mt-1">Créez des devis professionnels en quelques minutes</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/smart-quotes/create">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer un nouveau devis
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Devis totaux</p>
                  <p className="text-2xl font-bold text-ui-text">{stats.totalQuotes}</p>
                  <p className="text-xs text-ui-success mt-1">
                    {stats.thisMonthQuotes} ce mois
                  </p>
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
                  <p className="text-sm text-ui-text-muted">Valeur totale</p>
                  <p className="text-2xl font-bold text-ui-text">{formatCurrency(stats.totalAmount)}</p>
                  <p className="text-xs text-ui-success mt-1">
                    {formatCurrency(stats.thisMonthAmount)} ce mois
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Taux de conversion</p>
                  <p className="text-2xl font-bold text-ui-text">{stats.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    {stats.acceptedQuotes}/{stats.sentQuotes} acceptés
                  </p>
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
                  <p className="text-sm text-ui-text-muted">Valeur moyenne</p>
                  <p className="text-2xl font-bold text-ui-text">{formatCurrency(stats.averageQuoteValue)}</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    Par devis
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client, adresse ou élément..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillons</option>
                <option value="sent">Envoyés</option>
                <option value="accepted">Acceptés</option>
                <option value="rejected">Rejetés</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      {!quotes || quotes.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun devis
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier devis intelligent en quelques minutes
            </p>
            <Link href="/smart-quotes/create">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Créer un nouveau devis
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                        {quote.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quote.client_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quote.users?.organizations?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.project_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(quote.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 justify-center ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/smart-quotes/${quote.id}`}>
                        <Eye className="w-4 h-4 text-blue-600 hover:text-blue-900" />
                      </Link>
                      <Link href={`/smart-quotes/${quote.id}/edit`}>
                        <Edit className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                      </Link>
                      {quote.pdf_url && (
                        <a
                          href={quote.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}