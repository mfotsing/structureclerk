'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  FileText, 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Send,
  FileSpreadsheet,
  Image,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Download,
  Trash2
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
}

interface Quote {
  id: string;
  quote_number: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  total_amount: number;
  valid_until: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  project_id?: string;
  clients?: Client;
  pdf_url?: string;
  ai_confidence?: number;
  ai_source_document?: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  const loadQuotes = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: quotesData } = await supabase
        .from('quotes')
        .select('*, clients(*)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      setQuotes(quotesData || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
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
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('name', { ascending: true });

      setClients(clientsData || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }, [supabase]);

  useEffect(() => {
    loadQuotes();
    loadClients();
  }, [loadQuotes, loadClients]);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quote.clients?.name && quote.clients.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function StatusBadge({ status }: { status: string }) {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };

    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      accepted: 'Acceptée',
      rejected: 'Rejetée',
      expired: 'Expirée',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || colors.draft
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  }

  const getQuoteStats = () => {
    const stats = {
      total: quotes.length,
      draft: quotes.filter(q => q.status === 'draft').length,
      sent: quotes.filter(q => q.status === 'sent').length,
      accepted: quotes.filter(q => q.status === 'accepted').length,
      rejected: quotes.filter(q => q.status === 'rejected').length,
      totalValue: quotes.reduce((sum, quote) => sum + Number(quote.total_amount), 0),
      acceptedValue: quotes
        .filter(q => q.status === 'accepted')
        .reduce((sum, quote) => sum + Number(quote.total_amount), 0),
    };
    return stats;
  };

  const stats = getQuoteStats();

  const handleDuplicateQuote = async (quoteId: string) => {
    try {
      const { data: quote } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (!quote) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      // Generate new quote number
      const newQuoteNumber = `DEV-${Date.now()}`;
      
      const { data: newQuote } = await supabase
        .from('quotes')
        .insert({
          ...quote,
          id: undefined,
          quote_number: newQuoteNumber,
          status: 'draft',
          total_amount: 0, // Reset to recalculate
          created_at: undefined,
          updated_at: undefined,
          organization_id: profile?.organization_id
        })
        .select()
        .single();

      if (newQuote) {
        // Copy quote items
        const { data: items } = await supabase
          .from('quote_items')
          .select('*')
          .eq('quote_id', quoteId);

        if (items && items.length > 0) {
          await supabase
            .from('quote_items')
            .insert(items.map(item => ({
              ...item,
              id: undefined,
              quote_id: newQuote.id,
              created_at: undefined
            })));
        }

        // Recalculate total
        const { data: newItems } = await supabase
          .from('quote_items')
          .select('amount')
          .eq('quote_id', newQuote.id);

        const totalAmount = newItems?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        
        await supabase
          .from('quotes')
          .update({ total_amount: totalAmount })
          .eq('id', newQuote.id);

        // Reload quotes and redirect
        await loadQuotes();
        window.location.href = `/quotes/${newQuote.id}`;
      }
    } catch (error) {
      console.error('Error duplicating quote:', error);
      alert('Erreur lors de la duplication du devis');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">Devis & Soumissions</h1>
          <p className="text-ui-text-muted mt-1">Générez des devis professionnels en quelques minutes</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Link href="/quotes/generate">
            <Button variant="primary" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Générer depuis PDF
            </Button>
          </Link>
          <Link href="/quotes/new">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau devis
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Total</p>
              <p className="text-2xl font-bold text-ui-text">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Envoyés</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Acceptés</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Valeur totale</p>
              <p className="text-lg font-bold text-ui-text">{formatCurrency(stats.totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-ui-text-muted mb-1">Valeur acceptée</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(stats.acceptedValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des devis..."
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
                <option value="expired">Expirés</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      {!quotes || quotes.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun devis</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier devis ou générer un devis depuis un plan PDF</p>
            <div className="flex justify-center gap-3">
              <Link href="/quotes/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau devis
                </Button>
              </Link>
              <Link href="/quotes/generate">
                <Button variant="outline">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Générer depuis PDF
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <div className="font-medium text-gray-900">{quote.quote_number}</div>
                      {quote.ai_source_document && (
                        <div className="flex items-center text-xs text-blue-600 mt-1">
                          <FileSpreadsheet className="w-3 h-3 mr-1" />
                          Généré par IA
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quote.title}</div>
                    {quote.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{quote.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.clients?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.valid_until ? formatDate(quote.valid_until) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                    {formatCurrency(Number(quote.total_amount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/quotes/${quote.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicateQuote(quote.id)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {quote.pdf_url && (
                        <a
                          href={quote.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
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
