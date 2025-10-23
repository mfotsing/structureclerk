'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Building,
  DollarSign,
  Ruler,
  Upload,
  Check,
  ArrowLeft
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    hourlyRate: '',
    pricePerMeter: '',
    role: 'contractor'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration
  useState(() => {
    setIsClient(true);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez télécharger une image (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName || !formData.lastName || !formData.companyName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Upload logo if provided
        let logoUrl = null;
        if (logoFile) {
          const fileExt = logoFile.name.split('.').pop();
          const fileName = `${data.user.id}/logo.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('logos')
            .upload(fileName, logoFile);
          
          if (!uploadError) {
            const { data } = supabase.storage
              .from('logos')
              .getPublicUrl(fileName);
            
            logoUrl = data.publicUrl;
          }
        }
        
        // Create organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: formData.companyName,
            hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
            price_per_meter: formData.pricePerMeter ? parseFloat(formData.pricePerMeter) : null,
            logo_url: logoUrl,
            created_by: data.user.id
          })
          .select()
          .single();

        if (orgError) throw orgError;

        // Update profile with organization
        await supabase
          .from('profiles')
          .update({
            organization_id: orgData.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      step > stepNumber ? 'bg-brand-orange' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Compte</span>
            <span>Informations</span>
            <span>Entreprise</span>
          </div>
        </div>

        <Card variant="default" padding="lg">
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  <span className="text-brand-navy">Structure</span>
                  <span className="text-brand-orange">Clerk</span>
                </span>
              </div>
            </Link>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 && 'Créer votre compte'}
              {step === 2 && 'Vos informations'}
              {step === 3 && 'Votre entreprise'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Rejoignez des milliers d\'entrepreneurs qui optimisent leur chantier'}
              {step === 2 && 'Dites-nous en plus sur vous'}
              {step === 3 && 'Configurez votre profil entreprise pour des devis intelligents'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Min. 8 caractères"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Répétez votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Jean"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Tremblay"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="(514) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'entreprise *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Construction ABC Inc."
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              {step === 3 && (
                <>
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Taux horaire ($/h)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="65.00"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisé pour calculer automatiquement les coûts de main-d'œuvre dans vos devis
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="pricePerMeter" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix par mètre ($/m)
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="pricePerMeter"
                        name="pricePerMeter"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pricePerMeter}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="150.00"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisé pour calculer automatiquement les coûts par surface dans vos devis
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo de l'entreprise
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
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
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                        >
                          {logoFile ? 'Changer le logo' : 'Télécharger un logo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG jusqu'à 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Devis Intelligents</h4>
                        <p className="text-sm text-blue-700">
                          Ces informations permettront de générer automatiquement des devis précis 
                          avec vos tarifs préconfigurés.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Création...' : 'Créer mon compte'}
                  </Button>
                )}
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte?{' '}
                <Link href="/login" className="font-medium text-brand-orange hover:text-orange-600">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
