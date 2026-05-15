'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProjectCard from '@/components/dashboard/ProjectCard'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { mockProjects } from '@/lib/mock-data'
import type { ProjectStatus } from '@/types'

const STATUS_FILTERS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Brouillon', value: 'draft' },
  { label: 'Invitation envoyée', value: 'invitation_sent' },
  { label: 'Photos reçues', value: 'photos_received' },
  { label: 'En analyse', value: 'analyzing' },
  { label: 'Rapport prêt', value: 'report_ready' },
  { label: 'Terminé', value: 'completed' },
]

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-500 mt-1">
            {mockProjects.length} projet{mockProjects.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2 bg-[#1B4FDE] hover:bg-[#1640C4]">
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, client ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-[#1B4FDE] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Aucun projet trouvé
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {search || statusFilter !== 'all'
              ? 'Essayez de modifier vos filtres de recherche.'
              : 'Créez votre premier projet pour commencer.'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link href="/projects/new">
              <Button className="bg-[#1B4FDE] hover:bg-[#1640C4]">
                <Plus className="w-4 h-4 mr-2" />
                Créer un projet
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
