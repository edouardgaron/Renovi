'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, Loader2, Search, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface AddressResult {
  address: string
  city: string
  province: string
  postal: string
  lat: number
  lng: number
  previewImage: string
  fullAddress: string
}

interface AddressSearchProps {
  onSelect: (address: AddressResult) => void
  defaultValue?: string
  placeholder?: string
  label?: string
}

export default function AddressSearch({
  onSelect,
  defaultValue = '',
  placeholder = 'Rechercher une adresse...',
  label = 'Adresse de la propriété',
}: AddressSearchProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<AddressResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AddressResult | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/address-lookup?q=${encodeURIComponent(q)}`)
      const data = (await res.json()) as { results: AddressResult[] }
      setResults(data.results ?? [])
      setOpen(data.results.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (!selected) {
        search(query)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search, selected])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(result: AddressResult) {
    setSelected(result)
    setQuery(result.fullAddress)
    setOpen(false)
    setConfirmed(false)
  }

  function handleConfirm() {
    if (selected) {
      setConfirmed(true)
      onSelect(selected)
    }
  }

  function handleClear() {
    setSelected(null)
    setConfirmed(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="space-y-3" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (selected) setSelected(null)
            if (confirmed) setConfirmed(false)
          }}
          placeholder={placeholder}
          className="pl-9 pr-9"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
            {results.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#1B4FDE]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.address}</p>
                  <p className="text-xs text-gray-500">
                    {result.city}, {result.province} {result.postal}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* House Preview Card */}
      {selected && (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="relative h-44 bg-gray-100">
            <Image
              src={selected.previewImage}
              alt={`Aperçu de ${selected.address}`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-sm font-semibold">{selected.address}</p>
              <p className="text-white/80 text-xs">
                {selected.city}, {selected.province} {selected.postal}
              </p>
            </div>
            {confirmed && (
              <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <Check className="w-3 h-3" />
                Confirmée
              </div>
            )}
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selected.address}</p>
                <p className="text-xs text-gray-500">
                  {selected.city}, {selected.province} — {selected.postal}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                </p>
              </div>
            </div>
            {!confirmed ? (
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-1.5 flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                Confirmer
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="flex-shrink-0 gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Changer
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
