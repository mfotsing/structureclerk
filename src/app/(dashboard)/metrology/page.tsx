'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Ruler,
  Camera,
  Upload,
  Calculator,
  Plus,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Box,
  Maximize2,
  Move,
  RotateCw,
  Grid3x3,
  MapPin,
  FileText,
  Image as ImageIcon,
  Smartphone,
  Target,
  Zap,
  Search
} from 'lucide-react';

interface Measurement {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  measurement_type: 'length' | 'area' | 'volume' | 'angle' | 'count';
  value: number;
  unit: string;
  accuracy: number;
  method: 'manual' | 'photo' | 'laser' | 'ai';
  photo_url?: string;
  coordinates?: {
    x: number;
    y: number;
    z?: number;
  };
  reference_points?: Array<{
    x: number;
    y: number;
    label: string;
  }>;
  created_at: string;
  updated_at: string;
  created_by: string;
  projects?: {
    id: string;
    name: string;
    client_name?: string;
  };
}

interface MeasurementSession {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  measurements_count: number;
  total_area?: number;
  total_volume?: number;
  created_at: string;
  updated_at: string;
  projects?: {
    id: string;
    name: string;
    client_name?: string;
  };
}

interface Project {
  id: string;
  name: string;
  client_name?: string;
  address?: string;
  status: string;
}

export default function MetrologyPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [sessions, setSessions] = useState<MeasurementSession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'measurements' | 'sessions' | 'camera'>('measurements');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const supabase = createClient();

  const loadMeasurements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: measurementsData } = await supabase
        .from('measurements')
        .select(`
          *,
          projects(*)
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      setMeasurements(measurementsData || []);
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const loadSessions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: sessionsData } = await supabase
        .from('measurement_sessions')
        .select(`
          *,
          projects(*)
        `)
        .eq('organization_id', profile.organization_id)
        .order('updated_at', { ascending: false });

      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
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
        .select('*')
        .eq('organization_id', profile.organization_id)
        .in('status', ['active', 'in_progress'])
        .order('name', { ascending: true });

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [supabase]);

  useEffect(() => {
    loadMeasurements();
    loadSessions();
    loadProjects();
  }, [loadMeasurements, loadSessions, loadProjects]);

  const filteredMeasurements = measurements.filter(measurement => {
    const matchesSearch = searchTerm === '' || 
      measurement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      measurement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      measurement.projects?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = selectedProject === 'all' || measurement.project_id === selectedProject;
    const matchesType = selectedType === 'all' || measurement.measurement_type === selectedType;
    
    return matchesSearch && matchesProject && matchesType;
  });

  const getMeasurementIcon = (type: string) => {
    const icons = {
      length: <Ruler className="w-5 h-5" />,
      area: <Maximize2 className="w-5 h-5" />,
      volume: <Box className="w-5 h-5" />,
      angle: <RotateCw className="w-5 h-5" />,
      count: <Grid3x3 className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Ruler className="w-5 h-5" />;
  };

  const getMethodIcon = (method: string) => {
    const icons = {
      manual: <Calculator className="w-4 h-4" />,
      photo: <Camera className="w-4 h-4" />,
      laser: <Target className="w-4 h-4" />,
      ai: <Zap className="w-4 h-4" />
    };
    return icons[method as keyof typeof icons] || <Calculator className="w-4 h-4" />;
  };

  const getMethodColor = (method: string) => {
    const colors = {
      manual: 'bg-gray-100 text-gray-700',
      photo: 'bg-blue-100 text-blue-700',
      laser: 'bg-green-100 text-green-700',
      ai: 'bg-purple-100 text-purple-700'
    };
    return colors[method as keyof typeof colors] || colors.manual;
  };

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)} ${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const totalMeasurements = measurements.length;
    const photoMeasurements = measurements.filter(m => m.method === 'photo' || m.method === 'ai').length;
    const avgAccuracy = measurements.length > 0 
      ? measurements.reduce((sum, m) => sum + m.accuracy, 0) / measurements.length 
      : 0;
    const totalArea = measurements
      .filter(m => m.measurement_type === 'area')
      .reduce((sum, m) => sum + m.value, 0);
    const totalVolume = measurements
      .filter(m => m.measurement_type === 'volume')
      .reduce((sum, m) => sum + m.value, 0);

    return {
      totalMeasurements,
      photoMeasurements,
      avgAccuracy,
      totalArea,
      totalVolume
    };
  };

  const stats = getStats();

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
          <h1 className="text-3xl font-bold text-ui-text">Métrologie Numérique</h1>
          <p className="text-ui-text-muted mt-1">Prise de mesures numérique qui calcule tout automatiquement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Link href="/metrology/camera">
            <Button variant="primary" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Caméra Métrique
            </Button>
          </Link>
          <Link href="/metrology/new">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Mesure
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ui-text-muted">Mesures totales</p>
                <p className="text-2xl font-bold text-ui-text">{stats.totalMeasurements}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ui-text-muted">Mesures photo/IA</p>
                <p className="text-2xl font-bold text-purple-600">{stats.photoMeasurements}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ui-text-muted">Précision moyenne</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(stats.avgAccuracy * 100)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ui-text-muted">Surface totale</p>
                <p className="text-2xl font-bold text-ui-text">{stats.totalArea.toFixed(0)} m²</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ui-text-muted">Volume total</p>
                <p className="text-2xl font-bold text-ui-text">{stats.totalVolume.toFixed(0)} m³</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Box className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('measurements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'measurements'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Mesures
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Sessions
            </div>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'camera'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Caméra
            </div>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <Card variant="default" padding="lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, description ou projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les projets</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="length">Longueur</option>
                <option value="area">Surface</option>
                <option value="volume">Volume</option>
                <option value="angle">Angle</option>
                <option value="count">Comptage</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'measurements' && (
        <>
          {!measurements || measurements.length === 0 ? (
            <Card variant="default" padding="lg">
              <CardContent className="pt-6 text-center">
                <Ruler className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune mesure
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par prendre votre première mesure numérique
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/metrology/camera">
                    <Button variant="primary">
                      <Camera className="w-4 h-4 mr-2" />
                      Caméra Métrique
                    </Button>
                  </Link>
                  <Link href="/metrology/new">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Mesure Manuelle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeasurements.map((measurement) => (
                <Card key={measurement.id} variant="default" padding="lg" className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getMeasurementIcon(measurement.measurement_type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(measurement.method)}`}>
                          {getMethodIcon(measurement.method)}
                          <span className="ml-1">{measurement.method}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-orange">
                          {formatValue(measurement.value, measurement.unit)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Précision: {Math.round(measurement.accuracy * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{measurement.name}</h4>
                        {measurement.description && (
                          <p className="text-sm text-gray-600 mt-1">{measurement.description}</p>
                        )}
                      </div>

                      {measurement.projects && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{measurement.projects.name}</span>
                        </div>
                      )}

                      {measurement.photo_url && (
                        <div className="rounded-lg overflow-hidden">
                          <img 
                            src={measurement.photo_url} 
                            alt={measurement.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(measurement.created_at)}</span>
                        <div className="flex items-center gap-1">
                          <Link href={`/metrology/${measurement.id}`}>
                            <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'sessions' && (
        <>
          {!sessions || sessions.length === 0 ? (
            <Card variant="default" padding="lg">
              <CardContent className="pt-6 text-center">
                <Grid3x3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune session
                </h3>
                <p className="text-gray-600 mb-6">
                  Créez une session pour regrouper plusieurs mesures
                </p>
                <Link href="/metrology/session/new">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} variant="default" padding="lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{session.name}</h4>
                        {session.description && (
                          <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.status === 'active' ? 'Active' : 
                         session.status === 'completed' ? 'Terminée' : 'En pause'}
                      </span>
                    </div>

                    {session.projects && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{session.projects.name}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{session.measurements_count}</p>
                        <p className="text-xs text-gray-500">Mesures</p>
                      </div>
                      {session.total_area && (
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{session.total_area.toFixed(0)}</p>
                          <p className="text-xs text-gray-500">m²</p>
                        </div>
                      )}
                      {session.total_volume && (
                        <div className="text-center">
                          <p className="text-xl font-bold text-indigo-600">{session.total_volume.toFixed(0)}</p>
                          <p className="text-xs text-gray-500">m³</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Créée le {formatDate(session.created_at)}</span>
                      <div className="flex items-center gap-1">
                        <Link href={`/metrology/session/${session.id}`}>
                          <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'camera' && (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <Camera className="w-20 h-20 text-brand-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Caméra Métrique IA
              </h3>
              <p className="text-gray-600 mb-6">
                Prenez une photo et notre IA extraira automatiquement les mesures avec une précision de 95%
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">📏 Longueurs</h4>
                  <p className="text-sm text-gray-600">Mesure automatique des distances et dimensions dans les photos</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">📐 Surfaces</h4>
                  <p className="text-sm text-gray-600">Calcul des zones et surfaces à partir des photos</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">🧱 Volumes</h4>
                  <p className="text-sm text-gray-600">Estimation des volumes et espaces 3D</p>
                </div>
              </div>

              <Link href="/metrology/camera">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Lancer la Caméra Métrique
                </Button>
              </Link>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-1">Optimisé Mobile</h4>
                    <p className="text-sm text-blue-700">
                      Utilisez directement votre smartphone sur le chantier pour des mesures instantanées
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}