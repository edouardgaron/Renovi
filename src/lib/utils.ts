import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ProjectStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, formatStr = 'dd MMM yyyy'): string {
  try {
    return format(new Date(dateString), formatStr, { locale: fr })
  } catch {
    return dateString
  }
}

export function formatDateLong(dateString: string): string {
  try {
    return format(new Date(dateString), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })
  } catch {
    return dateString
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr })
  } catch {
    return dateString
  }
}

export function formatCurrency(amount: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatArea(sqMeters: number): string {
  return `${sqMeters.toFixed(1)} m²`
}

export function formatDimension(meters: number): string {
  return `${meters.toFixed(2)} m`
}

export function getStatusLabel(status: ProjectStatus, locale = 'fr'): string {
  const labels: Record<ProjectStatus, { fr: string; en: string }> = {
    draft: { fr: 'Brouillon', en: 'Draft' },
    invitation_sent: { fr: 'Invitation envoyée', en: 'Invitation Sent' },
    photos_received: { fr: 'Photos reçues', en: 'Photos Received' },
    analyzing: { fr: 'En analyse', en: 'Analyzing' },
    report_ready: { fr: 'Rapport prêt', en: 'Report Ready' },
    completed: { fr: 'Terminé', en: 'Completed' },
  }
  return labels[status]?.[locale as 'fr' | 'en'] ?? status
}

export function getStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    invitation_sent: 'bg-blue-50 text-blue-700 border-blue-200',
    photos_received: 'bg-purple-50 text-purple-700 border-purple-200',
    analyzing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    report_ready: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-600'
}

export function getStatusDotColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    draft: 'bg-gray-400',
    invitation_sent: 'bg-blue-500',
    photos_received: 'bg-purple-500',
    analyzing: 'bg-yellow-500',
    report_ready: 'bg-green-500',
    completed: 'bg-emerald-500',
  }
  return colors[status] ?? 'bg-gray-400'
}

export function generateInvitationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = 'tkn_'
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}
