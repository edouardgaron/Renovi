'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createRoofGeometry(w: number, d: number, h: number) {
  const geo = new THREE.BufferGeometry()
  const hw = w / 2, hd = d / 2
  const verts = new Float32Array([
    // Front triangle
    -hw, 0, hd,  hw, 0, hd,  0, h, 0,
    // Back triangle
    -hw, 0, -hd,  0, h, 0,  hw, 0, -hd,
    // Left slope
    -hw, 0, hd,  0, h, 0,  -hw, 0, -hd,
    // Right slope
    hw, 0, hd,  hw, 0, -hd,  0, h, 0,
    // Bottom 1
    -hw, 0, hd,  -hw, 0, -hd,  hw, 0, -hd,
    // Bottom 2
    -hw, 0, hd,  hw, 0, -hd,  hw, 0, hd,
  ])
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

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

interface HouseModelProps {
  colors: HouseColors
  selectedPart: string | null
}

export default function HouseModel3D({ colors, selectedPart }: HouseModelProps) {
  const houseRef = useRef<THREE.Group>(null)

  const wallMat = { color: colors.wall, roughness: 0.85, metalness: 0.05 }
  const roofMat = { color: colors.roof, roughness: 0.9, metalness: 0.05 }
  const trimMat = { color: colors.trim, roughness: 0.4, metalness: 0.1 }
  const doorMat = { color: colors.door, roughness: 0.6, metalness: 0.15 }
  const winMat  = { color: colors.window, roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.6 }
  const foundMat = { color: colors.foundation, roughness: 1, metalness: 0 }
  const garageMat = { color: colors.garage, roughness: 0.5, metalness: 0.2 }

  const isSelected = (part: string) => selectedPart === part

  return (
    <group ref={houseRef} position={[0, 0, 0]}>
      {/* === FOUNDATION === */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.5, 5.4]} />
        <meshStandardMaterial {...foundMat} color={isSelected('foundation') ? '#a0c4ff' : colors.foundation} />
      </mesh>

      {/* === MAIN BODY === */}
      <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 5]} />
        <meshStandardMaterial {...wallMat} color={isSelected('wall') ? '#a0c4ff' : colors.wall} />
      </mesh>

      {/* === MAIN ROOF === */}
      <mesh position={[0, 3.25, 0]} castShadow>
        <primitive object={createRoofGeometry(8.6, 5.6, 1.8)} />
        <meshStandardMaterial {...roofMat} color={isSelected('roof') ? '#a0c4ff' : colors.roof} />
      </mesh>

      {/* === GARAGE WING === */}
      <mesh position={[4.5, 1.25, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.5, 4]} />
        <meshStandardMaterial {...wallMat} color={isSelected('wall') ? '#a0c4ff' : colors.wall} />
      </mesh>
      {/* Garage roof */}
      <mesh position={[4.5, 2.5, 0.5]} castShadow>
        <primitive object={createRoofGeometry(3.4, 4.4, 1.2)} />
        <meshStandardMaterial {...roofMat} color={isSelected('roof') ? '#a0c4ff' : colors.roof} />
      </mesh>

      {/* === TRIM / CORNER BOARDS === */}
      {/* Horizontal eave trim - front */}
      <mesh position={[0, 3.27, 2.52]}>
        <boxGeometry args={[8.6, 0.18, 0.12]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Horizontal eave trim - back */}
      <mesh position={[0, 3.27, -2.52]}>
        <boxGeometry args={[8.6, 0.18, 0.12]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Corner trim - front left */}
      <mesh position={[-4.01, 1.75, 2.52]}>
        <boxGeometry args={[0.1, 3, 0.12]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Corner trim - front right */}
      <mesh position={[4.01, 1.75, 2.52]}>
        <boxGeometry args={[0.1, 3, 0.12]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Window sill trim */}
      <mesh position={[-1.8, 2.0, 2.52]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      <mesh position={[1.8, 2.0, 2.52]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>

      {/* === FRONT DOOR === */}
      <mesh position={[0, 1.5, 2.51]} castShadow>
        <boxGeometry args={[1.0, 2.2, 0.08]} />
        <meshStandardMaterial {...doorMat} color={isSelected('door') ? '#a0c4ff' : colors.door} />
      </mesh>
      {/* Door frame */}
      <mesh position={[0, 1.5, 2.51]}>
        <boxGeometry args={[1.14, 2.34, 0.04]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Door knob */}
      <mesh position={[0.38, 1.5, 2.58]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#C0A030" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* === FRONT WINDOWS === */}
      {/* Left window */}
      <mesh position={[-1.8, 2.2, 2.52]}>
        <boxGeometry args={[1.3, 1.2, 0.06]} />
        <meshStandardMaterial {...winMat} color={isSelected('window') ? '#a0c4ff' : colors.window} />
      </mesh>
      <mesh position={[-1.8, 2.2, 2.52]}>
        <boxGeometry args={[1.42, 1.32, 0.03]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>
      {/* Right window */}
      <mesh position={[1.8, 2.2, 2.52]}>
        <boxGeometry args={[1.3, 1.2, 0.06]} />
        <meshStandardMaterial {...winMat} color={isSelected('window') ? '#a0c4ff' : colors.window} />
      </mesh>
      <mesh position={[1.8, 2.2, 2.52]}>
        <boxGeometry args={[1.42, 1.32, 0.03]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>

      {/* === GARAGE DOOR === */}
      <mesh position={[4.5, 1.25, 2.51]}>
        <boxGeometry args={[2.5, 2.0, 0.08]} />
        <meshStandardMaterial {...garageMat} color={isSelected('garage') ? '#a0c4ff' : colors.garage} />
      </mesh>
      {/* Garage door panels */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[4.5, 1.25 + y * 0.63, 2.52]}>
          <boxGeometry args={[2.48, 0.58, 0.02]} />
          <meshStandardMaterial color={isSelected('garage') ? '#a0c4ff' : colors.garage} roughness={0.4} />
        </mesh>
      ))}
      {/* Garage door frame */}
      <mesh position={[4.5, 1.25, 2.51]}>
        <boxGeometry args={[2.64, 2.14, 0.04]} />
        <meshStandardMaterial {...trimMat} color={isSelected('trim') ? '#a0c4ff' : colors.trim} />
      </mesh>

      {/* === CHIMNEY === */}
      <mesh position={[2.5, 4.2, -1.2]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshStandardMaterial color="#9B6B4A" roughness={0.9} />
      </mesh>
      {/* Chimney cap */}
      <mesh position={[2.5, 5.15, -1.2]}>
        <boxGeometry args={[0.72, 0.1, 0.72]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>

      {/* === PORCH / STEPS === */}
      <mesh position={[0, 0.05, 3.2]} receiveShadow>
        <boxGeometry args={[2.8, 0.22, 1.2]} />
        <meshStandardMaterial color="#B0A090" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.07, 3.7]} receiveShadow>
        <boxGeometry args={[2.4, 0.1, 0.3]} />
        <meshStandardMaterial color="#A09080" roughness={0.95} />
      </mesh>

      {/* === GROUND === */}
      <mesh position={[0, -0.21, 0]} receiveShadow>
        <boxGeometry args={[40, 0.02, 40]} />
        <meshStandardMaterial color="#4A7C59" roughness={1} />
      </mesh>
      {/* Driveway */}
      <mesh position={[4.5, -0.2, 6]} receiveShadow>
        <boxGeometry args={[3.5, 0.01, 7]} />
        <meshStandardMaterial color="#888888" roughness={0.95} />
      </mesh>
    </group>
  )
}
