'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { getProductionPricingSummary } from '@/lib/validate-production-config';
import { Users, DollarSign, FileText, Clock, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import AccessibleButton from '@/components/ui/AccessibleButton';

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get analytics data
      const analyticsData = analytics.getAllMetrics();
      const businessMetrics = analytics.getBusinessMetrics();
      const pricingSummary = getProductionPricingSummary();

      // Simulate API call to get real-time metrics
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMetrics({
        businessMetrics,
        analyticsData,
        pricingSummary,
        recentActivity: analyticsData.slice(0, 10),
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError('Failed to load metrics');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <AccessibleButton onClick={loadMetrics}>
            Retry
          </AccessibleButton>
        </div>
      </div>
    );
  }

  const { businessMetrics, analyticsData, pricingSummary, recentActivity } = metrics;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Metrics Dashboard</h1>
          <p className="text-gray-600">Real-time business metrics and user activity</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <AccessibleButton
              key={range}
              onClick={() => setTimeRange(range)}
              className={`${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </AccessibleButton>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{businessMetrics.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+{businessMetrics.newUsers} new</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{businessMetrics.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">Last 30 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{businessMetrics.upgradedUsers}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">{businessMetrics.conversionRate.toFixed(1)}% rate</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Documents</p>
                <p className="text-2xl font-bold text-gray-900">{businessMetrics.avgDocumentsPerUser}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Per user</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
            <div className="space-y-3">
              {Object.entries(businessMetrics.planDistribution).map(([plan, count]) => {
                const userCount = count as number;
                const percentage = ((userCount / businessMetrics.totalUsers) * 100).toFixed(1);
                return (
                  <div key={plan} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                      <span className="font-medium capitalize">{plan}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{userCount} users</span>
                      <span className="text-sm text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Professional Plan</span>
                  <span className="text-green-700 font-semibold">{pricingSummary.plans.professional.price}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">{pricingSummary.plans.professional.savings}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Business Plan</span>
                  <span className="text-blue-700 font-semibold">{pricingSummary.plans.business.price}</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">{pricingSummary.plans.business.savings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audio (min)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.map((user: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.userId?.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                        user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                        user.plan === 'business' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.documentsProcessed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.audioMinutesUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastActiveAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <AccessibleButton onClick={loadMetrics} leftIcon={<Activity className="h-4 w-4" />}>
            Refresh Metrics
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}