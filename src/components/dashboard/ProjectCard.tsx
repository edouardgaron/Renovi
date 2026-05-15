import React from 'react'
import Link from 'next/link'
import { MapPin, Camera, Calendar, ChevronRight } from 'lucide-react'
import type { Project } from '@/types'
import { formatRelativeDate, pluralize } from '@/lib/utils'
import { BUILDING_TYPE_LABELS } from '@/lib/constants'
import StatusBadge from './StatusBadge'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-card-hover hover:border-gray-200 transition-all group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#1B4FDE] transition-colors">
                {project.name}
              </h3>
              <StatusBadge status={project.status} size="sm" />
            </div>
            {project.client && (
              <p className="text-sm text-gray-500 mb-2">{project.client.name}</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1B4FDE] flex-shrink-0 mt-1 transition-colors" />
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{project.city}, {project.province}</span>
          </div>
          <div className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{pluralize(project.photos.length, 'photo', 'photos')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatRelativeDate(project.updated_at)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
            {BUILDING_TYPE_LABELS[project.building_type]?.fr ?? project.building_type}
          </span>
        </div>
      </div>
    </Link>
  )
}
