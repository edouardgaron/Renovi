'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Camera,
  AlertCircle,
  Save,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProjectById } from '@/lib/mock-data'
import { PHOTO_ANGLES } from '@/lib/constants'
import type { ProjectMeasurements } from '@/types'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisState {
  loading: boolean
  progress: number
  progressStep: string
  done: boolean
  measurements: ProjectMeasurements | null
  isMock: boolean
  error: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROGRESS_STEPS = [
  { label: 'Envoi des photos...', pct: 15 },
  { label: 'Analyse en cours...', pct: 40 },
  { label: 'Extraction des données...', pct: 70 },
  { label: 'Calcul des surfaces...', pct: 90 },
  { label: 'Finalisation...', pct: 100 },
]

const CONFIDENCE_CONFIG: Record<
  'high' | 'medium' | 'low',
  { label: string; dotColor: string; badgeClass: string; barColor: string; barWidth: string }
> = {
  high: {
    label: 'Élevé',
    dotColor: 'bg-green-500',
    badgeClass: 'bg-green-50 text-green-700 border-green-200',
    barColor: 'bg-green-500',
    barWidth: 'w-full',
  },
  medium: {
    label: 'Moyen',
    dotColor: 'bg-yellow-500',
    badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    barColor: 'bg-yellow-400',
    barWidth: 'w-2/3',
  },
  low: {
    label: 'Faible',
    dotColor: 'bg-red-500',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    barColor: 'bg-red-500',
    barWidth: 'w-1/3',
  },
}

const ROOF_STYLE_LABELS: Record<string, string> = {
  gable: 'Pignon',
  hip: 'Croupe',
  mansard: 'Mansarde',
  flat: 'Plat',
  gambrel: 'Gambrel',
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AnalysePage() {
  const params = useParams()
  const projectId = Array.isArray(params.id) ? params.id[0] : (params.id ?? '')
  const project = getProjectById(projectId)

  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    progress: 0,
    progressStep: '',
    done: false,
    measurements: project?.measurements ?? null,
    isMock: false,
    error: null,
  })

  const [applied, setApplied] = useState(false)
  const [editedMeasurements, setEditedMeasurements] = useState<ProjectMeasurements | null>(
    analysis.measurements
  )

  if (!project) {
    notFound()
    return null
  }

  // project is defined here — satisfies TypeScript after the guard
  const safeProject = project
  const hasPhotos = safeProject.photos.length > 0

  // ─── Analysis handler ─────────────────────────────────────────────────────

  async function runAnalysis() {
    if (!hasPhotos) {
      toast.error('Ce projet n\'a pas encore de photos à analyser.')
      return
    }

    setAnalysis((prev) => ({
      ...prev,
      loading: true,
      progress: 0,
      progressStep: PROGRESS_STEPS[0].label,
      done: false,
      error: null,
    }))
    setApplied(false)

    // Animate progress bar
    let stepIdx = 0
    const progressInterval = setInterval(() => {
      stepIdx++
      if (stepIdx < PROGRESS_STEPS.length) {
        setAnalysis((prev) => ({
          ...prev,
          progress: PROGRESS_STEPS[stepIdx].pct,
          progressStep: PROGRESS_STEPS[stepIdx].label,
        }))
      } else {
        clearInterval(progressInterval)
      }
    }, 700)

    try {
      const images = safeProject.photos.map((p) => p.url)

      const res = await fetch('/api/analyze-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          projectName: safeProject.name,
          address: `${safeProject.address}, ${safeProject.city}`,
        }),
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const errData = (await res.json()) as { error: string }
        throw new Error(errData.error ?? 'Erreur serveur')
      }

      const data = (await res.json()) as {
        measurements: ProjectMeasurements
        detectedFeatures: string[]
        mock?: boolean
      }

      setAnalysis({
        loading: false,
        progress: 100,
        progressStep: 'Analyse terminée',
        done: true,
        measurements: data.measurements,
        isMock: data.mock ?? false,
        error: null,
      })
      setEditedMeasurements(data.measurements)

      if (data.mock) {
        toast('Analyse simulée — configurez ANTHROPIC_API_KEY pour utiliser Claude Vision', {
          icon: 'ℹ️',
          duration: 6000,
        })
      } else {
        toast.success('Analyse IA terminée avec succès !')
      }
    } catch (err) {
      clearInterval(progressInterval)
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      setAnalysis((prev) => ({
        ...prev,
        loading: false,
        done: false,
        error: msg,
      }))
      toast.error(msg)
    }
  }

  async function applyMeasurements() {
    if (!editedMeasurements) return
    await new Promise((r) => setTimeout(r, 500))
    setApplied(true)
    toast.success('Mesures appliquées au projet !')
  }

  const m = editedMeasurements
  const conf = m?.confidence_level ? CONFIDENCE_CONFIG[m.confidence_level] : null

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon-sm" className="rounded-lg mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">Analyse IA des photos</h1>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Link href={`/projects/${projectId}`} className="hover:text-[#1B4FDE]">
              {safeProject.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Analyse</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {analysis.done && m && !applied && (
            <Button
              onClick={applyMeasurements}
              className="bg-green-600 hover:bg-green-700 gap-2"
              size="sm"
            >
              <Save className="w-4 h-4" />
              Appliquer les mesures
            </Button>
          )}
          {applied && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <Check className="w-4 h-4" />
              Mesures appliquées
            </div>
          )}
          <Button
            onClick={runAnalysis}
            disabled={analysis.loading || !hasPhotos}
            className={`gap-2 ${analysis.done ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#1B4FDE] hover:bg-[#1640C4]'}`}
            size="sm"
          >
            {analysis.loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                En cours...
              </>
            ) : analysis.done ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Régénérer
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Lancer l&apos;analyse IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* No photos warning */}
      {!hasPhotos && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Aucune photo disponible</p>
            <p className="text-sm text-amber-600 mt-0.5">
              Ce projet n&apos;a pas encore de photos. Envoyez une invitation au client ou ajoutez
              des photos manuellement pour lancer l&apos;analyse IA.
            </p>
            <Link href={`/projects/${projectId}`}>
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <Camera className="w-3.5 h-3.5" />
                Voir le projet
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Photo grid */}
      {hasPhotos && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" />
              Photos du projet ({safeProject.photos.length})
            </h2>
            <p className="text-xs text-gray-400">
              {Math.min(safeProject.photos.length, 4)} photo
              {Math.min(safeProject.photos.length, 4) > 1 ? 's' : ''} seront analysées
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {safeProject.photos.map((photo, i) => (
              <div
                key={photo.id}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 ${
                  i < 4 ? 'border-[#1B4FDE]/30' : 'border-gray-200 opacity-60'
                }`}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption ?? photo.angle}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {i < 4 && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-[#1B4FDE] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60">
                  <p className="text-white text-xs">
                    {PHOTO_ANGLES[photo.angle]?.label_fr ?? photo.angle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {analysis.loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#1B4FDE] animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{analysis.progressStep}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Analyse Claude Vision en cours, veuillez patienter...
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4FDE] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${analysis.progress}%` }}
              />
            </div>
            <div className="flex justify-between">
              {PROGRESS_STEPS.map((s, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    analysis.progress >= s.pct ? 'text-[#1B4FDE] font-medium' : 'text-gray-300'
                  }`}
                >
                  {s.label.split('...')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {analysis.error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Erreur lors de l&apos;analyse</p>
            <p className="text-sm text-red-600 mt-0.5">{analysis.error}</p>
          </div>
        </div>
      )}

      {/* Mock notice */}
      {analysis.isMock && analysis.done && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Mode démonstration.</span> Pour obtenir une vraie
            analyse IA, configurez la variable <code className="bg-blue-100 px-1 rounded">ANTHROPIC_API_KEY</code> dans
            votre fichier <code className="bg-blue-100 px-1 rounded">.env.local</code>.
          </p>
        </div>
      )}

      {/* Results */}
      {m && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Résultats de l&apos;analyse
            </h2>

            {conf && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${conf.barColor} ${conf.barWidth}`} />
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${conf.badgeClass}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${conf.dotColor} mr-1.5`} />
                  Confiance {conf.label}
                </span>
              </div>
            )}
          </div>

          {/* Measurements grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Largeur façade', value: m.facade_width ? `${m.facade_width} pi` : '—' },
              { label: 'Hauteur', value: m.building_height ? `${m.building_height} pi` : '—' },
              { label: 'Surface murale', value: m.wall_surface ? `${m.wall_surface} pi²` : '—', highlight: true },
              { label: 'Surface toiture', value: m.roof_surface ? `${m.roof_surface} pi²` : '—', highlight: true },
              { label: 'Périmètre', value: m.perimeter ? `${m.perimeter} pi` : '—' },
              { label: 'Étages', value: m.building_stories?.toString() ?? '—' },
              { label: 'Fenêtres', value: m.window_count?.toString() ?? '—' },
              { label: 'Portes', value: m.door_count?.toString() ?? '—' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-xl ${
                  item.highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                }`}
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-xl font-bold mt-1 ${item.highlight ? 'text-[#1B4FDE]' : 'text-gray-900'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Additional details */}
          {(m.roof_style || m.has_garage !== undefined || m.has_dormer !== undefined) && (
            <div className="grid grid-cols-3 gap-3">
              {m.roof_style && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Style de toit</span>
                  <span className="text-sm font-medium text-gray-900">
                    {ROOF_STYLE_LABELS[m.roof_style] ?? m.roof_style}
                  </span>
                </div>
              )}
              {m.has_garage !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Garage</span>
                  <span className={`text-sm font-medium ${m.has_garage ? 'text-green-600' : 'text-gray-500'}`}>
                    {m.has_garage ? 'Oui' : 'Non'}
                  </span>
                </div>
              )}
              {m.has_dormer !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Lucarne</span>
                  <span className={`text-sm font-medium ${m.has_dormer ? 'text-green-600' : 'text-gray-500'}`}>
                    {m.has_dormer ? 'Oui' : 'Non'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Detected features */}
          {m.detected_features && m.detected_features.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Caractéristiques détectées
              </p>
              <div className="flex flex-wrap gap-2">
                {m.detected_features.map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100"
                  >
                    <Check className="w-3 h-3" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {m.notes && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-medium text-amber-700 mb-1">Remarques de l&apos;analyse</p>
              <p className="text-sm text-amber-600">{m.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {!applied ? (
              <Button
                onClick={applyMeasurements}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Save className="w-4 h-4" />
                Appliquer les mesures au projet
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <Check className="w-4 h-4" />
                Mesures appliquées au projet
              </div>
            )}
            <Button
              onClick={runAnalysis}
              disabled={analysis.loading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Régénérer l&apos;analyse
            </Button>
          </div>
        </div>
      )}

      {/* Initial state — no analysis yet */}
      {!m && !analysis.loading && !analysis.error && hasPhotos && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Prêt à analyser</p>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Cliquez sur &ldquo;Lancer l&apos;analyse IA&rdquo; pour extraire automatiquement les
            mesures et caractéristiques de la propriété depuis les photos.
          </p>
          <Button
            onClick={runAnalysis}
            className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Lancer l&apos;analyse IA
          </Button>
        </div>
      )}
    </div>
  )
}
