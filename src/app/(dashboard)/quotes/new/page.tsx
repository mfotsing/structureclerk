'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Save, 
  Send, 
  FileText, 
  Plus, 
  Trash2, 
  Calculator,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Percent,
  FileSpreadsheet,
  CheckCircle
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
  quote_number: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  client_id: string;
  project_id?: string;
  valid_until: string;
  notes?: string;
  terms?: string;
  subtotal: number;
  tps_rate: number;
  tps_amount: number;
  tvq_rate: number;
  tvq_amount: number;
  total_amount: number;
  items: QuoteItem[];
}

export default function NewQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExtracted = searchParams.get('extracted') === 'true';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [quote, setQuote] = useState<Quote>({
    quote_number: '',
    title: '',
    description: '',
    status: 'draft',
    client_id: '',
    valid_until: '',
    notes: '',
    terms: '',
    subtotal: 0,
    tps_rate: 0.05,
    tps_amount: 0,
    tvq_rate: 0.09975,
    tvq_amount: 0,
    total_amount: 0,
    items: []
  });
  
  const [newItem, setNewItem] = useState<QuoteItem>({
    id: '',
    description: '',
    quantity: 1,
    unit: 'unité',
    unit_price: 0,
    amount: 0
  });

  const supabase = createClient();

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
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
    };

    loadClients();
  }, [supabase]);

  // Load extracted data if available
  useEffect(() => {
    if (isExtracted) {
      const extractedData = sessionStorage.getItem('extractedQuoteData');
      if (extractedData) {
        try {
          const data = JSON.parse(extractedData);
          
          // Find matching client or use first one
          const matchedClient = clients.find(c => 
            c.name.toLowerCase().includes(data.client_name?.toLowerCase() || '')
          );
          
          setQuote(prev => ({
            ...prev,
            title: data.project_name || '',
            description: data.description || '',
            client_id: matchedClient?.id || '',
            items: data.line_items?.map((item: any, index: number) => ({
              id: `extracted-${index}`,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unit_price: item.unit_price,
              amount: item.amount
            })) || []
          }));
          
          if (matchedClient) {
            setSelectedClient(matchedClient.id);
          }
          
          // Calculate totals
          calculateTotals(data.line_items || []);
        } catch (error) {
          console.error('Error parsing extracted data:', error);
        }
      }
    } else {
      // Generate quote number for new quotes
      generateQuoteNumber();
      
      // Set default validity date (30 days from now)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      setQuote(prev => ({
        ...prev,
        valid_until: validUntil.toISOString().split('T')[0]
      }));
    }
  }, [isExtracted, clients]);

  const generateQuoteNumber = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Count existing quotes for this organization
      const { count } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', profile.organization_id);

      const quoteNumber = `DEV-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`;
      setQuote(prev => ({ ...prev, quote_number: quoteNumber }));
    } catch (error) {
      console.error('Error generating quote number:', error);
    }
  };

  const calculateTotals = (items: QuoteItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tpsAmount = subtotal * quote.tps_rate;
    const tvqAmount = subtotal * quote.tvq_rate;
    const totalAmount = subtotal + tpsAmount + tvqAmount;

    setQuote(prev => ({
      ...prev,
      subtotal,
      tps_amount: tpsAmount,
      tvq_amount: tvqAmount,
      total_amount: totalAmount
    }));
  };

  const handleQuoteChange = (field: string, value: any) => {
    setQuote(prev => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    setQuote(prev => ({ ...prev, client_id: clientId }));
  };

  const handleNewItemChange = (field: string, value: any) => {
    const updatedItem = { ...newItem, [field]: value };
    
    // Calculate amount if quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      updatedItem.amount = updatedItem.quantity * updatedItem.unit_price;
    }
    
    setNewItem(updatedItem);
  };

  const addNewItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unit_price < 0) {
      alert('Veuillez remplir tous les champs de l\'item correctement');
      return;
    }

    const itemWithId = {
      ...newItem,
      id: Date.now().toString()
    };

    const updatedItems = [...quote.items, itemWithId];
    setQuote(prev => ({ ...prev, items: updatedItems }));
    
    // Reset new item form
    setNewItem({
      id: '',
      description: '',
      quantity: 1,
      unit: 'unité',
      unit_price: 0,
      amount: 0
    });
    
    // Recalculate totals
    calculateTotals(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = quote.items.filter(item => item.id !== itemId);
    setQuote(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    const updatedItems = quote.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount if quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setQuote(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const saveQuote = async (send = false) => {
    if (!quote.title || !quote.client_id || quote.items.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins un item');
      return;
    }

    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Create quote
      const { data: newQuote } = await supabase
        .from('quotes')
        .insert({
          ...quote,
          status: send ? 'sent' : 'draft',
          organization_id: profile.organization_id,
          created_by: user.id
        })
        .select()
        .single();

      if (!newQuote) throw new Error('Erreur lors de la création du devis');

      // Create quote items
      if (quote.items.length > 0) {
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

      // Generate PDF (in real implementation)
      // await generateQuotePDF(newQuote.id);

      alert(send ? 'Devis envoyé avec succès!' : 'Devis enregistré avec succès!');
      router.push('/quotes');
    } catch (error: any) {
      console.error('Error saving quote:', error);
      alert(error.message || 'Erreur lors de la sauvegarde du devis');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ui-text">
            {isExtracted ? 'Finaliser Devis Généré par IA' : 'Nouveau Devis'}
          </h1>
          <p className="text-ui-text-muted mt-1">
            {isExtracted 
              ? 'Vérifiez et ajustez les données extraites avant de finaliser' 
              : 'Créez un devis professionnel pour votre client'
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => saveQuote(false)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer Brouillon'}
          </Button>
          <Button
            variant="primary"
            onClick={() => saveQuote(true)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {saving ? 'Envoi...' : 'Envoyer Devis'}
          </Button>
        </div>
      </div>

      {isExtracted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Données extraites par IA</h4>
            <p className="text-sm text-blue-700">
              Les informations ci-dessous ont été automatiquement extraites de votre document PDF. 
              Veuillez les vérifier et les ajuster si nécessaire avant de finaliser le devis.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Information */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations Devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de devis
                    </label>
                    <input
                      type="text"
                      value={quote.quote_number}
                      onChange={(e) => handleQuoteChange('quote_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="DEV-2024-0001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de validité
                    </label>
                    <input
                      type="date"
                      value={quote.valid_until}
                      onChange={(e) => handleQuoteChange('valid_until', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du devis *
                  </label>
                  <input
                    type="text"
                    value={quote.title}
                    onChange={(e) => handleQuoteChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    placeholder="Rénovation complète résidence des Pins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={quote.description}
                    onChange={(e) => handleQuoteChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    placeholder="Description détaillée des travaux..."
                  />
                </div>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client *
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  
                  {clients.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Aucun client disponible.{' '}
                      <a href="/clients/new" className="text-brand-orange hover:underline">
                        Créer un client
                      </a>
                    </p>
                  )}
                </div>
                
                {selectedClient && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {clients
                      .filter(c => c.id === selectedClient)
                      .map(client => (
                        <div key={client.id} className="space-y-2 text-sm">
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          {client.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>
                                {client.address}
                                {client.city && `, ${client.city}`}
                                {client.province && `, ${client.province}`}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quote Items */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Postes de Travail
              </CardTitle>
              <CardDescription>
                Ajoutez les différents postes de travail pour votre devis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quote.items.length > 0 && (
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">Qté</th>
                        <th className="px-4 py-2 text-right">Unité</th>
                        <th className="px-4 py-2 text-right">Prix unitaire</th>
                        <th className="px-4 py-2 text-right">Montant</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {quote.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value))}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add New Item */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Ajouter un poste</h4>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => handleNewItemChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Description"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.quantity}
                      onChange={(e) => handleNewItemChange('quantity', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Qté"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => handleNewItemChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Unité"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unit_price}
                      onChange={(e) => handleNewItemChange('unit_price', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      placeholder="Prix unit."
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={addNewItem}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {newItem.amount > 0 && (
                  <div className="mt-2 text-sm text-gray-600 text-right">
                    Montant: {formatCurrency(newItem.amount)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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

          {/* Notes */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={quote.notes}
                onChange={(e) => handleQuoteChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Notes additionnelles pour le client..."
              />
            </CardContent>
          </Card>

          {/* Terms */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={quote.terms}
                onChange={(e) => handleQuoteChange('terms', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Conditions de paiement et autres termes..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}