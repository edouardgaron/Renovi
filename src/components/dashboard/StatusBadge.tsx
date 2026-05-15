import React from 'react'
import { cn, getStatusLabel, getStatusColor, getStatusDotColor } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

interface StatusBadgeProps {
  status: ProjectStatus
  locale?: string
  showDot?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function StatusBadge({
  status,
  locale = 'fr',
  showDot = true,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        getStatusColor(status),
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            getStatusDotColor(status)
          )}
        />
      )}
      {getStatusLabel(status, locale)}
    </span>
  )
}
