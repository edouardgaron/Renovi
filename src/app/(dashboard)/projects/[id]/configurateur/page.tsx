'use client'

import React, { Suspense, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import {
  ArrowLeft, Save, Share2, RotateCcw,
  Home, Layers, Square, DoorOpen, Columns, Box,
  Check, Palette, Download, Eye, Ruler,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProjectById } from '@/lib/mock-data'
import { EXTERIOR_COLOR_PALETTES } from '@/lib/constants'
import toast from 'react-hot-toast'

const HouseModel3D = dynamic(() => import('@/components/3d/HouseModel3D'), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────

interface HouseColors {
  wall: string
  roof: string
  trim: string
  door: string
  window: string
  foundation: string
  garage: string
  accent: string
}

type PartKey = keyof HouseColors

interface Part {
  key: PartKey
  label: string
  icon: React.ElementType
  description: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTS: Part[] = [
  { key: 'wall',       label: 'Revêtement',   icon: Home,      description: 'Murs extérieurs et bardage' },
  { key: 'roof',       label: 'Toiture',      icon: Layers,    description: 'Bardeaux et toiture' },
  { key: 'trim',       label: 'Garnitures',   icon: Square,    description: 'Coins, fascias, moulures' },
  { key: 'door',       label: 'Porte',        icon: DoorOpen,  description: 'Porte avant' },
  { key: 'garage',     label: 'Garage',       icon: Columns,   description: 'Porte de garage' },
  { key: 'window',     label: 'Fenêtres',     icon: Eye,       description: 'Fenêtres et châssis' },
  { key: 'foundation', label: 'Fondation',    icon: Box,       description: 'Solage et base' },
  { key: 'accent',     label: 'Accent',       icon: Palette,   description: 'Couleur d\'accent' },
]

const DEFAULT_COLORS: HouseColors = {
  wall:       '#C8B89A',
  roof:       '#3D3530',
  trim:       '#F5F0E8',
  door:       '#1B3A6B',
  window:     '#AAD4F5',
  foundation: '#8A8580',
  garage:     '#D8D0C0',
  accent:     '#722F37',
}

const WALL_MATERIALS = [
  { id: 'vinyl',     label: 'Vinyle',     desc: 'PVC, faible entretien',         preview: '#C8B89A' },
  { id: 'canexel',   label: 'Canexel',    desc: 'Fibre de bois, aspect naturel', preview: '#A89070' },
  { id: 'wood',      label: 'Bois',       desc: 'Naturel, charme authentique',   preview: '#8B6B47' },
  { id: 'brick',     label: 'Brique',     desc: 'Maçonnerie, très durable',      preview: '#CB4154' },
  { id: 'aluminum',  label: 'Aluminium',  desc: 'Léger, résistant',              preview: '#9090A0' },
  { id: 'stucco',    label: 'Stucco',     desc: 'Ciment, aspect texturé',        preview: '#D4C8B0' },
]

const ROOF_MATERIALS = [
  { id: 'shingle',   label: 'Bardeau',    desc: 'Asphalte, standard',            preview: '#3D3530' },
  { id: 'metal',     label: 'Métal',      desc: 'Acier, très durable',           preview: '#607080' },
  { id: 'cedar',     label: 'Cèdre',      desc: 'Bois naturel, rustique',        preview: '#8B6B47' },
  { id: 'clay',      label: 'Tuile',      desc: 'Argile, style européen',        preview: '#C06038' },
]

// Popular Quebec paint brands colors
const BRAND_PALETTES = [
  {
    brand: 'SICO',
    colors: [
      { name: 'Blanc Pur',       hex: '#F5F0E8' },
      { name: 'Gris Mink',       hex: '#9A9088' },
      { name: 'Bleu Acier',      hex: '#5A7A9A' },
      { name: 'Vert Forêt',      hex: '#3A5A3A' },
      { name: 'Beige Dune',      hex: '#C8A882' },
      { name: 'Gris Ardoise',    hex: '#5A6070' },
      { name: 'Rouge Bordeaux',  hex: '#722F37' },
      { name: 'Charcoal',        hex: '#3A3A3A' },
    ],
  },
  {
    brand: 'Benjamin Moore',
    colors: [
      { name: 'White Dove',      hex: '#F3EFE0' },
      { name: 'Revere Pewter',   hex: '#C2B9A7' },
      { name: 'Hale Navy',       hex: '#2C3E50' },
      { name: 'Pale Oak',        hex: '#D4C5B0' },
      { name: 'Newburyport Blue',hex: '#4A6F8A' },
      { name: 'Black Forest',    hex: '#2D4A2A' },
      { name: 'Cheating Heart',  hex: '#5A6070' },
      { name: 'Old Claret',      hex: '#6B2D3A' },
    ],
  },
  {
    brand: 'Sherwin-Williams',
    colors: [
      { name: 'Alabaster',       hex: '#EDEADE' },
      { name: 'Repose Gray',     hex: '#BDB8B0' },
      { name: 'Naval',           hex: '#24405A' },
      { name: 'Accessible Beige',hex: '#CEC0A8' },
      { name: 'Dorian Gray',     hex: '#888880' },
      { name: 'Cascades',        hex: '#4A7A6A' },
      { name: 'Urbane Bronze',   hex: '#5A4A3A' },
      { name: 'Iron Ore',        hex: '#3A3830' },
    ],
  },
]

// ─── House Styles ─────────────────────────────────────────────────────────────

interface HouseStyle {
  id: string
  label: string
  description: string
  proportions: {
    width: number
    height: number
    depth: number
    roofPitch: number
    hasGarage: boolean
    hasDoublePitch: boolean
  }
}

const HOUSE_STYLES: HouseStyle[] = [
  {
    id: 'unifamiliale',
    label: 'Maison unifamiliale',
    description: '2 étages, toit à pignon standard',
    proportions: { width: 1.0, height: 1.0, depth: 1.0, roofPitch: 1.0, hasGarage: false, hasDoublePitch: false },
  },
  {
    id: 'bungalow',
    label: 'Bungalow',
    description: '1 étage, toit à faible pente',
    proportions: { width: 1.2, height: 0.65, depth: 1.1, roofPitch: 0.6, hasGarage: false, hasDoublePitch: false },
  },
  {
    id: 'etages',
    label: 'Maison à étages',
    description: '2,5 étages, toiture haute',
    proportions: { width: 0.9, height: 1.35, depth: 0.9, roofPitch: 1.3, hasGarage: false, hasDoublePitch: false },
  },
  {
    id: 'garage_double',
    label: 'Maison avec garage double',
    description: 'Plain-pied avec garage double attenant',
    proportions: { width: 1.4, height: 0.7, depth: 1.1, roofPitch: 0.65, hasGarage: true, hasDoublePitch: false },
  },
  {
    id: 'cottage',
    label: 'Cottage',
    description: 'Cottage 1,5 étages, charme traditionnel',
    proportions: { width: 0.95, height: 0.95, depth: 0.95, roofPitch: 1.2, hasGarage: false, hasDoublePitch: true },
  },
]

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ colors, selectedPart }: { colors: HouseColors; selectedPart: string | null }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[12, 7, 12]} fov={42} />
      <OrbitControls
        enableDamping dampingFactor={0.05}
        minDistance={6} maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1.5, 0]}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 20, 10]} intensity={1.4} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={50} shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={15} shadow-camera-bottom={-15}
      />
      <hemisphereLight args={['#87CEEB', '#4A7C59', 0.5]} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <HouseModel3D colors={colors} selectedPart={selectedPart} />
      </Suspense>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConfigurateurPage() {
  const params = useParams()
  const projectId = Array.isArray(params.id) ? params.id[0] : (params.id ?? 'project-001')
  const project = getProjectById(projectId)

  const [colors, setColors] = useState<HouseColors>(DEFAULT_COLORS)
  const [history, setHistory] = useState<HouseColors[]>([DEFAULT_COLORS])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [activePart, setActivePart] = useState<PartKey>('wall')
  const [activeMaterial, setActiveMaterial] = useState<string>('vinyl')
  const [activeBrand, setActiveBrand] = useState<string>('SICO')
  const [tab, setTab] = useState<'couleurs' | 'materiaux' | 'style'>('couleurs')
  const [saving, setSaving] = useState(false)
  const [activeStyle, setActiveStyle] = useState<string>('unifamiliale')
  const [importingMeasurements, setImportingMeasurements] = useState(false)

  const applyColor = useCallback((hex: string) => {
    const next = { ...colors, [activePart]: hex }
    const newHistory = history.slice(0, historyIdx + 1)
    newHistory.push(next)
    setColors(next)
    setHistory(newHistory)
    setHistoryIdx(newHistory.length - 1)
  }, [colors, activePart, history, historyIdx])

  const undo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1)
      setColors(history[historyIdx - 1])
    }
  }

  const redo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1)
      setColors(history[historyIdx + 1])
    }
  }

  const reset = () => {
    setColors(DEFAULT_COLORS)
    setHistory([DEFAULT_COLORS])
    setHistoryIdx(0)
    toast('Configuration réinitialisée')
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    toast.success('Configuration sauvegardée dans le projet !')
  }

  const handleShare = () => {
    const params = new URLSearchParams(colors as unknown as Record<string, string>)
    navigator.clipboard.writeText(`${window.location.origin}/configurateur?${params}`)
    toast.success('Lien copié dans le presse-papier !')
  }

  const handleExportImage = () => {
    // Find the canvas element rendered by R3F
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      toast.error('Canvas introuvable. Réessayez.')
      return
    }
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `renovi-config-${project?.name?.toLowerCase().replace(/\s+/g, '-') ?? 'projet'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('Image exportée !')
    } catch {
      toast.error('Impossible d\'exporter l\'image (contexte WebGL).')
    }
  }

  async function handleImportMeasurements() {
    if (!project?.measurements) {
      toast.error('Aucune mesure disponible pour ce projet.')
      return
    }
    setImportingMeasurements(true)
    await new Promise(r => setTimeout(r, 400))

    const m = project.measurements
    // Map measurement data to color hints (illustrative)
    if (m.roof_style === 'flat') {
      setActiveStyle('bungalow')
    } else if ((m.building_stories ?? 0) >= 2) {
      setActiveStyle('etages')
    } else if (m.has_garage) {
      setActiveStyle('garage_double')
    }

    if (project.materials.wall_color) {
      applyColor(project.materials.wall_color)
    }

    setImportingMeasurements(false)
    toast.success(
      `Mesures importées: ${m.wall_surface ?? '?'} pi² murs, ${m.roof_surface ?? '?'} pi² toiture`
    )
  }

  function handleStyleChange(styleId: string) {
    setActiveStyle(styleId)
    toast(`Style "${HOUSE_STYLES.find(s => s.id === styleId)?.label}" appliqué`, { duration: 2000 })
  }

  const activePalette = BRAND_PALETTES.find(b => b.brand === activeBrand)?.colors ?? []
  const activePartObj = PARTS.find(p => p.key === activePart)

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-950 text-white z-40">

      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${projectId}`}>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <p className="text-sm font-semibold text-white">{project?.name ?? 'Projet'}</p>
            <p className="text-xs text-gray-500">Configurateur 3D</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <Button
            variant="ghost" size="sm"
            onClick={undo}
            disabled={historyIdx === 0}
            className="text-gray-400 hover:text-white disabled:opacity-30"
            title="Annuler"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={redo}
            disabled={historyIdx === history.length - 1}
            className="text-gray-400 hover:text-white disabled:opacity-30 scale-x-[-1]"
            title="Rétablir"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-gray-700" />

          <Button
            variant="ghost" size="sm"
            onClick={reset}
            className="text-gray-400 hover:text-white gap-1.5 text-xs"
          >
            Réinitialiser
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={handleImportMeasurements}
            disabled={importingMeasurements}
            className="text-gray-400 hover:text-white gap-1.5"
            title="Importer les mesures du projet"
          >
            {importingMeasurements ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Ruler className="w-4 h-4" />
            )}
            Mesures
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={handleExportImage}
            className="text-gray-400 hover:text-white gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-white gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-1.5"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Sauvegarder
          </Button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar: Part selector ── */}
        <aside className="w-[72px] bg-gray-900 border-r border-gray-800 flex flex-col items-center py-3 gap-1 flex-shrink-0">
          {PARTS.map((part) => {
            const Icon = part.icon
            const isActive = activePart === part.key
            return (
              <button
                key={part.key}
                onClick={() => setActivePart(part.key)}
                title={part.label}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all group relative ${
                  isActive
                    ? 'bg-[#1B4FDE] text-white'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {/* Active color dot */}
                <div
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-gray-700"
                  style={{ backgroundColor: colors[part.key] }}
                />
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none">{part.label.slice(0, 5)}</span>
              </button>
            )
          })}
        </aside>

        {/* ── Center: 3D Canvas ── */}
        <main className="flex-1 relative">
          <Canvas
            shadows
            gl={{ antialias: true, alpha: false }}
            style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #c8e8ff 60%, #d4e8b0 100%)' }}
          >
            <Scene colors={colors} selectedPart={activePart} />
          </Canvas>

          {/* Active part label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            {activePartObj && <activePartObj.icon className="w-3.5 h-3.5 text-blue-400" />}
            <span className="text-sm font-medium text-white">{activePartObj?.label}</span>
            <span className="text-xs text-gray-400">— {activePartObj?.description}</span>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-white/60">
            <span>🖱️ Cliquer + glisser pour pivoter</span>
            <span>🔍 Scroll pour zoomer</span>
            <span>⇧ Shift + glisser pour déplacer</span>
          </div>

          {/* Color preview strip */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
            {PARTS.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePart(p.key)}
                title={p.label}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  activePart === p.key ? 'border-white scale-125' : 'border-transparent'
                }`}
                style={{ backgroundColor: colors[p.key] }}
              />
            ))}
          </div>
        </main>

        {/* ── Right Panel: Color / Material picker ── */}
        <aside className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden flex-shrink-0">

          {/* Part header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              {activePartObj && <activePartObj.icon className="w-4 h-4 text-blue-400" />}
              <span className="font-semibold text-white">{activePartObj?.label}</span>
            </div>
            <p className="text-xs text-gray-500">{activePartObj?.description}</p>

            {/* Current color */}
            <div className="flex items-center gap-2 mt-3">
              <div
                className="w-8 h-8 rounded-lg border border-gray-700 flex-shrink-0"
                style={{ backgroundColor: colors[activePart] }}
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Couleur active</p>
                <p className="text-sm font-mono text-white">{colors[activePart].toUpperCase()}</p>
              </div>
              <input
                type="color"
                value={colors[activePart]}
                onChange={e => applyColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                title="Choisir une couleur personnalisée"
              />
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-gray-800">
            {(['couleurs', 'materiaux', 'style'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'text-white border-b-2 border-[#1B4FDE]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t === 'couleurs' ? 'Couleurs' : t === 'materiaux' ? 'Matériaux' : 'Style'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === 'couleurs' ? (
              <div className="p-3 space-y-4">

                {/* Brand selector */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Marque</p>
                  <div className="flex gap-1.5">
                    {BRAND_PALETTES.map(b => (
                      <button
                        key={b.brand}
                        onClick={() => setActiveBrand(b.brand)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeBrand === b.brand
                            ? 'bg-[#1B4FDE] text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand colors */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{activeBrand}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {activePalette.map(c => {
                      const isActive = colors[activePart] === c.hex
                      return (
                        <button
                          key={c.hex}
                          onClick={() => applyColor(c.hex)}
                          title={c.name}
                          className="group relative"
                        >
                          <div
                            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                              isActive ? 'border-white scale-105 ring-2 ring-[#1B4FDE]' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {isActive && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-lg" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 truncate text-center">{c.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* All palette colors */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Palette complète</p>
                  {EXTERIOR_COLOR_PALETTES.map(palette => (
                    <div key={palette.category_fr} className="mb-3">
                      <p className="text-[10px] text-gray-600 mb-1.5">{palette.category_fr}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {palette.colors.map(c => {
                          const isActive = colors[activePart] === c.hex
                          return (
                            <button
                              key={c.hex}
                              onClick={() => applyColor(c.hex)}
                              title={c.name}
                              className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 flex-shrink-0 ${
                                isActive ? 'border-white ring-2 ring-[#1B4FDE] scale-110' : 'border-gray-700'
                              }`}
                              style={{ backgroundColor: c.hex }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom color input */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Couleur personnalisée</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="#RRGGBB"
                      value={colors[activePart]}
                      onChange={e => {
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) applyColor(e.target.value)
                      }}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#1B4FDE]"
                    />
                    <input
                      type="color"
                      value={colors[activePart]}
                      onChange={e => applyColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : tab === 'materiaux' ? (
              /* Materials tab */
              <div className="p-3 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                    {activePart === 'roof' ? 'Matériaux de toiture' : 'Matériaux de revêtement'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(activePart === 'roof' ? ROOF_MATERIALS : WALL_MATERIALS).map(mat => {
                      const isActive = activeMaterial === mat.id
                      return (
                        <button
                          key={mat.id}
                          onClick={() => {
                            setActiveMaterial(mat.id)
                            applyColor(mat.preview)
                          }}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            isActive
                              ? 'border-[#1B4FDE] bg-[#1B4FDE]/10'
                              : 'border-gray-800 hover:border-gray-600 bg-gray-800/50'
                          }`}
                        >
                          <div
                            className="w-full h-12 rounded-lg mb-2 border border-gray-700"
                            style={{ backgroundColor: mat.preview }}
                          />
                          <p className="text-xs font-semibold text-white">{mat.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{mat.desc}</p>
                          {isActive && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Check className="w-3 h-3 text-[#1B4FDE]" />
                              <span className="text-[10px] text-[#6089FA]">Sélectionné</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                  <p className="text-xs font-medium text-gray-300 mb-1">Note</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Les textures réelles seront appliquées lors de la génération du rendu final via IA.
                    Pour l&apos;instant, la couleur de prévisualisation est utilisée.
                  </p>
                </div>
              </div>
            ) : (
              /* Style tab */
              <div className="p-3 space-y-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Style architectural
                </p>
                {HOUSE_STYLES.map(style => {
                  const isActive = activeStyle === style.id
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        isActive
                          ? 'border-[#1B4FDE] bg-[#1B4FDE]/10'
                          : 'border-gray-800 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">{style.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{style.description}</p>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-[#1B4FDE] flex-shrink-0" />}
                      </div>
                      {isActive && (
                        <div className="mt-2 flex gap-2 text-[10px] text-[#6089FA]">
                          <span>L×{style.proportions.width.toFixed(1)}</span>
                          <span>H×{style.proportions.height.toFixed(1)}</span>
                          <span>P×{style.proportions.depth.toFixed(1)}</span>
                          {style.proportions.hasGarage && <span className="text-green-400">Garage</span>}
                        </div>
                      )}
                    </button>
                  )
                })}

                {/* Import from project */}
                {project?.measurements?.wall_surface && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <p className="text-xs font-medium text-gray-300 mb-2">Mesures du projet</p>
                    <div className="space-y-1 text-[10px] text-gray-500">
                      {project.measurements.wall_surface && (
                        <p>Murs: {project.measurements.wall_surface} pi²</p>
                      )}
                      {project.measurements.roof_surface && (
                        <p>Toiture: {project.measurements.roof_surface} pi²</p>
                      )}
                      {project.measurements.facade_width && (
                        <p>Largeur: {project.measurements.facade_width} pi</p>
                      )}
                    </div>
                    <button
                      onClick={handleImportMeasurements}
                      disabled={importingMeasurements}
                      className="mt-2 w-full py-1.5 rounded-lg bg-[#1B4FDE]/20 text-[#6089FA] text-xs font-medium hover:bg-[#1B4FDE]/30 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Ruler className="w-3 h-3" />
                      Importer les mesures
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary footer */}
          <div className="border-t border-gray-800 p-3">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Configuration actuelle</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PARTS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setActivePart(p.key)}
                  title={p.label}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
                    activePart === p.key ? 'bg-gray-800 ring-1 ring-[#1B4FDE]' : 'hover:bg-gray-800'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-md border border-gray-700"
                    style={{ backgroundColor: colors[p.key] }}
                  />
                  <span className="text-[9px] text-gray-500 truncate w-full text-center">{p.label.slice(0, 6)}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
