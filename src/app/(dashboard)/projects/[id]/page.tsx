'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  FileText,
  Camera,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  Ruler,
  Box,
  ExternalLink,
  Download,
  Loader2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { getProjectById } from '@/lib/mock-data'
import { formatDate, formatArea, formatDimension } from '@/lib/utils'
import { BUILDING_TYPE_LABELS, PHOTO_ANGLES } from '@/lib/constants'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

const HouseViewer3D = dynamic(() => import('@/components/3d/HouseViewer3D'), { ssr: false })

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = Array.isArray(params.id) ? params.id[0] : (params.id ?? 'project-001')
  const rawProject = getProjectById(projectId)
  const [sendingInvite, setSendingInvite] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [show3D, setShow3D] = useState(false)
  const [matColors, setMatColors] = useState({
    wall_color: rawProject?.materials?.wall_color ?? '#C8A882',
    roof_color: rawProject?.materials?.roof_color ?? '#3D3D3D',
    trim_color: rawProject?.materials?.trim_color ?? '#FFFFFF',
    door_color: rawProject?.materials?.door_color ?? '#8B4513',
  })

  if (!rawProject) {
    notFound()
    return null
  }

  const project = rawProject

  async function handleDownloadPDF() {
    setDownloadingPDF(true)
    const toastId = toast.loading(`Génération du rapport PDF...`)
    await new Promise((r) => setTimeout(r, 1800))
    const content = `RAPPORT RENOVI\n\nProjet: ${project.name}\nAdresse: ${project.address}, ${project.city}\nClient: ${project.client?.name ?? '—'}\nDate: ${new Date().toLocaleDateString('fr-CA')}\n\nMESURES\nSurface murale: ${project.measurements.wall_surface ?? '—'} pi²\nSurface toiture: ${project.measurements.roof_surface ?? '—'} pi²\nFenêtres: ${project.measurements.window_count ?? '—'}\nPortes: ${project.measurements.door_count ?? '—'}\n\n* Mesures estimées — à valider sur place.\nRenovi © ${new Date().getFullYear()}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `renovi-${project.name.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.dismiss(toastId)
    toast.success('Rapport téléchargé !')
    setDownloadingPDF(false)
  }

  async function handleSendInvitation() {
    setSendingInvite(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Invitation envoyée avec succès!')
    } catch {
      toast.error('Erreur lors de l\'envoi de l\'invitation.')
    } finally {
      setSendingInvite(false)
    }
  }

  const measurements = project.measurements
  const hasMeasurements = measurements.wall_surface !== null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 3D Viewer Modal */}
      {show3D && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Visualisation 3D — {project.name}</h2>
                <p className="text-sm text-gray-500">Modifiez les couleurs et matériaux en temps réel</p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setShow3D(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-[70vh]">
              <HouseViewer3D
                wallColor={matColors.wall_color}
                roofColor={matColors.roof_color}
                trimColor={matColors.trim_color}
                doorColor={matColors.door_color}
                onMaterialChange={(key: string, value: string) =>
                  setMatColors((prev) => ({ ...prev, [key]: value }))
                }
              />
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon-sm" className="rounded-lg mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.address}, {project.city}, {project.province}
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {BUILDING_TYPE_LABELS[project.building_type]?.fr}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {(project.status === 'draft' || project.status === 'invitation_sent') && (
            <Button
              onClick={handleSendInvitation}
              disabled={sendingInvite}
              className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
              size="sm"
            >
              {sendingInvite ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {project.status === 'invitation_sent' ? 'Renvoyer l\'invitation' : 'Envoyer invitation'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShow3D(true)}
          >
            <Box className="w-4 h-4" />
            Visualisation 3D
          </Button>
          {(project.status === 'report_ready' || project.status === 'completed') && (
            <Button
              className="gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
            >
              {downloadingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Télécharger PDF
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="photos">
            Photos ({project.photos.length})
          </TabsTrigger>
          <TabsTrigger value="measurements">Mesures</TabsTrigger>
          <TabsTrigger value="materials">Matériaux</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-5 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client Info */}
            {project.client && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Client
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{project.client.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <a
                      href={`mailto:${project.client.email}`}
                      className="hover:text-[#1B4FDE]"
                    >
                      {project.client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{project.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {project.client.address}, {project.client.city}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <Link href={`/clients/${project.client.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <ExternalLink className="w-3 h-3" />
                      Voir le profil client
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Project Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                Détails du projet
              </h3>
              <dl className="space-y-3">
                {[
                  { label: 'Type', value: BUILDING_TYPE_LABELS[project.building_type]?.fr },
                  { label: 'Statut', value: <StatusBadge status={project.status} size="sm" /> },
                  { label: 'Créé le', value: formatDate(project.created_at) },
                  { label: 'Modifié le', value: formatDate(project.updated_at) },
                  { label: 'Photos', value: `${project.photos.length} photo${project.photos.length !== 1 ? 's' : ''}` },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between">
                    <dt className="text-sm text-gray-500">{item.label}</dt>
                    <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {project.notes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Notes internes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{project.notes}</p>
            </div>
          )}

          {/* Status timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Progression du projet</h3>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['draft', 'invitation_sent', 'photos_received', 'analyzing', 'report_ready', 'completed'].map(
                (status, i) => {
                  const statuses = ['draft', 'invitation_sent', 'photos_received', 'analyzing', 'report_ready', 'completed']
                  const currentIdx = statuses.indexOf(project.status)
                  const stepIdx = i
                  const isCompleted = stepIdx < currentIdx
                  const isCurrent = stepIdx === currentIdx
                  return (
                    <React.Fragment key={status}>
                      <div
                        className={`flex-shrink-0 flex flex-col items-center gap-1 ${
                          isCompleted
                            ? 'text-[#1B4FDE]'
                            : isCurrent
                            ? 'text-[#1B4FDE]'
                            : 'text-gray-300'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            isCompleted
                              ? 'bg-[#1B4FDE] border-[#1B4FDE]'
                              : isCurrent
                              ? 'bg-white border-[#1B4FDE] ring-2 ring-blue-100'
                              : 'bg-white border-gray-200'
                          }`}
                        />
                        <StatusBadge
                          status={status as import('@/types').ProjectStatus}
                          size="sm"
                          showDot={false}
                          className={`text-2xs ${!isCompleted && !isCurrent ? 'opacity-40' : ''}`}
                        />
                      </div>
                      {i < 5 && (
                        <div
                          className={`flex-1 h-0.5 min-w-4 ${
                            isCompleted ? 'bg-[#1B4FDE]' : 'bg-gray-100'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  )
                }
              )}
            </div>
          </div>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="mt-5">
          {project.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? photo.angle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">
                      {PHOTO_ANGLES[photo.angle]?.label_fr ?? photo.angle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Camera className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 mb-1">Aucune photo reçue</p>
              <p className="text-sm text-gray-500 mb-5">
                Envoyez une invitation au client pour recevoir des photos.
              </p>
              <Button
                onClick={handleSendInvitation}
                className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
                size="sm"
              >
                <Send className="w-4 h-4" />
                Envoyer invitation
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Measurements Tab */}
        <TabsContent value="measurements" className="mt-5">
          {hasMeasurements ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Largeur de façade',
                  value: measurements.facade_width ? formatDimension(measurements.facade_width) : '—',
                  icon: Ruler,
                },
                {
                  label: 'Hauteur du bâtiment',
                  value: measurements.building_height ? formatDimension(measurements.building_height) : '—',
                  icon: Ruler,
                },
                {
                  label: 'Surface murale',
                  value: measurements.wall_surface ? formatArea(measurements.wall_surface) : '—',
                  icon: Ruler,
                },
                {
                  label: 'Surface de toiture',
                  value: measurements.roof_surface ? formatArea(measurements.roof_surface) : '—',
                  icon: Ruler,
                },
                {
                  label: 'Périmètre',
                  value: measurements.perimeter ? formatDimension(measurements.perimeter) : '—',
                  icon: Ruler,
                },
                {
                  label: 'Nombre de fenêtres',
                  value: measurements.window_count?.toString() ?? '—',
                  icon: Box,
                },
                {
                  label: 'Nombre de portes',
                  value: measurements.door_count?.toString() ?? '—',
                  icon: Box,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#1B4FDE]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}

              {measurements.confidence_level && (
                <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Niveau de confiance</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className={`w-3 h-3 rounded-full ${
                                measurements.confidence_level === 'high' ||
                                (measurements.confidence_level === 'medium' && dot <= 2) ||
                                (measurements.confidence_level === 'low' && dot <= 1)
                                  ? 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium capitalize text-green-700">
                          {measurements.confidence_level === 'high'
                            ? 'Élevé'
                            : measurements.confidence_level === 'medium'
                            ? 'Moyen'
                            : 'Faible'}
                        </span>
                      </div>
                    </div>
                    {measurements.notes && (
                      <p className="text-sm text-gray-500 flex-1">{measurements.notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Ruler className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 mb-1">Aucune mesure disponible</p>
              <p className="text-sm text-gray-500">
                Les mesures seront générées automatiquement après réception et analyse des photos.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="mt-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-6">
            <h3 className="font-semibold text-gray-900">Configuration des matériaux</h3>

            {project.materials.wall_material ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Couleur des murs', color: project.materials.wall_color },
                  { label: 'Couleur de toiture', color: project.materials.roof_color },
                  { label: 'Couleur des garnitures', color: project.materials.trim_color },
                  { label: 'Couleur de porte', color: project.materials.door_color },
                  { label: 'Couleur accent', color: project.materials.accent_color },
                ].map((item) => (
                  item.color && (
                    <div key={item.label} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-mono font-medium text-gray-900">
                          {item.color}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Aucun matériau configuré. Utilisez le configurateur 3D pour définir les couleurs et matériaux.
              </p>
            )}

            <div className="pt-4 border-t border-gray-50">
              <Button className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2" onClick={() => setShow3D(true)}>
                <Box className="w-4 h-4" />
                Ouvrir le configurateur 3D
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
