import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  trend?: 'up' | 'down'
  subtitle?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
  subtitle,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-brand-navy">{icon}</div>
        {change !== undefined && (
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {change >= 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        )}
      </div>

      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-brand-navy mb-2">{value}</p>

      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-gray-500">vs mois précédent</span>
        </div>
      )}
    </div>
  )
}
