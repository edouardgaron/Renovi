import React from 'react'
import { Ruler, Home, Square, Grid, DoorOpen } from 'lucide-react'
import type { ProjectMeasurements } from '@/types'
import { formatArea, formatDimension } from '@/lib/utils'

interface MeasurementsDisplayProps {
  measurements: ProjectMeasurements
}

export default function MeasurementsDisplay({ measurements }: MeasurementsDisplayProps) {
  const items = [
    {
      icon: Ruler,
      label: 'Largeur de façade',
      value: measurements.facade_width
        ? formatDimension(measurements.facade_width)
        : null,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Home,
      label: 'Hauteur du bâtiment',
      value: measurements.building_height
        ? formatDimension(measurements.building_height)
        : null,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Square,
      label: 'Surface murale',
      value: measurements.wall_surface
        ? formatArea(measurements.wall_surface)
        : null,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      icon: Grid,
      label: 'Surface de toiture',
      value: measurements.roof_surface
        ? formatArea(measurements.roof_surface)
        : null,
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: Ruler,
      label: 'Périmètre',
      value: measurements.perimeter
        ? formatDimension(measurements.perimeter)
        : null,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      icon: DoorOpen,
      label: 'Fenêtres / Portes',
      value:
        measurements.window_count !== null && measurements.door_count !== null
          ? `${measurements.window_count} / ${measurements.door_count}`
          : null,
      color: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-base font-bold text-gray-900">
                {item.value ?? '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {measurements.confidence_level && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Niveau de confiance des mesures</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2.5 h-2.5 rounded-full ${
                      (measurements.confidence_level === 'high' && dot <= 3) ||
                      (measurements.confidence_level === 'medium' && dot <= 2) ||
                      (measurements.confidence_level === 'low' && dot <= 1)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-green-700 capitalize">
                {measurements.confidence_level === 'high'
                  ? 'Élevé'
                  : measurements.confidence_level === 'medium'
                  ? 'Moyen'
                  : 'Faible'}
              </span>
            </div>
          </div>
          {measurements.notes && (
            <p className="text-xs text-gray-500 mt-2">{measurements.notes}</p>
          )}
        </div>
      )}
    </div>
  )
}
