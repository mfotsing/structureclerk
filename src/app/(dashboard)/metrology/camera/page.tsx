'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Maximize2,
  Move,
  Target,
  Grid3x3,
  Ruler,
  Box,
  Save,
  Plus,
  X,
  Download,
  Smartphone
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client_name?: string;
}

interface DetectedMeasurement {
  id: string;
  type: 'length' | 'area' | 'volume' | 'angle' | 'count';
  value: number;
  unit: string;
  confidence: number;
  points: Array<{ x: number; y: number }>;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  label?: string;
}

interface MeasurementResult {
  measurements: DetectedMeasurement[];
  confidence: number;
  processingTime: number;
  totalArea?: number;
  totalLength?: number;
}

export default function MetrologyCameraPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [measurementName, setMeasurementName] = useState('');
  const [measurementDescription, setMeasurementDescription] = useState('');
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
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
          .select('*')
          .eq('organization_id', profile.organization_id)
          .in('status', ['active', 'in_progress'])
          .order('name', { ascending: true });

        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, [supabase]);

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

  // Capture photo from camera
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
        setImage(imageData);
        stopCamera();
        setError(null);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with AI
  const processImage = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI results (in a real implementation, this would call an AI service)
      const mockResult: MeasurementResult = {
        measurements: [
          {
            id: '1',
            type: 'length',
            value: 3.45,
            unit: 'm',
            confidence: 0.92,
            points: [
              { x: 120, y: 200 },
              { x: 450, y: 200 }
            ],
            label: 'Longueur mur'
          },
          {
            id: '2',
            type: 'length',
            value: 2.78,
            unit: 'm',
            confidence: 0.88,
            points: [
              { x: 450, y: 200 },
              { x: 450, y: 380 }
            ],
            label: 'Hauteur mur'
          },
          {
            id: '3',
            type: 'area',
            value: 9.59,
            unit: 'm²',
            confidence: 0.85,
            points: [
              { x: 120, y: 200 },
              { x: 450, y: 200 },
              { x: 450, y: 380 },
              { x: 120, y: 380 }
            ],
            label: 'Surface mur'
          }
        ],
        confidence: 0.88,
        processingTime: 2.8,
        totalArea: 9.59,
        totalLength: 6.23
      };
      
      setResult(mockResult);
    } catch (error: any) {
      console.error('Error processing image:', error);
      setError(error.message || 'Erreur lors du traitement de l\'image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save measurement
  const saveMeasurement = async () => {
    if (!result || !selectedProject || !measurementName) {
      setError('Veuillez remplir tous les champs obligatoires');
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

      // Save each detected measurement
      for (const measurement of result.measurements) {
        await supabase
          .from('measurements')
          .insert({
            project_id: selectedProject,
            name: `${measurementName} - ${measurement.label || measurement.type}`,
            description: measurementDescription,
            measurement_type: measurement.type,
            value: measurement.value,
            unit: measurement.unit,
            accuracy: measurement.confidence,
            method: 'ai',
            photo_url: image,
            coordinates: measurement.points[0],
            reference_points: measurement.points,
            organization_id: profile.organization_id,
            created_by: user.id
          });
      }

      alert('Mesures enregistrées avec succès!');
      router.push('/metrology');
    } catch (error: any) {
      console.error('Error saving measurement:', error);
      setError(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  // Draw on canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setDrawnPoints([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawnPoints(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear drawing
  const clearDrawing = () => {
    setDrawnPoints([]);
    setSelectedMeasurement(null);
  };

  // Format value
  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)} ${unit}`;
  };

  // Get measurement icon
  const getMeasurementIcon = (type: string) => {
    const icons = {
      length: <Ruler className="w-4 h-4" />,
      area: <Maximize2 className="w-4 h-4" />,
      volume: <Box className="w-4 h-4" />,
      angle: <RotateCcw className="w-4 h-4" />,
      count: <Grid3x3 className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Ruler className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/metrology" className="text-brand-orange">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Caméra Métrique IA</h1>
                <p className="text-xs text-gray-500">Mesures automatiques par IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMobile && cameraActive && (
                <button
                  onClick={switchCamera}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
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

        {/* Camera/Image Capture */}
        {!image ? (
          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Camera className="w-16 h-16 text-brand-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Capturez une mesure
                </h3>
                <p className="text-gray-600 mb-6">
                  Prenez une photo ou téléchargez une image pour extraire les mesures automatiquement
                </p>
              </div>

              {/* Camera View */}
              {cameraActive ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <button
                        onClick={capturePhoto}
                        className="w-16 h-16 bg-white rounded-full border-4 border-brand-orange flex items-center justify-center shadow-lg"
                      >
                        <Camera className="w-8 h-8 text-brand-orange" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    {isMobile && (
                      <button
                        onClick={switchCamera}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Changer
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Camera Button */}
                  {isMobile ? (
                    <button
                      onClick={initializeCamera}
                      className="w-full px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Ouvrir la caméra
                    </button>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Utilisez un mobile pour accéder à la caméra
                      </p>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Télécharger une image
                    </button>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Image with Results */}
            <Card variant="default" padding="lg">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Image Display */}
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Measurement"
                      className="w-full rounded-lg"
                    />
                    
                    {/* Overlay Canvas for Drawing */}
                    <canvas
                      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                      width={imageRef.current?.width}
                      height={imageRef.current?.height}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    
                    {/* Detected Measurements Overlay */}
                    {result && result.measurements.map((measurement) => (
                      <div key={measurement.id}>
                        {/* Draw lines for length measurements */}
                        {measurement.type === 'length' && measurement.points.length >= 2 && (
                          <svg
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ width: imageRef.current?.width, height: imageRef.current?.height }}
                          >
                            <line
                              x1={measurement.points[0].x}
                              y1={measurement.points[0].y}
                              x2={measurement.points[1].x}
                              y2={measurement.points[1].y}
                              stroke="#3B82F6"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                            <circle cx={measurement.points[0].x} cy={measurement.points[0].y} r="4" fill="#3B82F6" />
                            <circle cx={measurement.points[1].x} cy={measurement.points[1].y} r="4" fill="#3B82F6" />
                          </svg>
                        )}
                        
                        {/* Draw areas for area measurements */}
                        {measurement.type === 'area' && measurement.points.length >= 3 && (
                          <svg
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ width: imageRef.current?.width, height: imageRef.current?.height }}
                          >
                            <polygon
                              points={measurement.points.map(p => `${p.x},${p.y}`).join(' ')}
                              fill="rgba(59, 130, 246, 0.2)"
                              stroke="#3B82F6"
                              strokeWidth="2"
                            />
                            {measurement.points.map((point, index) => (
                              <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3B82F6" />
                            ))}
                          </svg>
                        )}
                        
                        {/* Measurement Label */}
                        <div
                          className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium"
                          style={{
                            left: `${measurement.points[0].x}px`,
                            top: `${measurement.points[0].y - 30}px`
                          }}
                        >
                          {formatValue(measurement.value, measurement.unit)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setImage(null);
                        setResult(null);
                        clearDrawing();
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Recommencer
                    </button>
                    
                    {!result && (
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyse IA...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Analyser avec IA
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Results */}
            {result && (
              <Card variant="default" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Résultats de l'Analyse IA
                  </CardTitle>
                  <CardDescription>
                    Précision: {Math.round(result.confidence * 100)}% • Temps: {result.processingTime}s
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">Surface totale</p>
                        <p className="text-xl font-bold text-blue-900">
                          {result.totalArea?.toFixed(2)} m²
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Longueur totale</p>
                        <p className="text-xl font-bold text-green-900">
                          {result.totalLength?.toFixed(2)} m
                        </p>
                      </div>
                    </div>

                    {/* Individual Measurements */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Mesures détectées</h4>
                      {result.measurements.map((measurement) => (
                        <div
                          key={measurement.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedMeasurement === measurement.id
                              ? 'border-brand-orange bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedMeasurement(
                            selectedMeasurement === measurement.id ? null : measurement.id
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getMeasurementIcon(measurement.type)}
                              <span className="font-medium text-gray-900">
                                {measurement.label || measurement.type}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatValue(measurement.value, measurement.unit)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Confiance: {Math.round(measurement.confidence * 100)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Measurement Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Détails de la mesure</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la mesure *
                        </label>
                        <input
                          type="text"
                          value={measurementName}
                          onChange={(e) => setMeasurementName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="Ex: Mur salon - Mesure principale"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Projet *
                        </label>
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        >
                          <option value="">Sélectionner un projet</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={measurementDescription}
                          onChange={(e) => setMeasurementDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="Notes additionnelles sur cette mesure..."
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={saveMeasurement}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer les mesures
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setImage(null);
                          setResult(null);
                          clearDrawing();
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Nouvelle mesure
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}