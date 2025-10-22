'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  FileText, 
  Edit, 
  Send, 
  Download, 
  Copy, 
  Trash2, 
  ArrowLeft,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Eye
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

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  amount: number;
}

interface Quote {
  id: string;
  quote_number: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  total_amount: number;
  subtotal: number;
  tps_amount: number;
  tvq_amount: number;
  valid_until: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  terms?: string;
  pdf_url?: string;
  ai_confidence?: number;
  ai_source_document?: string;
  client_id: string;
  project_id?: string;
  clients?: Client;
  items?: QuoteItem[];
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (quoteId) {
      loadQuote();
    }
  }, [quoteId]);

  const loadQuote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Load quote with client and items
      const { data: quoteData } = await supabase
        .from('quotes')
        .select(`
          *,
          clients(*)
        `)
        .eq('id', quoteId)
        .eq('organization_id', profile.organization_id)
        .single();

      if (!quoteData) throw new Error('Devis introuvable');

      // Load quote items
      const { data: itemsData } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });

      setQuote({
        ...quoteData,
        items: itemsData || []
      });
    } catch (error: any) {
      console.error('Error loading quote:', error);
      alert(error.message || 'Erreur lors du chargement du devis');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!quote) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', quote.id);

      if (error) throw error;

      setQuote(prev => prev ? { ...prev, status: newStatus as any } : null);
      
      const statusMessages = {
        sent: 'Devis envoyé avec succès!',
        accepted: 'Devis marqué comme accepté!',
        rejected: 'Devis marqué comme rejeté!',
        draft: 'Devis remis en brouillon!'
      };
      
      alert(statusMessages[newStatus as keyof typeof statusMessages]);
    } catch (error: any) {
      console.error('Error updating quote status:', error);
      alert(error.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!quote) return;

    setActionLoading(true);
    try {
      // Generate new quote number
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { count } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', profile.organization_id);

      const newQuoteNumber = `DEV-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`;
      
      // Create duplicate quote
      const { data: newQuote } = await supabase
        .from('quotes')
        .insert({
          quote_number: newQuoteNumber,
          title: `${quote.title} (copie)`,
          description: quote.description,
          status: 'draft',
          subtotal: quote.subtotal,
          tps_amount: quote.tps_amount,
          tvq_amount: quote.tvq_amount,
          total_amount: quote.total_amount,
          valid_until: quote.valid_until,
          notes: quote.notes,
          terms: quote.terms,
          client_id: quote.client_id,
          project_id: quote.project_id,
          organization_id: profile.organization_id,
          created_by: user.id
        })
        .select()
        .single();

      if (!newQuote) throw new Error('Erreur lors de la duplication');

      // Copy quote items
      if (quote.items && quote.items.length > 0) {
        const itemsToInsert = quote.items.map(item => ({
          quote_id: newQuote.id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          amount: item.amount,
          organization_id: profile.organization_id
        }));

        await supabase
          .from('quote_items')
          .insert(itemsToInsert);
      }

      alert('Devis dupliqué avec succès!');
      router.push(`/quotes/${newQuote.id}`);
    } catch (error: any) {
      console.error('Error duplicating quote:', error);
      alert(error.message || 'Erreur lors de la duplication du devis');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!quote) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis? Cette action est irréversible.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Delete quote items first
      await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', quote.id);

      // Delete quote
      await supabase
        .from('quotes')
        .delete()
        .eq('id', quote.id);

      alert('Devis supprimé avec succès!');
      router.push('/quotes');
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      alert(error.message || 'Erreur lors de la suppression du devis');
    } finally {
      setActionLoading(false);
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };

    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      sent: <Send className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <AlertCircle className="w-4 h-4" />,
      expired: <AlertCircle className="w-4 h-4" />,
    };

    return icons[status as keyof typeof icons] || icons.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      accepted: 'Acceptée',
      rejected: 'Rejetée',
      expired: 'Expirée',
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

  if (!quote) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Devis introuvable</h3>
              <p className="text-sm text-red-700">Le devis que vous recherchez n'existe pas ou a été supprimé.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-ui-text">{quote.title}</h1>
            <p className="text-ui-text-muted">Devis #{quote.quote_number}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(quote.status)}`}>
            {getStatusIcon(quote.status)}
            {getStatusLabel(quote.status)}
          </span>
          
          {quote.ai_source_document && (
            <div className="flex items-center gap-1 text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded-full">
              <FileSpreadsheet className="w-3 h-3" />
              Généré par IA
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Link href={`/quotes/${quote.id}/edit`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
        </Link>
        
        <Button
          variant="outline"
          onClick={handleDuplicate}
          disabled={actionLoading}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Dupliquer
        </Button>
        
        {quote.pdf_url && (
          <a
            href={quote.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            Voir PDF
          </a>
        )}
        
        {quote.pdf_url && (
          <a
            href={quote.pdf_url}
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </a>
        )}
        
        {quote.status === 'draft' && (
          <Button
            variant="primary"
            onClick={() => handleStatusChange('sent')}
            disabled={actionLoading}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Envoyer le devis
          </Button>
        )}
        
        {quote.status === 'sent' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleStatusChange('accepted')}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Marquer accepté
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleStatusChange('rejected')}
              disabled={actionLoading}
              className="flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Marquer rejeté
            </Button>
          </div>
        )}
        
        {(quote.status === 'accepted' || quote.status === 'rejected') && (
          <Button
            variant="outline"
            onClick={() => handleStatusChange('draft')}
            disabled={actionLoading}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Remettre en brouillon
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={actionLoading}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Information */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations du Devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Numéro de devis</p>
                    <p className="font-medium">{quote.quote_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de création</p>
                    <p className="font-medium">{formatDate(quote.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de validité</p>
                    <p className="font-medium">{formatDate(quote.valid_until)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="font-medium">{formatDate(quote.updated_at)}</p>
                  </div>
                </div>
                
                {quote.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700">{quote.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.clients ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nom du client</p>
                    <p className="font-medium">{quote.clients.name}</p>
                  </div>
                  
                  {quote.clients.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">
                          {quote.clients.address}
                          {quote.clients.city && `, ${quote.clients.city}`}
                          {quote.clients.province && `, ${quote.clients.province}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {quote.clients.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-700">{quote.clients.email}</p>
                    </div>
                  )}
                  
                  {quote.clients.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-700">{quote.clients.phone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Aucun client associé</p>
              )}
            </CardContent>
          </Card>

          {/* Quote Items */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Postes de Travail
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.items && quote.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Qté</th>
                        <th className="px-4 py-2 text-right">Unité</th>
                        <th className="px-4 py-2 text-right">Prix unitaire</th>
                        <th className="px-4 py-2 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {quote.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{item.unit}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Aucun poste de travail</p>
              )}
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          {(quote.notes || quote.terms) && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>Notes et Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
                  </div>
                )}
                
                {quote.terms && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Summary */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Résumé Financier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">TPS (5%)</span>
                  <span className="font-medium">{formatCurrency(quote.tps_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">TVQ (9.975%)</span>
                  <span className="font-medium">{formatCurrency(quote.tvq_amount)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg text-brand-orange">
                      {formatCurrency(quote.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Confidence */}
          {quote.ai_confidence && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Informations IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Confiance d'extraction</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-brand-orange h-2 rounded-full"
                          style={{ width: `${quote.ai_confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(quote.ai_confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {quote.ai_source_document && (
                    <div>
                      <p className="text-sm text-gray-500">Source</p>
                      <p className="text-sm text-gray-700">{quote.ai_source_document}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}