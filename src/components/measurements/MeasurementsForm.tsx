'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Calculator, RefreshCw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import type { ProjectMeasurements } from '@/types'

const FT_TO_M = 0.3048
const M_TO_FT = 1 / FT_TO_M

const measurementsSchema = z.object({
  facade_width: z.coerce.number().min(0).nullable(),
  building_height: z.coerce.number().min(0).nullable(),
  wall_surface: z.coerce.number().min(0).nullable(),
  roof_surface: z.coerce.number().min(0).nullable(),
  window_count: z.coerce.number().int().min(0).nullable(),
  door_count: z.coerce.number().int().min(0).nullable(),
  perimeter: z.coerce.number().min(0).nullable(),
  building_stories: z.coerce.number().int().min(1).nullable(),
  has_garage: z.boolean().nullable(),
  has_dormer: z.boolean().nullable(),
  roof_style: z
    .enum(['gable', 'hip', 'mansard', 'flat', 'gambrel'])
    .nullable(),
  confidence_level: z.enum(['low', 'medium', 'high']).nullable(),
  notes: z.string().nullable(),
})

type MeasurementsFormData = z.infer<typeof measurementsSchema>

interface MeasurementsFormProps {
  measurements: ProjectMeasurements
  onSave: (measurements: ProjectMeasurements) => Promise<void> | void
  readOnly?: boolean
}

const ROOF_STYLE_LABELS: Record<string, string> = {
  gable: 'Pignon (gable)',
  hip: 'Croupe (hip)',
  mansard: 'Mansarde',
  flat: 'Plat',
  gambrel: 'Gambrel (grange)',
}

export default function MeasurementsForm({
  measurements,
  onSave,
  readOnly = false,
}: MeasurementsFormProps) {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft')
  const [saving, setSaving] = useState(false)
  const [autoCalc, setAutoCalc] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } =
    useForm<MeasurementsFormData>({
      resolver: zodResolver(measurementsSchema),
      defaultValues: {
        facade_width: measurements.facade_width,
        building_height: measurements.building_height,
        wall_surface: measurements.wall_surface,
        roof_surface: measurements.roof_surface,
        window_count: measurements.window_count,
        door_count: measurements.door_count,
        perimeter: measurements.perimeter,
        building_stories: measurements.building_stories ?? null,
        has_garage: measurements.has_garage ?? null,
        has_dormer: measurements.has_dormer ?? null,
        roof_style: measurements.roof_style ?? null,
        confidence_level: measurements.confidence_level,
        notes: measurements.notes,
      },
    })

  const facadeWidth = watch('facade_width')
  const buildingHeight = watch('building_height')
  const perimeter = watch('perimeter')
  const buildingStories = watch('building_stories')

  // Auto-calculate wall surface when dimensions change
  useEffect(() => {
    if (!autoCalc) return
    if (facadeWidth && buildingHeight && perimeter) {
      const estimatedWallSurface = perimeter * buildingHeight * (buildingStories ?? 1)
      setValue('wall_surface', Math.round(estimatedWallSurface * 10) / 10, { shouldDirty: true })
    }
  }, [facadeWidth, buildingHeight, perimeter, buildingStories, autoCalc, setValue])

  async function onSubmit(data: MeasurementsFormData) {
    setSaving(true)
    try {
      const updated: ProjectMeasurements = {
        facade_width: data.facade_width,
        building_height: data.building_height,
        wall_surface: data.wall_surface,
        roof_surface: data.roof_surface,
        window_count: data.window_count,
        door_count: data.door_count,
        perimeter: data.perimeter,
        confidence_level: data.confidence_level,
        notes: data.notes,
        building_stories: data.building_stories ?? undefined,
        has_garage: data.has_garage ?? undefined,
        has_dormer: data.has_dormer ?? undefined,
        roof_style: data.roof_style ?? undefined,
        detected_features: measurements.detected_features,
      }
      await onSave(updated)
      toast.success('Mesures sauvegardées avec succès !')
    } catch {
      toast.error('Erreur lors de la sauvegarde des mesures.')
    } finally {
      setSaving(false)
    }
  }

  const unitLabel = unit === 'ft' ? 'pi' : 'm'
  const areaLabel = unit === 'ft' ? 'pi²' : 'm²'

  function displayVal(ftVal: number | null | undefined): number | null {
    if (ftVal === null || ftVal === undefined) return null
    return unit === 'ft' ? ftVal : parseFloat((ftVal * FT_TO_M).toFixed(2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Unit toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Unité d&apos;affichage:</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setUnit('ft')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                unit === 'ft'
                  ? 'bg-[#1B4FDE] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pieds (pi)
            </button>
            <button
              type="button"
              onClick={() => setUnit('m')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                unit === 'm'
                  ? 'bg-[#1B4FDE] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Mètres (m)
            </button>
          </div>
        </div>

        {/* Auto-calc toggle */}
        <button
          type="button"
          onClick={() => setAutoCalc(!autoCalc)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            autoCalc
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          Calcul auto surface
        </button>
      </div>

      {autoCalc && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Formule: Surface murale = Périmètre × Hauteur × Nb d&apos;étages.
            Renseignez le périmètre et la hauteur pour calculer automatiquement la surface.
          </p>
        </div>
      )}

      {/* Dimensions Section */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Dimensions principales</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="facade_width">
              Largeur façade ({unitLabel})
            </Label>
            <Input
              id="facade_width"
              type="number"
              step="0.1"
              min="0"
              readOnly={readOnly}
              defaultValue={displayVal(measurements.facade_width) ?? ''}
              {...register('facade_width', {
                setValueAs: (v) => {
                  const n = parseFloat(v)
                  if (isNaN(n)) return null
                  return unit === 'ft' ? n : parseFloat((n * M_TO_FT).toFixed(2))
                },
              })}
              className={errors.facade_width ? 'border-red-300' : ''}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="building_height">
              Hauteur bâtiment ({unitLabel})
            </Label>
            <Input
              id="building_height"
              type="number"
              step="0.1"
              min="0"
              readOnly={readOnly}
              defaultValue={displayVal(measurements.building_height) ?? ''}
              {...register('building_height', {
                setValueAs: (v) => {
                  const n = parseFloat(v)
                  if (isNaN(n)) return null
                  return unit === 'ft' ? n : parseFloat((n * M_TO_FT).toFixed(2))
                },
              })}
              className={errors.building_height ? 'border-red-300' : ''}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="perimeter">
              Périmètre ({unitLabel})
            </Label>
            <Input
              id="perimeter"
              type="number"
              step="0.1"
              min="0"
              readOnly={readOnly}
              defaultValue={displayVal(measurements.perimeter) ?? ''}
              {...register('perimeter', {
                setValueAs: (v) => {
                  const n = parseFloat(v)
                  if (isNaN(n)) return null
                  return unit === 'ft' ? n : parseFloat((n * M_TO_FT).toFixed(2))
                },
              })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="building_stories">Nombre d&apos;étages</Label>
            <Input
              id="building_stories"
              type="number"
              step="1"
              min="1"
              max="5"
              readOnly={readOnly}
              defaultValue={measurements.building_stories ?? ''}
              {...register('building_stories', { setValueAs: (v) => (v === '' ? null : parseInt(v)) })}
            />
          </div>
        </div>
      </div>

      {/* Surfaces Section */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Surfaces estimées</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="wall_surface">
              Surface murale ({areaLabel})
            </Label>
            <div className="relative">
              <Input
                id="wall_surface"
                type="number"
                step="0.1"
                min="0"
                readOnly={readOnly}
                defaultValue={displayVal(measurements.wall_surface) ?? ''}
                {...register('wall_surface', {
                  setValueAs: (v) => {
                    const n = parseFloat(v)
                    if (isNaN(n)) return null
                    return unit === 'ft' ? n : parseFloat((n * M_TO_FT * M_TO_FT).toFixed(2))
                  },
                })}
                className={autoCalc ? 'bg-green-50 border-green-200' : ''}
              />
              {autoCalc && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Calculator className="w-3.5 h-3.5 text-green-500" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roof_surface">
              Surface toiture ({areaLabel})
            </Label>
            <Input
              id="roof_surface"
              type="number"
              step="0.1"
              min="0"
              readOnly={readOnly}
              defaultValue={displayVal(measurements.roof_surface) ?? ''}
              {...register('roof_surface', {
                setValueAs: (v) => {
                  const n = parseFloat(v)
                  if (isNaN(n)) return null
                  return unit === 'ft' ? n : parseFloat((n * M_TO_FT * M_TO_FT).toFixed(2))
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Openings Section */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Ouvertures et caractéristiques</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="window_count">Nombre de fenêtres</Label>
            <Input
              id="window_count"
              type="number"
              step="1"
              min="0"
              readOnly={readOnly}
              defaultValue={measurements.window_count ?? ''}
              {...register('window_count', { setValueAs: (v) => (v === '' ? null : parseInt(v)) })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="door_count">Nombre de portes</Label>
            <Input
              id="door_count"
              type="number"
              step="1"
              min="0"
              readOnly={readOnly}
              defaultValue={measurements.door_count ?? ''}
              {...register('door_count', { setValueAs: (v) => (v === '' ? null : parseInt(v)) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Style de toit</Label>
            <Select
              defaultValue={measurements.roof_style ?? undefined}
              onValueChange={(v) => setValue('roof_style', v as 'gable' | 'hip' | 'mansard' | 'flat' | 'gambrel')}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROOF_STYLE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Garage</Label>
            <Select
              defaultValue={
                measurements.has_garage === true
                  ? 'true'
                  : measurements.has_garage === false
                  ? 'false'
                  : undefined
              }
              onValueChange={(v) => setValue('has_garage', v === 'true')}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Inconnu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Oui</SelectItem>
                <SelectItem value="false">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Lucarne (dormer)</Label>
            <Select
              defaultValue={
                measurements.has_dormer === true
                  ? 'true'
                  : measurements.has_dormer === false
                  ? 'false'
                  : undefined
              }
              onValueChange={(v) => setValue('has_dormer', v === 'true')}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Inconnu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Oui</SelectItem>
                <SelectItem value="false">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Confidence & Notes */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Qualité et remarques</h3>

        <div className="space-y-1.5">
          <Label>Niveau de confiance</Label>
          <Select
            defaultValue={measurements.confidence_level ?? undefined}
            onValueChange={(v) => setValue('confidence_level', v as 'low' | 'medium' | 'high')}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Élevé — mesures précises
                </span>
              </SelectItem>
              <SelectItem value="medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                  Moyen — estimations approximatives
                </span>
              </SelectItem>
              <SelectItem value="low">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  Faible — à valider sur place
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes et avertissements</Label>
          <Textarea
            id="notes"
            rows={3}
            readOnly={readOnly}
            placeholder="Observations, précisions, conditions d'estimation..."
            defaultValue={measurements.notes ?? ''}
            {...register('notes')}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600">
                <RefreshCw className="w-3.5 h-3.5" />
                Modifications non sauvegardées
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Sauvegarder les mesures
          </Button>
        </div>
      )}
    </form>
  )
}
