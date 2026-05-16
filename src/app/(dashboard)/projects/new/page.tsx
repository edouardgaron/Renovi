'use client'

import React, { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  MapPin,
  Camera,
  ClipboardCheck,
  Upload,
  X,
  Sparkles,
  Loader2,
  Plus,
  Building,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AddressSearch from '@/components/address/AddressSearch'
import { mockClients } from '@/lib/mock-data'
import type { AddressResult } from '@/components/address/AddressSearch'
import type { ProjectMeasurements, BuildingType } from '@/types'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

interface PhotoPreview {
  id: string
  file: File
  dataUrl: string
}

interface NewClientData {
  name: string
  email: string
  phone: string
}

interface WizardState {
  // Step 1
  clientMode: 'existing' | 'new'
  selectedClientId: string
  newClient: NewClientData
  projectName: string
  // Step 2
  addressResult: AddressResult | null
  buildingType: BuildingType
  // Step 3
  photos: PhotoPreview[]
  measurements: ProjectMeasurements | null
  analysisLoading: boolean
  analysisProgress: number
  // Step 4
  notes: string
}

const BUILDING_TYPES: { value: BuildingType; label: string }[] = [
  { value: 'residential', label: 'Résidentiel — Maison unifamiliale' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'condo', label: 'Condo / Appartement' },
  { value: 'cottage', label: 'Chalet' },
]

const STEPS = [
  { id: 1 as Step, label: 'Client', icon: User },
  { id: 2 as Step, label: 'Adresse', icon: MapPin },
  { id: 3 as Step, label: 'Photos', icon: Camera },
  { id: 4 as Step, label: 'Confirmation', icon: ClipboardCheck },
]

const CONFIDENCE_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: 'Élevé', color: 'text-green-600 bg-green-50 border-green-200' },
  medium: { label: 'Moyen', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  low: { label: 'Faible', color: 'text-red-600 bg-red-50 border-red-200' },
}

const ANALYSIS_STEPS = [
  'Envoi des photos...',
  'Analyse en cours...',
  'Extraction des données...',
  'Calcul des surfaces...',
]

// ─── Main Component ────────────────────────────────────────────────────────────

export default function NewProjectPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

  const [state, setState] = useState<WizardState>({
    clientMode: 'existing',
    selectedClientId: '',
    newClient: { name: '', email: '', phone: '' },
    projectName: '',
    addressResult: null,
    buildingType: 'residential',
    photos: [],
    measurements: null,
    analysisLoading: false,
    analysisProgress: 0,
    notes: '',
  })

  const update = useCallback(<K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  // ─── Step validation ──────────────────────────────────────────────────────

  function canProceedStep1(): boolean {
    if (state.clientMode === 'existing') return state.selectedClientId !== ''
    return (
      state.newClient.name.trim() !== '' &&
      state.newClient.email.trim() !== '' &&
      state.projectName.trim() !== ''
    )
  }

  function canProceedStep2(): boolean {
    return state.addressResult !== null
  }

  function canProceedStep3(): boolean {
    return true // photos optional, can skip
  }

  function canProceed(): boolean {
    if (step === 1) return canProceedStep1()
    if (step === 2) return canProceedStep2()
    if (step === 3) return canProceedStep3()
    return true
  }

  // ─── Photo handling ───────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const newPreviews: PhotoPreview[] = []
    let loaded = 0
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        newPreviews.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          dataUrl: ev.target?.result as string,
        })
        loaded++
        if (loaded === files.length) {
          setState((prev) => ({
            ...prev,
            photos: [...prev.photos, ...newPreviews].slice(0, 8),
          }))
        }
      }
      reader.readAsDataURL(file)
    })
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  function removePhoto(id: string) {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }))
  }

  // ─── AI Analysis ─────────────────────────────────────────────────────────

  async function handleAnalyze() {
    if (state.photos.length === 0) {
      toast.error('Ajoutez au moins une photo avant d\'analyser.')
      return
    }

    setState((prev) => ({ ...prev, analysisLoading: true, analysisProgress: 0 }))

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setState((prev) => {
        if (prev.analysisProgress >= ANALYSIS_STEPS.length - 1) {
          clearInterval(progressInterval)
          return prev
        }
        return { ...prev, analysisProgress: prev.analysisProgress + 1 }
      })
    }, 900)

    try {
      const images = state.photos.map((p) => p.dataUrl)
      const res = await fetch('/api/analyze-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          projectName: state.projectName || 'Nouveau projet',
          address: state.addressResult?.fullAddress ?? '',
        }),
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const err = (await res.json()) as { error: string }
        throw new Error(err.error ?? 'Erreur inconnue')
      }

      const data = (await res.json()) as {
        measurements: ProjectMeasurements
        detectedFeatures: string[]
        mock?: boolean
      }

      setState((prev) => ({
        ...prev,
        measurements: data.measurements,
        analysisLoading: false,
        analysisProgress: ANALYSIS_STEPS.length - 1,
      }))

      if (data.mock) {
        toast('Analyse simulée (mode démo — configurez ANTHROPIC_API_KEY pour l\'IA réelle)', {
          icon: 'ℹ️',
          duration: 5000,
        })
      } else {
        toast.success('Analyse IA terminée !')
      }
    } catch (err) {
      clearInterval(progressInterval)
      setState((prev) => ({ ...prev, analysisLoading: false }))
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'analyse.')
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Projet créé avec succès !')
      router.push('/projects')
    } catch {
      toast.error('Erreur lors de la création du projet.')
      setSubmitting(false)
    }
  }

  // ─── Derived values ───────────────────────────────────────────────────────

  const selectedClient = mockClients.find((c) => c.id === state.selectedClientId)

  const displayName =
    state.clientMode === 'existing'
      ? selectedClient?.name ?? ''
      : state.newClient.name

  const autoProjectName = displayName
    ? `Rénovation — ${displayName.split(' ').pop() ?? displayName}`
    : ''

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon-sm" className="rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau projet</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Créez un projet en quelques étapes.
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isCompleted = s.id < step
          const isCurrent = s.id === step
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${
                    isCompleted
                      ? 'bg-[#1B4FDE] border-[#1B4FDE] text-white'
                      : isCurrent
                      ? 'bg-white border-[#1B4FDE] text-[#1B4FDE]'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? 'text-[#1B4FDE]' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mb-5 mx-2 transition-colors ${
                    s.id < step ? 'bg-[#1B4FDE]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── Step 1: Client ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Informations client</h2>

            {/* Mode toggle */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => update('clientMode', 'existing')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  state.clientMode === 'existing'
                    ? 'bg-[#1B4FDE] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Client existant
              </button>
              <button
                type="button"
                onClick={() => update('clientMode', 'new')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  state.clientMode === 'new'
                    ? 'bg-[#1B4FDE] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Nouveau client
              </button>
            </div>

            {state.clientMode === 'existing' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Sélectionner un client</Label>
                  <Select
                    value={state.selectedClientId}
                    onValueChange={(v) => {
                      update('selectedClientId', v)
                      const c = mockClients.find((cl) => cl.id === v)
                      if (c && !state.projectName) {
                        update('projectName', `Rénovation — ${c.name.split(' ').pop() ?? c.name}`)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{c.name}</span>
                            <span className="text-xs text-gray-500">{c.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Pas encore ce client?{' '}
                    <button
                      type="button"
                      className="text-[#1B4FDE] hover:underline"
                      onClick={() => update('clientMode', 'new')}
                    >
                      Créer un nouveau client
                    </button>
                  </p>
                </div>

                {selectedClient && (
                  <div className="p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#1B4FDE] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {selectedClient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedClient.name}</p>
                      <p className="text-sm text-gray-500">{selectedClient.email}</p>
                      <p className="text-sm text-gray-500">{selectedClient.phone}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedClient.address}, {selectedClient.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="client_name">Nom complet</Label>
                  <Input
                    id="client_name"
                    placeholder="Marie-Claude Gagnon"
                    value={state.newClient.name}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        newClient: { ...prev.newClient, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="client_email">Courriel</Label>
                    <Input
                      id="client_email"
                      type="email"
                      placeholder="exemple@gmail.com"
                      value={state.newClient.email}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          newClient: { ...prev.newClient, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client_phone">Téléphone</Label>
                    <Input
                      id="client_phone"
                      type="tel"
                      placeholder="418-555-0000"
                      value={state.newClient.phone}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          newClient: { ...prev.newClient, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <Label htmlFor="project_name">Nom du projet</Label>
              <Input
                id="project_name"
                placeholder={autoProjectName || 'Ex: Rénovation extérieure — Tremblay'}
                value={state.projectName}
                onChange={(e) => update('projectName', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Address ── */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Adresse de la propriété</h2>

          <AddressSearch
            onSelect={(addr) => update('addressResult', addr)}
            defaultValue={selectedClient?.address ?? ''}
            label="Rechercher l'adresse"
          />

          {state.addressResult && (
            <div className="space-y-1.5">
              <Label>Type de bâtiment</Label>
              <div className="grid grid-cols-2 gap-2">
                {BUILDING_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => update('buildingType', bt.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all ${
                      state.buildingType === bt.value
                        ? 'border-[#1B4FDE] bg-blue-50 text-[#1B4FDE] font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Building className="w-4 h-4 flex-shrink-0" />
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Photos + Analysis ── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Photos de la propriété</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Ajoutez jusqu&apos;à 8 photos pour une analyse IA précise (optionnel).
                </p>
              </div>
              {state.photos.length > 0 && (
                <span className="text-xs text-gray-400">{state.photos.length}/8 photos</span>
              )}
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files).filter((f) =>
                  f.type.startsWith('image/')
                )
                if (files.length === 0) return
                const evt = { target: { files, value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>
                handleFileChange(evt)
              }}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#1B4FDE] hover:bg-blue-50/30 transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">Glisser-déposer ou cliquer pour ajouter</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG, WEBP — max 8 photos</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Choisir des photos
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Photo grid */}
            {state.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {state.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
                  >
                    <Image
                      src={photo.dataUrl}
                      alt={photo.file.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/50">
                      <p className="text-white text-xs truncate">{photo.file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analysis button */}
            {state.photos.length > 0 && !state.measurements && (
              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={state.analysisLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
              >
                {state.analysisLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {ANALYSIS_STEPS[state.analysisProgress]}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyser avec l&apos;IA
                  </>
                )}
              </Button>
            )}

            {/* Analysis progress bar */}
            {state.analysisLoading && (
              <div className="space-y-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        ((state.analysisProgress + 1) / ANALYSIS_STEPS.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  {ANALYSIS_STEPS.map((s, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i <= state.analysisProgress ? 'text-purple-600' : 'text-gray-300'
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {state.measurements && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Mesures extraites par l&apos;IA
                </h3>
                {state.measurements.confidence_level && (
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      CONFIDENCE_LABELS[state.measurements.confidence_level]?.color
                    }`}
                  >
                    Confiance:{' '}
                    {CONFIDENCE_LABELS[state.measurements.confidence_level]?.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Largeur façade',
                    value: state.measurements.facade_width
                      ? `${state.measurements.facade_width} pi`
                      : '—',
                  },
                  {
                    label: 'Hauteur',
                    value: state.measurements.building_height
                      ? `${state.measurements.building_height} pi`
                      : '—',
                  },
                  {
                    label: 'Surface murale',
                    value: state.measurements.wall_surface
                      ? `${state.measurements.wall_surface} pi²`
                      : '—',
                  },
                  {
                    label: 'Surface toiture',
                    value: state.measurements.roof_surface
                      ? `${state.measurements.roof_surface} pi²`
                      : '—',
                  },
                  {
                    label: 'Fenêtres',
                    value: state.measurements.window_count?.toString() ?? '—',
                  },
                  {
                    label: 'Portes',
                    value: state.measurements.door_count?.toString() ?? '—',
                  },
                  {
                    label: 'Étages',
                    value: state.measurements.building_stories?.toString() ?? '—',
                  },
                  {
                    label: 'Périmètre',
                    value: state.measurements.perimeter
                      ? `${state.measurements.perimeter} pi`
                      : '—',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              {state.measurements.detected_features &&
                state.measurements.detected_features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Caractéristiques détectées
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {state.measurements.detected_features.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {state.measurements.notes && (
                <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-3">
                  {state.measurements.notes}
                </p>
              )}

              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={state.analysisLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Régénérer l&apos;analyse
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 4: Confirmation ── */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Récapitulatif du projet</h2>

            {/* Client */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Client</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-[#1B4FDE] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{displayName || '—'}</p>
                  {state.clientMode === 'existing' && selectedClient && (
                    <p className="text-xs text-gray-500">{selectedClient.email}</p>
                  )}
                  {state.clientMode === 'new' && (
                    <p className="text-xs text-gray-500">{state.newClient.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project name */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Nom du projet</p>
              <p className="font-semibold text-gray-900">
                {state.projectName || autoProjectName || '(sans nom)'}
              </p>
            </div>

            {/* Address */}
            {state.addressResult && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Adresse</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{state.addressResult.address}</p>
                    <p className="text-xs text-gray-500">
                      {state.addressResult.city}, {state.addressResult.province}{' '}
                      {state.addressResult.postal}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Photos count */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Photos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {state.photos.length} photo{state.photos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Measurements summary */}
            {state.measurements && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-700">Mesures IA extraites</span>
                </div>
                <span className="text-xs text-purple-600 font-medium">
                  {state.measurements.wall_surface
                    ? `${state.measurements.wall_surface} pi²`
                    : 'Disponibles'}
                </span>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="final_notes">Notes internes (optionnel)</Label>
              <Textarea
                id="final_notes"
                rows={3}
                placeholder="Informations supplémentaires sur le projet..."
                value={state.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between">
        <div>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => (prev - 1) as Step)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </Button>
          )}
          {step === 1 && (
            <Link href="/projects">
              <Button variant="outline">Annuler</Button>
            </Link>
          )}
        </div>

        <div>
          {step < 4 ? (
            <Button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep((prev) => (prev + 1) as Step)}
              className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
            >
              {step === 3 ? 'Continuer' : 'Suivant'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Créer le projet
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
