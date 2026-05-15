'use client'

import React, { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { EXTERIOR_COLOR_PALETTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  label: string
  value: string | null
  onChange: (color: string) => void
  className?: string
}

export default function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <div
          className="w-5 h-5 rounded-md border border-gray-200 flex-shrink-0"
          style={{ backgroundColor: value ?? '#CCCCCC' }}
        />
        <span className="flex-1 text-left text-sm font-mono text-gray-700">
          {value ?? 'Choisir...'}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-xl border border-gray-200 shadow-panel overflow-hidden max-h-72 overflow-y-auto">
          {EXTERIOR_COLOR_PALETTES.map((palette) => (
            <div key={palette.category_fr} className="p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {palette.category_fr}
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {palette.colors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    title={color.name}
                    onClick={() => {
                      onChange(color.hex)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'relative w-8 h-8 rounded-lg border-2 transition-all hover:scale-110',
                      value === color.hex ? 'border-[#1B4FDE] scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    {value === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white drop-shadow-sm" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Custom hex input */}
          <div className="px-3 pb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Code hexadécimal personnalisé
            </p>
            <input
              type="text"
              placeholder="#000000"
              value={value ?? ''}
              onChange={(e) => {
                if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                  onChange(e.target.value)
                }
              }}
              onBlur={() => setIsOpen(false)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4FDE]/20 focus:border-[#1B4FDE]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
