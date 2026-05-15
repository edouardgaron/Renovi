'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  FolderOpen,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  Shield,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { mockCompany } from '@/lib/mock-data'
import { getSessionUser, clearSession } from '@/lib/mock-auth'
import type { User } from '@/types'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Tableau de bord' },
  { href: '/projects', icon: FolderOpen, label: 'Projets' },
  { href: '/clients', icon: Users, label: 'Clients' },
  { href: '/reports', icon: FileText, label: 'Rapports' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
]

const roleLabel: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrateur', color: 'text-purple-400' },
  company: { label: 'Entreprise', color: 'text-blue-400' },
  employee: { label: 'Employé', color: 'text-green-400' },
  client: { label: 'Client', color: 'text-orange-400' },
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getSessionUser())
  }, [])

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  const role = user?.role ? roleLabel[user.role] : null

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1B4FDE] rounded-lg flex items-center justify-center shadow-sm">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Renovi</span>
        </Link>
      </div>

      {/* Company info */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-[#1B4FDE]/20 rounded-lg flex items-center justify-center">
            {user?.role === 'admin' ? (
              <Shield className="w-4 h-4 text-purple-400" />
            ) : (
              <Building2 className="w-4 h-4 text-[#6089FA]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.role === 'admin' ? 'Renovi Admin' : mockCompany.name}
            </p>
            <p className="text-xs text-slate-400">
              {user?.role === 'admin' ? 'Accès complet' : 'Plan Pro'}
            </p>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#1B4FDE] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-8 h-8 bg-[#1B4FDE] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? 'Chargement...'}
            </p>
            {role && (
              <p className={`text-xs font-medium ${role.color}`}>{role.label}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
