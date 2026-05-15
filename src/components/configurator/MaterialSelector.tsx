'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { MATERIALS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { MaterialType } from '@/types'

interface MaterialSelectorProps {
  label: string
  value: MaterialType | null
  onChange: (material: MaterialType) => void
  filter?: MaterialType[]
  className?: string
}

export default function MaterialSelector({
  label,
  value,
  onChange,
  filter,
  className,
}: MaterialSelectorProps) {
  const materials = filter
    ? MATERIALS.filter((m) => filter.includes(m.id))
    : MATERIALS

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {materials.map((material) => (
          <button
            key={material.id}
            type="button"
            onClick={() => onChange(material.id)}
            className={cn(
              'flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all',
              value === material.id
                ? 'border-[#1B4FDE] bg-[#EFF4FF]'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            )}
          >
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  value === material.id ? 'text-[#1B4FDE]' : 'text-gray-800'
                )}
              >
                {material.label_fr}
              </p>
              <p className="text-xs text-gray-400 truncate">{material.description_fr}</p>
            </div>
            {value === material.id && (
              <div className="w-5 h-5 bg-[#1B4FDE] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
