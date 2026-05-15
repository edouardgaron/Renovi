import React from 'react'
import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'slate'
  className?: string
}

const colorMap = {
  blue: {
    icon: 'bg-blue-50 text-[#1B4FDE]',
    value: 'text-[#1B4FDE]',
  },
  green: {
    icon: 'bg-green-50 text-green-600',
    value: 'text-green-700',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    value: 'text-purple-700',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600',
    value: 'text-orange-700',
  },
  slate: {
    icon: 'bg-slate-50 text-slate-600',
    value: 'text-slate-700',
  },
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend >= 0
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            )}
          >
            <TrendingUp className={cn('w-3 h-3', trend < 0 && 'rotate-180')} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className={cn('text-2xl font-bold', colors.value)}>{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
