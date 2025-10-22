'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Clock, 
  Plus, 
  Calendar, 
  User, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Smartphone,
  Timer
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  hourly_rate: number;
  position?: string;
}

interface Project {
  id: string;
  name: string;
  client_name?: string;
  address?: string;
  status: string;
}

interface TimesheetEntry {
  id: string;
  employee_id: string;
  project_id: string;
  date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  hours_worked: number;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  employees?: Employee;
  projects?: Project;
}

interface TimesheetStats {
  totalHours: number;
  totalCost: number;
  thisWeekHours: number;
  thisWeekCost: number;
  pendingEntries: number;
  approvedEntries: number;
  averageHoursPerDay: number;
  topEmployees: Array<{ employee: Employee; hours: number; cost: number }>;
  topProjects: Array<{ project: Project; hours: number; cost: number }>;
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<TimesheetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const supabase = createClient();

  const loadTimesheets = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      // Calculate date range based on filter
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
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const { data: timesheetsData } = await supabase
        .from('timesheets')
        .select(`
          *,
          employees(*),
          projects(*)
        `)
        .eq('organization_id', profile.organization_id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      setTimesheets(timesheetsData || []);
    } catch (error) {
      console.error('Error loading timesheets:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, dateFilter]);

  const loadEmployees = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) return;

      const { data: employeesData } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('active', true)
        .order('name', { ascending: true });

      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error loading employees:', error);
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

  const loadStats = useCallback(async () => {
    try {
      // Calculate stats from timesheets
      const totalHours = timesheets.reduce((sum, entry) => sum + entry.hours_worked, 0);
      const totalCost = timesheets.reduce((sum, entry) => {
        const hourlyRate = entry.employees?.hourly_rate || 0;
        return sum + (entry.hours_worked * hourlyRate);
      }, 0);

      // This week stats
      const now = new Date();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisWeekTimesheets = timesheets.filter(entry => 
        new Date(entry.date) >= weekStart
      );
      
      const thisWeekHours = thisWeekTimesheets.reduce((sum, entry) => sum + entry.hours_worked, 0);
      const thisWeekCost = thisWeekTimesheets.reduce((sum, entry) => {
        const hourlyRate = entry.employees?.hourly_rate || 0;
        return sum + (entry.hours_worked * hourlyRate);
      }, 0);

      // Status counts
      const pendingEntries = timesheets.filter(entry => entry.status === 'submitted').length;
      const approvedEntries = timesheets.filter(entry => entry.status === 'approved').length;

      // Average hours per day
      const uniqueDays = new Set(timesheets.map(entry => entry.date)).size;
      const averageHoursPerDay = uniqueDays > 0 ? totalHours / uniqueDays : 0;

      // Top employees
      const employeeHours: Record<string, { employee: Employee; hours: number; cost: number }> = {};
      timesheets.forEach(entry => {
        if (entry.employees) {
          const employeeId = entry.employee_id;
          const hours = entry.hours_worked;
          const cost = hours * (entry.employees.hourly_rate || 0);
          
          if (!employeeHours[employeeId]) {
            employeeHours[employeeId] = { employee: entry.employees, hours: 0, cost: 0 };
          }
          
          employeeHours[employeeId].hours += hours;
          employeeHours[employeeId].cost += cost;
        }
      });

      const topEmployees = Object.values(employeeHours)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5);

      // Top projects
      const projectHours: Record<string, { project: Project; hours: number; cost: number }> = {};
      timesheets.forEach(entry => {
        if (entry.projects) {
          const projectId = entry.project_id;
          const hours = entry.hours_worked;
          const cost = hours * (entry.employees?.hourly_rate || 0);
          
          if (!projectHours[projectId]) {
            projectHours[projectId] = { project: entry.projects, hours: 0, cost: 0 };
          }
          
          projectHours[projectId].hours += hours;
          projectHours[projectId].cost += cost;
        }
      });

      const topProjects = Object.values(projectHours)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5);

      setStats({
        totalHours,
        totalCost,
        thisWeekHours,
        thisWeekCost,
        pendingEntries,
        approvedEntries,
        averageHoursPerDay,
        topEmployees,
        topProjects
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [timesheets]);

  useEffect(() => {
    loadTimesheets();
    loadEmployees();
    loadProjects();
  }, [loadTimesheets, loadEmployees, loadProjects]);

  useEffect(() => {
    if (timesheets.length > 0) {
      loadStats();
    }
  }, [timesheets, loadStats]);

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = searchTerm === '' || 
      timesheet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.employees?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.projects?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || timesheet.status === statusFilter;
    const matchesEmployee = selectedEmployee === 'all' || timesheet.employee_id === selectedEmployee;
    const matchesProject = selectedProject === 'all' || timesheet.project_id === selectedProject;
    
    return matchesSearch && matchesStatus && matchesEmployee && matchesProject;
  });

  const handleApprove = async (timesheetId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('timesheets')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', timesheetId);

      if (error) throw error;

      // Reload timesheets
      await loadTimesheets();
    } catch (error: any) {
      console.error('Error approving timesheet:', error);
      alert(error.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (timesheetId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('timesheets')
        .update({
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', timesheetId);

      if (error) throw error;

      // Reload timesheets
      await loadTimesheets();
    } catch (error: any) {
      console.error('Error rejecting timesheet:', error);
      alert(error.message || 'Erreur lors du rejet');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}min`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      submitted: <AlertCircle className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <AlertCircle className="w-4 h-4" />,
    };

    return icons[status as keyof typeof icons] || icons.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      submitted: 'Soumis',
      approved: 'Approuvé',
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
          <h1 className="text-3xl font-bold text-ui-text">Feuilles de Temps</h1>
          <p className="text-ui-text-muted mt-1">Suivez les heures de vos employés et les coûts de main-d'œuvre</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Link href="/timesheets/mobile">
            <Button variant="outline" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Saisie Mobile
            </Button>
          </Link>
          <Link href="/timesheets/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Entrée
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
                  <p className="text-sm text-ui-text-muted">Heures totales</p>
                  <p className="text-2xl font-bold text-ui-text">{formatHours(stats.totalHours)}</p>
                  <p className="text-xs text-ui-success mt-1">
                    {formatHours(stats.thisWeekHours)} cette semaine
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Coût total</p>
                  <p className="text-2xl font-bold text-ui-text">{formatCurrency(stats.totalCost)}</p>
                  <p className="text-xs text-ui-success mt-1">
                    {formatCurrency(stats.thisWeekCost)} cette semaine
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
                  <p className="text-sm text-ui-text-muted">En attente</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.pendingEntries}</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    {stats.approvedEntries} approuvées
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Timer className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ui-text-muted">Moyenne/jour</p>
                  <p className="text-2xl font-bold text-ui-text">{formatHours(stats.averageHoursPerDay)}</p>
                  <p className="text-xs text-ui-text-muted mt-1">
                    Par employé actif
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Performers */}
      {stats && (stats.topEmployees.length > 0 || stats.topProjects.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.topEmployees.length > 0 && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Employés les plus actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topEmployees.map((item, index) => (
                    <div key={item.employee.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center text-sm font-medium text-brand-orange">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.employee.name}</p>
                          <p className="text-xs text-gray-500">{item.employee.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatHours(item.hours)}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.cost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats.topProjects.length > 0 && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Projets les plus chronophages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topProjects.map((item, index) => (
                    <div key={item.project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center text-sm font-medium text-brand-orange">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.project.name}</p>
                          <p className="text-xs text-gray-500">{item.project.client_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatHours(item.hours)}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.cost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                placeholder="Rechercher par employé, projet ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillons</option>
                <option value="submitted">Soumis</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="all">Tous les employés</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timesheets List */}
      {!timesheets || timesheets.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent className="pt-6 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune feuille de temps
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer une entrée de temps ou utilisez la saisie mobile
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/timesheets/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Entrée
                </Button>
              </Link>
              <Link href="/timesheets/mobile">
                <Button variant="outline">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Saisie Mobile
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
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
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
              {filteredTimesheets.map((timesheet) => (
                <tr key={timesheet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                        {timesheet.employees?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {timesheet.employees?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${timesheet.employees?.hourly_rate || 0}/h
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {timesheet.projects?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {timesheet.projects?.client_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(timesheet.date).toLocaleDateString('fr-CA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatHours(timesheet.hours_worked)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(timesheet.hours_worked * (timesheet.employees?.hourly_rate || 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 justify-center ${getStatusColor(timesheet.status)}`}>
                      {getStatusIcon(timesheet.status)}
                      {getStatusLabel(timesheet.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/timesheets/${timesheet.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/timesheets/${timesheet.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {timesheet.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => handleApprove(timesheet.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Raison du rejet:');
                              if (reason) {
                                handleReject(timesheet.id, reason);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Rejeter"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        </>
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