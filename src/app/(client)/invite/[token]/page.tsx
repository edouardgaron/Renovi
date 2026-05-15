'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  X,
  Info,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PHOTO_ANGLES, REQUIRED_PHOTO_ANGLES } from '@/lib/constants'
import type { PhotoAngle } from '@/types'
import toast from 'react-hot-toast'

const WIZARD_ANGLES: PhotoAngle[] = [
  'front',
  'back',
  'left_side',
  'right_side',
  'front_left',
  'front_right',
]

interface UploadedPhoto {
  angle: PhotoAngle
  dataUrl: string
  file: File
}

export default function InvitePortalPage({ params: _params }: { params: Promise<{ token: string }> }) {
  const [step, setStep] = useState<'intro' | 'upload' | 'success'>('intro')
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentAngle = WIZARD_ANGLES[currentAngleIndex]
  const angleInfo = PHOTO_ANGLES[currentAngle]
  const uploadedForCurrent = uploadedPhotos.find((p) => p.angle === currentAngle)
  const requiredDone = REQUIRED_PHOTO_ANGLES.every((angle) =>
    uploadedPhotos.some((p) => p.angle === angle)
  )
  const progress = Math.round((uploadedPhotos.length / WIZARD_ANGLES.length) * 100)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setUploadedPhotos((prev) => {
        const filtered = prev.filter((p) => p.angle !== currentAngle)
        return [...filtered, { angle: currentAngle, dataUrl, file }]
      })
      toast.success(`Photo "${angleInfo.label_fr}" ajoutée!`)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setStep('success')
    } catch {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EFF4FF] to-white flex flex-col">
        <header className="p-5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1B4FDE] rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Renovi</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <div className="w-20 h-20 bg-[#1B4FDE] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Camera className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Votre session photo
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Votre entrepreneur en rénovation vous invite à prendre quelques photos de votre maison. Ces photos permettront de générer des mesures précises et une visualisation 3D.
            </p>

            {/* Steps preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-8 text-left space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Ce que vous allez faire:</h3>
              {[
                { icon: Camera, text: `Prendre ${WIZARD_ANGLES.length} photos de votre maison` },
                { icon: Info, text: 'Suivre les instructions pour chaque angle' },
                { icon: Upload, text: 'Soumettre les photos en un clic' },
                { icon: Clock, text: 'Prend environ 10-15 minutes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#1B4FDE]" />
                  </div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs font-semibold text-amber-700 mb-2">Conseils pour de meilleures photos:</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Prenez les photos en mode paysage (horizontal)</li>
                <li>• Assurez-vous d&apos;avoir une bonne lumière naturelle</li>
                <li>• Reculez suffisamment pour capturer toute la façade</li>
                <li>• Évitez les voitures ou obstacles qui bloquent la vue</li>
              </ul>
            </div>

            <Button
              size="xl"
              onClick={() => setStep('upload')}
              className="w-full bg-[#1B4FDE] hover:bg-[#1640C4] font-semibold"
            >
              Commencer les photos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </main>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Photos envoyées!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Merci! Vos {uploadedPhotos.length} photos ont été reçues avec succès. Votre entrepreneur en rénovation les analysera et vous contactera prochainement.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-6">
            <div className="grid grid-cols-3 gap-2">
              {uploadedPhotos.map((photo) => (
                <div
                  key={photo.angle}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={photo.dataUrl}
                    alt={photo.angle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                    <span className="text-white text-xs font-medium leading-tight">
                      {PHOTO_ANGLES[photo.angle]?.label_fr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1B4FDE] rounded-md flex items-center justify-center">
              <Home className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Renovi</span>
          </div>
        </motion.div>
      </div>
    )
  }

  // Upload step
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with progress */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1B4FDE] rounded-md flex items-center justify-center">
                <Home className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Renovi</span>
            </div>
            <span className="text-xs text-gray-500">
              {uploadedPhotos.length}/{WIZARD_ANGLES.length} photos
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 space-y-5">
        {/* Current angle instruction */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAngle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#1B4FDE] bg-blue-50 px-2 py-1 rounded-md">
                Étape {currentAngleIndex + 1} / {WIZARD_ANGLES.length}
              </span>
              {angleInfo.required ? (
                <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md">Requis</span>
              ) : (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Optionnel</span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {angleInfo.label_fr}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {angleInfo.instruction_fr}
              </p>
            </div>

            {/* Photo area */}
            <div
              className={`relative aspect-video rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all ${
                uploadedForCurrent
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-[#1B4FDE] hover:bg-blue-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedForCurrent ? (
                <>
                  <Image
                    src={uploadedForCurrent.dataUrl}
                    alt="Photo prise"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium">Photo ajoutée</p>
                    <p className="text-white/80 text-xs">Appuyez pour changer</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Appuyez pour prendre ou choisir une photo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG jusqu&apos;à 20MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
          </motion.div>
        </AnimatePresence>

        {/* Photo thumbnails overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">
            Photos prises ({uploadedPhotos.length}/{WIZARD_ANGLES.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {WIZARD_ANGLES.map((angle, idx) => {
              const uploaded = uploadedPhotos.find((p) => p.angle === angle)
              const angleData = PHOTO_ANGLES[angle]
              return (
                <button
                  key={angle}
                  onClick={() => setCurrentAngleIndex(idx)}
                  className={`flex-shrink-0 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentAngleIndex === idx
                      ? 'border-[#1B4FDE] ring-2 ring-blue-100'
                      : uploaded
                      ? 'border-green-400'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100">
                    {uploaded ? (
                      <Image
                        src={uploaded.dataUrl}
                        alt={angle}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    {uploaded && (
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-2xs text-center py-1 px-0.5 text-gray-600 truncate">
                    {angleData.label_fr.split(' ')[0]}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="bg-white border-t border-gray-100 px-4 py-4 sticky bottom-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentAngleIndex(Math.max(0, currentAngleIndex - 1))}
            disabled={currentAngleIndex === 0}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {currentAngleIndex < WIZARD_ANGLES.length - 1 ? (
            <Button
              className="flex-1 bg-[#1B4FDE] hover:bg-[#1640C4]"
              onClick={() => setCurrentAngleIndex(currentAngleIndex + 1)}
            >
              Photo suivante
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              className={`flex-1 ${
                requiredDone
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!requiredDone || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Soumettre les photos ({uploadedPhotos.length})
                </span>
              )}
            </Button>
          )}
        </div>
        {!requiredDone && currentAngleIndex === WIZARD_ANGLES.length - 1 && (
          <p className="text-xs text-center text-red-500 mt-2">
            Prenez toutes les photos requises avant de soumettre.
          </p>
        )}
      </footer>
    </div>
  )
}
