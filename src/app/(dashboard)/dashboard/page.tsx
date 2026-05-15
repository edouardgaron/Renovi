import React from 'react'
import Link from 'next/link'
import {
  FolderOpen,
  Users,
  FileText,
  Camera,
  Send,
  Plus,
  ArrowRight,
  Clock,
  UserPlus,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import StatsCard from '@/components/dashboard/StatsCard'
import ProjectCard from '@/components/dashboard/ProjectCard'
import {
  mockDashboardStats,
  mockProjects,
  mockActivity,
  mockUser,
} from '@/lib/mock-data'
import { formatRelativeDate } from '@/lib/utils'

const activityIcons = {
  project_created: FolderOpen,
  client_added: UserPlus,
  invitation_sent: Send,
  photos_received: Camera,
  report_generated: CheckCircle,
}

const activityColors: Record<string, string> = {
  project_created: 'bg-blue-50 text-blue-600',
  client_added: 'bg-purple-50 text-purple-600',
  invitation_sent: 'bg-orange-50 text-orange-600',
  photos_received: 'bg-green-50 text-green-600',
  report_generated: 'bg-emerald-50 text-emerald-600',
}

export default function DashboardPage() {
  const recentProjects = mockProjects.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {mockUser.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de votre activité récente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/clients/new">
            <Button variant="outline" size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouveau client
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button size="sm" className="gap-2 bg-[#1B4FDE] hover:bg-[#1640C4]">
              <Plus className="w-4 h-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Projets actifs"
          value={mockDashboardStats.active_projects}
          icon={FolderOpen}
          color="blue"
          trend={12}
          description="Ce mois"
        />
        <StatsCard
          title="Clients"
          value={mockDashboardStats.total_clients}
          icon={Users}
          color="purple"
          trend={5}
          description="Total"
        />
        <StatsCard
          title="Rapports générés"
          value={mockDashboardStats.reports_generated}
          icon={FileText}
          color="green"
          description="Ce mois"
        />
        <StatsCard
          title="Photos reçues"
          value={mockDashboardStats.photos_received}
          icon={Camera}
          color="orange"
          description="Ce mois"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Projets récents</h2>
            <Link
              href="/projects"
              className="text-sm text-[#1B4FDE] hover:underline flex items-center gap-1"
            >
              Voir tous
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {mockActivity.map((item) => {
              const Icon = activityIcons[item.type] ?? Clock
              const colorClass = activityColors[item.type] ?? 'bg-gray-50 text-gray-600'
              return (
                <div key={item.id} className="p-4 flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeDate(item.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#1B4FDE] to-[#1640C4] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Prêt à démarrer un nouveau projet?</h3>
            <p className="text-blue-200 text-sm">
              Ajoutez un client et envoyez-lui une invitation photo en moins de 2 minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/clients/new">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white gap-2">
                <UserPlus className="w-4 h-4" />
                Ajouter un client
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button className="bg-white text-[#1B4FDE] hover:bg-gray-50 gap-2">
                <Plus className="w-4 h-4" />
                Créer un projet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
