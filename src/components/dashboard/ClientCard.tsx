import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, FolderOpen, ChevronRight } from 'lucide-react'
import type { Client } from '@/types'
import { getInitials, pluralize } from '@/lib/utils'
import { getProjectsByClientId, mockProjects } from '@/lib/mock-data'

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  const projects = getProjectsByClientId(client.id)

  return (
    <Link href={`/clients/${client.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-card-hover hover:border-gray-200 transition-all group-hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#1B4FDE]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-[#1B4FDE]">
              {getInitials(client.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#1B4FDE] transition-colors truncate">
                {client.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1B4FDE] flex-shrink-0 ml-2 transition-colors" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{client.city}, {client.province}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-500">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>{pluralize(projects.length, 'projet', 'projets')}</span>
        </div>
      </div>
    </Link>
  )
}
