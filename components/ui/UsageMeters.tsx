'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, FileText, Clock, HardDrive, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface UsageData {
  documents: number;
  audioMinutes: number;
  storageGB: number;
  aiRequests: number;
}

interface UsageMetersProps {
  currentUsage: UsageData | null;
  plan: string;
  className?: string;
}

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
    documents: 10,
    audioMinutes: 30,
    storageGB: 1,
    aiRequests: 50,
  },
  pro: {
    documents: 100,
    audioMinutes: 180,
    storageGB: 20,
    aiRequests: 500,
  },
  business: {
    documents: 1000,
    audioMinutes: 600,
    storageGB: 100,
    aiRequests: 2000,
  },
  teams: {
    documents: -1, // Unlimited
    audioMinutes: -1,
    storageGB: 500,
    aiRequests: -1,
  },
};

interface MeterConfig {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  unit: string;
  warningThreshold: number;
}

const METER_CONFIGS: Record<keyof UsageData, MeterConfig> = {
  documents: {
    label: 'Documents',
    icon: FileText,
    color: 'blue',
    unit: 'docs',
    warningThreshold: 80,
  },
  audioMinutes: {
    label: 'Audio Minutes',
    icon: Clock,
    color: 'green',
    unit: 'min',
    warningThreshold: 80,
  },
  storageGB: {
    label: 'Storage',
    icon: HardDrive,
    color: 'purple',
    unit: 'GB',
    warningThreshold: 80,
  },
  aiRequests: {
    label: 'AI Requests',
    icon: Zap,
    color: 'orange',
    unit: 'requests',
    warningThreshold: 80,
  },
};

export default function UsageMeters({ currentUsage, plan, className = '' }: UsageMetersProps) {
  const t = useTranslations('billing');
  const [animatedValues, setAnimatedValues] = useState<UsageData>({
    documents: 0,
    audioMinutes: 0,
    storageGB: 0,
    aiRequests: 0,
  });

  const limits = PLAN_LIMITS[plan.toLowerCase() as keyof typeof PLAN_LIMITS];

  // Animate values on mount
  useEffect(() => {
    if (currentUsage) {
      const timer = setTimeout(() => {
        setAnimatedValues(currentUsage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUsage]);

  if (!currentUsage || !limits) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getMeterColor = (percentage: number) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 80) return 'orange';
    return 'brand-blue';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'GB') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  return (
    <div className={`bg-card p-6 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-blue" />
          {t('usage_meters')}
        </h3>
        <span className="text-sm text-muted-foreground capitalize">
          {plan} Plan
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(METER_CONFIGS).map(([key, config]) => {
          const usageKey = key as keyof UsageData;
          const used = animatedValues[usageKey];
          const limit = limits[usageKey];
          const percentage = getUsagePercentage(used, limit);
          const isUnlimited = limit === -1;
          const Icon = config.icon;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: parseInt(key) * 0.1 }}
              className="space-y-2"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatValue(used, config.unit)}
                    {isUnlimited ? '' : ` / ${formatValue(limit, config.unit)}`}
                  </span>

                  {!isUnlimited && percentage >= 80 && (
                    <AlertTriangle className={`h-4 w-4 text-${getMeterColor(percentage)}-500`} />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {!isUnlimited ? (
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full bg-${getMeterColor(percentage)}-500 rounded-full transition-colors`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Percentage label */}
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}% used
                    </span>
                    {percentage >= 80 && (
                      <span className={`text-xs text-${getMeterColor(percentage)}-500 font-medium`}>
                        {percentage >= 90 ? 'Limit reached' : 'Approaching limit'}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Unlimited
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-brand-blue">
              {Object.values(animatedValues).reduce((sum, val) => sum + val, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Actions</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-brand-green flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {plan !== 'free' ? 'Active' : 'Free'}
            </div>
            <div className="text-xs text-muted-foreground">Plan Status</div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
              <p className="text-xs text-muted-foreground">
                Get 10x more documents, audio minutes, and storage
              </p>
            </div>
            <button className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue-dark transition-colors">
              Upgrade
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}