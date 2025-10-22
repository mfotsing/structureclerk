'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Smartphone, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  Calendar,
  MapPin,
  User,
  Timer,
  Plus,
  Save,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  hourly_rate: number;
  position?: string;
}

interface Project {
  id: string;
  name: string;
  client_name?: string;
  address?: string;
}

interface TimesheetEntry {
  id: string;
  employee_id: string;
  project_id: string;
  date: string;
  start_time: string;
  end_time?: string;
  break_duration: number;
  hours_worked: number;
  description?: string;
  status: 'draft' | 'submitted';
  projects?: Project;
}

interface ActiveTimer {
  employee_id: string;
  project_id: string;
  start_time: Date;
  description?: string;
}

export default function MobileTimesheetPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [todayEntries, setTodayEntries] = useState<TimesheetEntry[]>([]);
  const [weekEntries, setWeekEntries] = useState<TimesheetEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayStats, setTodayStats] = useState({
    totalHours: 0,
    totalEarnings: 0,
    entriesCount: 0
  });
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

  // Load employee data
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // For demo, we'll use the first employee
        // In a real app, you'd match the user to their employee record
        const { data: employeeData } = await supabase
          .from('employees')
          .select('*')
          .eq('active', true)
          .limit(1)
          .single();

        if (employeeData) {
          setCurrentEmployee(employeeData);
        }
      } catch (error) {
        console.error('Error loading employee data:', error);
      }
    };

    loadEmployeeData();
  }, [supabase]);

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

  // Load timesheet entries
  useEffect(() => {
    const loadTimesheetEntries = async () => {
      if (!currentEmployee) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (!profile?.organization_id) return;

        // Today's entries
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
          .from('timesheets')
          .select('*, projects(*)')
          .eq('organization_id', profile.organization_id)
          .eq('employee_id', currentEmployee.id)
          .eq('date', today)
          .order('created_at', { ascending: false });

        setTodayEntries(todayData || []);

        // This week's entries
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartStr = weekStart.toISOString().split('T')[0];

        const { data: weekData } = await supabase
          .from('timesheets')
          .select('*, projects(*)')
          .eq('organization_id', profile.organization_id)
          .eq('employee_id', currentEmployee.id)
          .gte('date', weekStartStr)
          .order('date', { ascending: false });

        setWeekEntries(weekData || []);

        // Calculate today's stats
        const totalHours = todayData?.reduce((sum, entry) => sum + entry.hours_worked, 0) || 0;
        const totalEarnings = totalHours * (currentEmployee.hourly_rate || 0);
        const entriesCount = todayData?.length || 0;

        setTodayStats({
          totalHours,
          totalEarnings,
          entriesCount
        });
      } catch (error) {
        console.error('Error loading timesheet entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimesheetEntries();
  }, [currentEmployee, supabase]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - activeTimer.start_time.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTimer]);

  // Load active timer from localStorage
  useEffect(() => {
    if (!currentEmployee) return;

    const savedTimer = localStorage.getItem('activeTimer');
    if (savedTimer) {
      try {
        const timer = JSON.parse(savedTimer);
        if (timer.employee_id === currentEmployee.id) {
          setActiveTimer({
            ...timer,
            start_time: new Date(timer.start_time)
          });
        }
      } catch (error) {
        console.error('Error parsing saved timer:', error);
      }
    }
  }, [currentEmployee]);

  // Save active timer to localStorage
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem('activeTimer', JSON.stringify({
        employee_id: activeTimer.employee_id,
        project_id: activeTimer.project_id,
        start_time: activeTimer.start_time.toISOString(),
        description: activeTimer.description
      }));
    } else {
      localStorage.removeItem('activeTimer');
    }
  }, [activeTimer]);

  const startTimer = () => {
    if (!selectedProject || !currentEmployee) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    setActiveTimer({
      employee_id: currentEmployee.id,
      project_id: selectedProject,
      start_time: new Date(),
      description: description || undefined
    });

    setElapsedTime(0);
  };

  const pauseTimer = () => {
    if (!activeTimer || !currentEmployee) return;

    const endTime = new Date();
    const hoursWorked = (endTime.getTime() - activeTimer.start_time.getTime()) / (1000 * 60 * 60);

    // Create timesheet entry
    createTimesheetEntry({
      employee_id: currentEmployee.id,
      project_id: activeTimer.project_id,
      date: new Date().toISOString().split('T')[0],
      start_time: activeTimer.start_time.toISOString(),
      end_time: endTime.toISOString(),
      break_duration: 0,
      hours_worked: hoursWorked,
      description: activeTimer.description
    });

    setActiveTimer(null);
    setElapsedTime(0);
    setDescription('');
  };

  const createTimesheetEntry = async (entry: Partial<TimesheetEntry>) => {
    if (!currentEmployee) return;

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

      const { error } = await supabase
        .from('timesheets')
        .insert({
          ...entry,
          status: 'draft',
          organization_id: profile.organization_id
        });

      if (error) throw error;

      // Reload entries
      const loadTimesheetEntries = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
          .from('timesheets')
          .select('*, projects(*)')
          .eq('organization_id', profile.organization_id)
          .eq('employee_id', currentEmployee.id)
          .eq('date', today)
          .order('created_at', { ascending: false });

        setTodayEntries(todayData || []);

        const totalHours = todayData?.reduce((sum, entry) => sum + entry.hours_worked, 0) || 0;
        const totalEarnings = totalHours * (currentEmployee.hourly_rate || 0);
        const entriesCount = todayData?.length || 0;

        setTodayStats({
          totalHours,
          totalEarnings,
          entriesCount
        });
      };

      await loadTimesheetEntries();
    } catch (error: any) {
      console.error('Error creating timesheet entry:', error);
      alert(error.message || 'Erreur lors de la création de l\'entrée');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}min`;
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

  if (!currentEmployee) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Employé non trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Votre compte n'est pas associé à un employé actif
            </p>
            <Link href="/timesheets">
              <Button variant="primary" className="w-full">
                Retour aux feuilles de temps
              </Button>
            </Link>
          </CardContent>
        </Card>
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
              <Smartphone className="w-6 h-6 text-brand-orange" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Saisie Mobile</h1>
                <p className="text-xs text-gray-500">{currentEmployee.name}</p>
              </div>
            </div>
            <Link href="/timesheets" className="text-brand-orange">
              <History className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Timer Section */}
        <Card variant="default" padding="lg" className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-brand-orange mb-2">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-sm text-gray-600">
                {activeTimer ? 'Chronomètre en cours' : 'Prêt à démarrer'}
              </p>
            </div>

            {!activeTimer ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projet
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnelle)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Installation fenêtres"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={startTimer}
                  disabled={!selectedProject}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Démarrer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Travail en cours sur:
                  </p>
                  <p className="text-sm text-blue-700">
                    {projects.find(p => p.id === activeTimer.project_id)?.name}
                  </p>
                  {activeTimer.description && (
                    <p className="text-sm text-blue-700 mt-1">
                      {activeTimer.description}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={pauseTimer}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  {saving ? 'Enregistrement...' : 'Pause'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-orange">
                  {formatHours(todayStats.totalHours)}
                </p>
                <p className="text-xs text-gray-500">Heures</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(todayStats.totalEarnings)}
                </p>
                <p className="text-xs text-gray-500">Gains</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {todayStats.entriesCount}
                </p>
                <p className="text-xs text-gray-500">Entrées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Entries */}
        {todayEntries.length > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Entrées d'aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {entry.projects?.name || 'Projet inconnu'}
                        </p>
                        {entry.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {entry.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {new Date(entry.start_time).toLocaleTimeString('fr-CA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {entry.end_time && (
                            <span>
                              {new Date(entry.end_time).toLocaleTimeString('fr-CA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatHours(entry.hours_worked)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(entry.hours_worked * (currentEmployee.hourly_rate || 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Week Summary */}
        {weekEntries.length > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.projects?.name || 'Projet inconnu'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString('fr-CA', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-medium text-gray-900">
                        {formatHours(entry.hours_worked)}
                      </p>
                    </div>
                  </div>
                ))}
                {weekEntries.length > 5 && (
                  <div className="text-center pt-2">
                    <Link href="/timesheets" className="text-brand-orange text-sm hover:underline">
                      Voir tout ({weekEntries.length} entrées)
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/timesheets/new">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </Link>
          <Link href="/timesheets">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              Historique
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}