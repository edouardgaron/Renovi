'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import type { ProjectPhoto } from '@/types'
import { PHOTO_ANGLES } from '@/lib/constants'

interface PhotoGridProps {
  photos: ProjectPhoto[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<ProjectPhoto | null>(null)

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-sm">Aucune photo disponible</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer"
            onClick={() => setLightboxPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? photo.angle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs font-medium">
                {PHOTO_ANGLES[photo.angle]?.label_fr ?? photo.angle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxPhoto(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption ?? lightboxPhoto.angle}
              fill
              className="object-contain rounded-xl"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white font-medium">
              {PHOTO_ANGLES[lightboxPhoto.angle]?.label_fr}
            </p>
            {lightboxPhoto.caption && (
              <p className="text-white/70 text-sm mt-0.5">{lightboxPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
