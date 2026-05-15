'use client'

import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { EXTERIOR_COLOR_PALETTES } from '@/lib/constants'

function createRoofGeometry() {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([
    -2.2, 0, 1.6,  2.2, 0, 1.6,   0, 1.2, 0,
    -2.2, 0, -1.6, 0, 1.2, 0,     2.2, 0, -1.6,
    -2.2, 0, 1.6,  0, 1.2, 0,     -2.2, 0, -1.6,
    2.2, 0, 1.6,   2.2, 0, -1.6,  0, 1.2, 0,
    -2.2, 0, 1.6,  -2.2, 0, -1.6, 2.2, 0, -1.6,
    -2.2, 0, 1.6,  2.2, 0, -1.6,  2.2, 0, 1.6,
  ])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}

interface HouseModelProps {
  wallColor: string
  roofColor: string
  trimColor: string
  doorColor: string
}

function HouseModel({ wallColor, roofColor, trimColor, doorColor }: HouseModelProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* Main walls */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <primitive object={createRoofGeometry()} />
        <meshStandardMaterial color={roofColor} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Front trim */}
      <mesh position={[0, 1, 1.52]}>
        <boxGeometry args={[4.1, 2, 0.05]} />
        <meshStandardMaterial color={trimColor} roughness={0.5} />
      </mesh>

      {/* Front door */}
      <mesh position={[0, 0.5, 1.53]}>
        <boxGeometry args={[0.6, 1, 0.05]} />
        <meshStandardMaterial color={doorColor} roughness={0.6} />
      </mesh>

      {/* Windows */}
      <mesh position={[-1.2, 1.1, 1.53]}>
        <boxGeometry args={[0.8, 0.7, 0.05]} />
        <meshStandardMaterial color="#AAD4F5" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.2, 1.1, 1.53]}>
        <boxGeometry args={[0.8, 0.7, 0.05]} />
        <meshStandardMaterial color="#AAD4F5" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>

      {/* Foundation */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.2, 3.2]} />
        <meshStandardMaterial color="#888888" roughness={1} />
      </mesh>

      {/* Ground */}
      <mesh position={[0, -0.21, 0]} receiveShadow>
        <boxGeometry args={[20, 0.01, 20]} />
        <meshStandardMaterial color="#4A7C59" roughness={1} />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.2, 2.8, -0.5]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#8B6B47" roughness={0.9} />
      </mesh>
    </group>
  )
}

const colorTargets = [
  { key: 'wall_color', label: 'Murs', emoji: '🏠' },
  { key: 'roof_color', label: 'Toiture', emoji: '🏗️' },
  { key: 'trim_color', label: 'Garnitures', emoji: '🪟' },
  { key: 'door_color', label: 'Porte', emoji: '🚪' },
]

interface HouseViewer3DProps {
  wallColor?: string
  roofColor?: string
  trimColor?: string
  doorColor?: string
  onMaterialChange?: (key: string, value: string) => void
  className?: string
}

export default function HouseViewer3D({
  wallColor: initialWall = '#C8A882',
  roofColor: initialRoof = '#3D3D3D',
  trimColor: initialTrim = '#FFFFFF',
  doorColor: initialDoor = '#8B4513',
  onMaterialChange,
  className = '',
}: HouseViewer3DProps) {
  const [colors, setColors] = useState({
    wall_color: initialWall,
    roof_color: initialRoof,
    trim_color: initialTrim,
    door_color: initialDoor,
  })
  const [activeTarget, setActiveTarget] = useState<string>('wall_color')

  function handleColorChange(key: string, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }))
    onMaterialChange?.(key, value)
  }

  const allColors = EXTERIOR_COLOR_PALETTES.flatMap((p) => p.colors)

  return (
    <div className={`flex h-full ${className}`}>
      {/* 3D Canvas */}
      <div className="flex-1 relative" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #c8e6ff 100%)' }}>
        <Canvas shadows gl={{ antialias: true, alpha: false }} style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #c8e6ff 100%)' }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={45} />
            <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} maxPolarAngle={Math.PI / 2} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
            <hemisphereLight args={['#87CEEB', '#4A7C59', 0.4]} />
            <HouseModel
              wallColor={colors.wall_color}
              roofColor={colors.roof_color}
              trimColor={colors.trim_color}
              doorColor={colors.door_color}
            />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
          <p className="text-xs text-gray-600">Cliquez et glissez pour pivoter · Scroll pour zoomer</p>
        </div>
      </div>

      {/* Color Panel */}
      <div className="w-64 bg-white border-l border-gray-100 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">Configurateur</p>
          <p className="text-xs text-gray-500 mt-0.5">Sélectionnez une zone à modifier</p>
        </div>

        {/* Zone selector */}
        <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-100">
          {colorTargets.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTarget(t.key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-all ${
                activeTarget === t.key
                  ? 'border-[#1B4FDE] bg-blue-50 text-[#1B4FDE]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{ backgroundColor: colors[t.key as keyof typeof colors] }}
              />
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Color palette */}
        <div className="p-3 flex-1">
          <p className="text-xs text-gray-500 mb-2 font-medium">Couleur actuelle</p>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg border border-gray-200"
              style={{ backgroundColor: colors[activeTarget as keyof typeof colors] }}
            />
            <input
              type="text"
              value={colors[activeTarget as keyof typeof colors]}
              onChange={(e) => handleColorChange(activeTarget, e.target.value)}
              className="flex-1 text-xs font-mono border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4FDE]"
            />
            <input
              type="color"
              value={colors[activeTarget as keyof typeof colors]}
              onChange={(e) => handleColorChange(activeTarget, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
          </div>

          <p className="text-xs text-gray-500 mb-2 font-medium">Palette</p>
          <div className="grid grid-cols-6 gap-1.5">
            {allColors.map((color) => (
              <button
                key={color.hex}
                title={color.name}
                onClick={() => handleColorChange(activeTarget, color.hex)}
                className={`w-7 h-7 rounded-md border transition-transform hover:scale-110 ${
                  colors[activeTarget as keyof typeof colors] === color.hex
                    ? 'border-[#1B4FDE] ring-2 ring-[#1B4FDE]/30 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
