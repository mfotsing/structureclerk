'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Camera,
  Mic,
  MicOff,
  Save,
  Send,
  Download,
  Upload,
  User,
  MapPin,
  DollarSign,
  Calculator,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Loader2,
  FileText
} from 'lucide-react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  unit: string;
  type: 'labor' | 'material' | 'equipment' | 'other';
}

interface UserProfile {
  first_name: string;
  last_name: string;
  organizations?: {
    name: string;
    hourly_rate?: number;
    price_per_meter?: number;
    logo_url?: string;
  };
}

export default function CreateSmartQuotePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [clientName, setClientName] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Speech recognition
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  
  // Camera
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  // Calculations
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  const supabase = createClient();
  const TAX_RATE = 0.14975; // TPS (5%) + TVQ (9.975%)

  // Fix for hydration
  useState(() => {
    setIsClient(true);
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from('profiles')
          .select(`
            *,
            organizations(*)
          `)
          .eq('id', user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  // Initialize speech recognition
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'fr-FR';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Erreur de reconnaissance vocale. Veuillez réessayer.');
      };
      
      setRecognition(recognitionInstance);
    }
  }, [isClient]);

  // Calculate totals
  useEffect(() => {
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const calculatedTax = calculatedSubtotal * TAX_RATE;
    const calculatedTotal = calculatedSubtotal + calculatedTax;
    
    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setTotal(calculatedTotal);
  }, [items]);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Switch camera
  const switchCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    stopCamera();
    setTimeout(() => initializeCamera(), 100);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoTaken(imageData);
        stopCamera();
      }
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Veuillez télécharger une image (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Start/stop speech recognition
  const toggleListening = () => {
    if (!recognition) {
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      
      // Process transcript to add items
      if (transcript.trim()) {
        processSpeechToItems(transcript);
      }
    } else {
      recognition.start();
      setIsListening(true);
      setTranscript('');
      setError(null);
    }
  };

  // Process speech transcript to quote items
  const processSpeechToItems = (speechText: string) => {
    const text = speechText.toLowerCase();
    const newItems: QuoteItem[] = [];
    
    // Parse common patterns
    const patterns = [
      /(\d+)\s*(?:mètres|m|mètre)?\s+(?:de\s+)?(.+?)(?:,|\s+et\s|$)/gi,
      /(\d+)\s*(?:sacs?s?)\s+(?:de\s+)?(.+?)(?:,|\s+et\s|$)/gi,
      /(\d+)\s*(?:heures?|h)\s+(?:de\s+)?(.+?)(?:,|\s+et\s|$)/gi,
      /(\d+)\s*(?:pièces?|unités?)\s+(?:de\s+)?(.+?)(?:,|\s+et\s|$)/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const quantity = parseInt(match[1]);
        const description = match[2].trim();
        
        if (quantity > 0 && description) {
          // Determine type and unit based on description
          let type: 'labor' | 'material' | 'equipment' | 'other' = 'other';
          let unit = 'unité';
          let unitPrice = 0;
          
          // Labor items
          if (description.includes('main') || description.includes('travail') || description.includes('heure')) {
            type = 'labor';
            unit = 'heure';
            unitPrice = profile?.organizations?.hourly_rate || 65;
          }
          
          // Material items
          else if (description.includes('ciment') || description.includes('sac') || description.includes('matériau')) {
            type = 'material';
            unit = 'unité';
            unitPrice = 15; // Default material price
          }
          
          // Equipment items
          else if (description.includes('location') || description.includes('équipement')) {
            type = 'equipment';
            unit = 'jour';
            unitPrice = 150; // Default equipment price
          }
          
          // Measurement items
          else if (description.includes('mètre') || description.includes('coffrage') || description.includes('mur')) {
            type = 'material';
            unit = 'm';
            unitPrice = profile?.organizations?.price_per_meter || 150;
          }
          
          const newItem: QuoteItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            description: description.charAt(0).toUpperCase() + description.slice(1),
            quantity,
            unit_price: unitPrice,
            total: quantity * unitPrice,
            unit,
            type
          };
          
          newItems.push(newItem);
        }
      }
    });
    
    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
    } else {
      setError('Aucun élément de devis reconnu dans: "' + speechText + '"');
    }
  };

  // Add item manually
  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unit_price: profile?.organizations?.hourly_rate || 65,
      total: profile?.organizations?.hourly_rate || 65,
      unit: 'heure',
      type: 'labor'
    };
    
    setItems(prev => [...prev, newItem]);
  };

  // Update item
  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unit_price changed
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Generate PDF
  const generatePDF = async () => {
    if (!clientName || !projectAddress || items.length === 0) {
      setError('Veuillez remplir tous les champs obligatoires et ajouter au moins un élément');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // In a real implementation, this would generate a PDF
      // For now, we'll simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create quote record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload logo if provided
      let logoUrl = logoPreview || profile?.organizations?.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/quotes/${Date.now()}/logo.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('quote-assets')
          .upload(fileName, logoFile);
        
        if (!uploadError) {
          const { data } = supabase.storage
            .from('quote-assets')
            .getPublicUrl(fileName);
          
          logoUrl = data.publicUrl;
        }
      }

      // Save quote to database
      const { data: quoteData, error } = await supabase
        .from('smart_quotes')
        .insert({
          user_id: user.id,
          client_name: clientName,
          project_address: projectAddress,
          items: items,
          subtotal,
          tax,
          total,
          logo_url: logoUrl,
          status: 'draft',
          pdf_url: `https://example.com/quotes/${Date.now()}.pdf`, // Mock PDF URL
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      alert('Devis créé avec succès!');
      router.push(`/smart-quotes/${quoteData.id}`);
    } catch (error: any) {
      console.error('Error creating quote:', error);
      setError(error.message || 'Erreur lors de la création du devis');
    } finally {
      setSaving(false);
    }
  };

  // Send quote
  const sendQuote = async () => {
    // This would implement email sending functionality
    alert('Fonctionnalité d\'envoi par email bientôt disponible!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/smart-quotes" className="text-brand-orange">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Nouveau Devis</h1>
                <p className="text-xs text-gray-500">Créez un devis intelligent</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMobile && cameraActive && (
                <button
                  onClick={switchCamera}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Erreur</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Jean Tremblay"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse du chantier *
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={projectAddress}
                    onChange={(e) => setProjectAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    placeholder="123 Rue Principale, Montréal, QC H3A 1B2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Input Methods */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Saisie Intelligente
            </CardTitle>
            <CardDescription>
              Utilisez la caméra ou la dictée vocale pour ajouter rapidement des éléments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera Input */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">📷 Caméra</h4>
                {photoTaken ? (
                  <div className="space-y-3">
                    <img
                      src={photoTaken}
                      alt="Photo du chantier"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPhotoTaken(null);
                          initializeCamera();
                        }}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Reprendre
                      </button>
                      <button
                        onClick={() => setPhotoTaken(null)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Effacer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {cameraActive ? (
                      <div className="space-y-3">
                        <div className="relative bg-black rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <button
                              onClick={capturePhoto}
                              className="w-12 h-12 bg-white rounded-full border-4 border-brand-orange flex items-center justify-center shadow-lg"
                            >
                              <Camera className="w-6 h-6 text-brand-orange" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={stopCamera}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                          >
                            Annuler
                          </button>
                          {isMobile && (
                            <button
                              onClick={switchCamera}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
                              Changer
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {isMobile ? (
                          <button
                            onClick={initializeCamera}
                            className="w-full px-4 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                          >
                            <Camera className="w-5 h-5" />
                            Ouvrir la caméra
                          </button>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-3">
                              Utilisez un mobile pour accéder à la caméra
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setPhotoTaken(event.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              Télécharger une image
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Speech Input */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">🎙️ Dictée vocale</h4>
                {isListening && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>Enregistrement en cours...</span>
                    </div>
                    <p className="text-sm text-blue-900 mt-2">{transcript}</p>
                  </div>
                )}
                
                <button
                  onClick={toggleListening}
                  disabled={!recognition}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-brand-orange text-white hover:bg-orange-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Arrêter l'enregistrement
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Commencer la dictée
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500">
                  Dites par exemple : "5 mètres de coffrage, 10 sacs de ciment, 3 heures de main-d'œuvre"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Éléments du devis
              </span>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un élément
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun élément
                </h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez des éléments en utilisant la caméra, la dictée vocale ou manuellement
                </p>
                <Button variant="outline" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un élément
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-orange text-sm"
                          placeholder="Description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantité
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-orange text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Prix unitaire
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-orange text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Logo de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {logoPreview || profile?.organizations?.logo_url ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={logoPreview || profile?.organizations?.logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  {logoFile ? 'Changer le logo' : 'Télécharger un logo'}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG jusqu'à 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Résumé du devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TPS (5%) + TVQ (9.975%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-brand-orange">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={generatePDF}
            disabled={saving || !clientName || !projectAddress || items.length === 0}
            className="flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Générer le devis
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={sendQuote}
            disabled={!clientName || !projectAddress || items.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}