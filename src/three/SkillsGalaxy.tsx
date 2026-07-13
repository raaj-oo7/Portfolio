import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { skills, type Skill } from '@/data/portfolio'
import { useAppStore } from '@/store/useAppStore'

interface GalaxyProps {
  onSelect: (skill: Skill) => void
  selected: Skill | null
}

/** One orbiting, glowing planet representing a technology. */
function Planet({
  skill,
  index,
  total,
  onSelect,
  dimmed,
}: {
  skill: Skill
  index: number
  total: number
  onSelect: (s: Skill) => void
  dimmed: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // distribute planets across 3 orbital rings
  const ring = index % 3
  const radius = 2.3 + ring * 1.35
  const speed = 0.14 - ring * 0.035
  const phase = (index / total) * Math.PI * 2 * 1.61803
  const size = 0.22 + (skill.level / 100) * 0.26
  const yTilt = useMemo(() => Math.sin(index * 2.4) * 0.55, [index])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) {
      const a = phase + t * speed
      groupRef.current.position.set(
        Math.cos(a) * radius,
        Math.sin(a * 1.4) * yTilt + Math.sin(t * 0.8 + index) * 0.08,
        Math.sin(a) * radius,
      )
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.6 + index
      const target = hovered ? 1.35 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(skill)
        }}
      >
        <sphereGeometry args={[size, 28, 24]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={dimmed ? 0.25 : hovered ? 1.6 : 0.75}
          roughness={0.35}
          transparent
          opacity={dimmed ? 0.35 : 1}
        />
      </mesh>
      {/* atmosphere glow */}
      <mesh scale={1.35}>
        <sphereGeometry args={[size, 16, 12]} />
        <meshBasicMaterial color={skill.color} transparent opacity={dimmed ? 0.02 : hovered ? 0.18 : 0.08} depthWrite={false} />
      </mesh>
      {/* name label */}
      <Html center distanceFactor={11} zIndexRange={[40, 0]} position={[0, size + 0.32, 0]}>
        <button
          type="button"
          onClick={() => onSelect(skill)}
          className={`pointer-events-auto rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap transition-all ${
            hovered
              ? 'glass-strong scale-110 text-white'
              : dimmed
                ? 'text-white/25'
                : 'text-white/70'
          }`}
          style={hovered ? { boxShadow: `0 0 18px ${skill.color}66`, border: `1px solid ${skill.color}88` } : undefined}
        >
          {skill.name}
        </button>
      </Html>
      {hovered && (
        <Html center distanceFactor={10} zIndexRange={[50, 0]} position={[0, -(size + 0.5), 0]}>
          <div className="glass-strong pointer-events-none w-40 rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-white/70">
              {skill.category} · {skill.years}y · <span style={{ color: skill.color }}>{skill.level}/100</span>
            </p>
            <p className="mt-0.5 text-[9px] text-white/50">click for details</p>
          </div>
        </Html>
      )}
    </group>
  )
}

/** Central glowing "sun" core. */
function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.25
      const s = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.05
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color="#6366f1" emissive="#818cf8" emissiveIntensity={1.5} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 24, 20]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.2} />
      </mesh>
      <pointLight intensity={40} color="#818cf8" distance={12} />
    </group>
  )
}

/** Orbit ring guides. */
function OrbitRings() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {[2.3, 3.65, 5].map((r) => (
        <mesh key={r}>
          <ringGeometry args={[r - 0.008, r + 0.008, 90]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function GalaxyScene({ onSelect, selected }: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.04 + pointer.x * 0.25
      groupRef.current.rotation.x = -0.28 + pointer.y * 0.12
    }
  })
  return (
    <group ref={groupRef}>
      <Core />
      <OrbitRings />
      {skills.map((skill, i) => (
        <Planet
          key={skill.name}
          skill={skill}
          index={i}
          total={skills.length}
          onSelect={onSelect}
          dimmed={selected !== null && selected.name !== skill.name}
        />
      ))}
    </group>
  )
}

/** Public component: full skills galaxy canvas. */
export function SkillsGalaxy({ onSelect, selected }: GalaxyProps) {
  const quality = useAppStore((s) => s.quality)
  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.1]}
      camera={{ position: [0, 3.2, 9.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="Interactive galaxy of technologies"
      role="img"
      className="!touch-pan-y"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Stars radius={50} depth={35} count={quality === 'high' ? 1800 : 400} factor={3.4} saturation={0.5} fade speed={0.8} />
        <GalaxyScene onSelect={onSelect} selected={selected} />
        {quality === 'high' && (
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.35} mipmapBlur />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
