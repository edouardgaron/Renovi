'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FileText, Download, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { mockProjects } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const reportsReady = mockProjects.filter(
    (p) => p.status === 'report_ready' || p.status === 'completed'
  )

  async function handleDownloadPDF(projectId: string, projectName: string) {
    setDownloading(projectId)
    const toastId = toast.loading(`Génération du rapport "${projectName}"...`)
    await new Promise((r) => setTimeout(r, 1800))

    // Create a simple mock PDF as a data URL and trigger download
    const content = `RAPPORT RENOVI\n\nProjet: ${projectName}\nDate: ${new Date().toLocaleDateString('fr-CA')}\n\nCe rapport a été généré par Renovi.\nVersion démo — intégration @react-pdf/renderer disponible.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `renovi-rapport-${projectName.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.dismiss(toastId)
    toast.success(`Rapport "${projectName}" téléchargé !`)
    setDownloading(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="text-gray-500 mt-1">
          {reportsReady.length} rapport{reportsReady.length !== 1 ? 's' : ''} disponible{reportsReady.length !== 1 ? 's' : ''}
        </p>
      </div>

      {reportsReady.length > 0 ? (
        <div className="space-y-3">
          {reportsReady.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                  <StatusBadge status={project.status} size="sm" />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {project.client?.name} · Modifié le {formatDate(project.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Voir
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="gap-1.5 bg-[#1B4FDE] hover:bg-[#1640C4]"
                  disabled={downloading === project.id}
                  onClick={() => handleDownloadPDF(project.id, project.name)}
                >
                  {downloading === project.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Aucun rapport disponible
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Les rapports seront disponibles une fois les photos analysées.
          </p>
          <Link href="/projects">
            <Button className="bg-[#1B4FDE] hover:bg-[#1640C4]">
              Voir les projets
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
