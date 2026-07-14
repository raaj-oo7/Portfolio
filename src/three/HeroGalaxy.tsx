import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SpiralGalaxy } from '@/three/SpiralGalaxy'
import { SKILL_ICONS } from '@/components/skillIcons'
import { useAppStore } from '@/store/useAppStore'

/**
 * Hero background: a developer solar system.
 * A spiral galaxy + starfield sit deep behind the content while three
 * tilted orbit rings carry glowing tech-logo satellites around the hero
 * text. Faint floating code glyphs add developer flavor. Everything is
 * dim and slow so the headline stays the focus.
 */

const SATELLITES: { name: string; color: string; ring: 0 | 1 | 2 }[] = [
  { name: 'React', color: '#61dafb', ring: 0 },
  { name: 'Node.js', color: '#8cc84b', ring: 0 },
  { name: 'TypeScript', color: '#3178c6', ring: 1 },
  { name: 'Tailwind CSS', color: '#22d3ee', ring: 1 },
  { name: 'JavaScript', color: '#f7df1e', ring: 2 },
  { name: 'Three.js', color: '#a855f7', ring: 2 },
]

const RING_RADII = [3.1, 4.3, 5.5]

const GLYPHS: { text: string; position: [number, number, number] }[] = [
  { text: '</>', position: [-4.8, 2.3, -2] },
  { text: '{ }', position: [4.9, 1.8, -2.5] },
  { text: '=>', position: [-4.1, -2.2, -1.5] },
  { text: 'git push', position: [4.4, -2.4, -2] },
  { text: 'npm run dev', position: [-0.4, 3.3, -3.5] },
]

/** One glowing tech-logo moon riding an orbit ring. */
function TechSatellite({ name, color, ring, index, countOnRing }: {
  name: string
  color: string
  ring: number
  index: number
  countOnRing: number
}) {
  const ref = useRef<THREE.Group>(null)
  const radius = RING_RADII[ring]
  // alternate direction per ring; outer rings drift slower
  const speed = (0.085 - ring * 0.02) * (ring % 2 === 0 ? 1 : -1)
  const phase = (index / countOnRing) * Math.PI * 2 + ring * 1.15
  const Icon = SKILL_ICONS[name]

  useFrame(({ clock }) => {
    if (!ref.current) return
    const a = phase + clock.elapsedTime * speed
    ref.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius)
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.17, 20, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} roughness={0.35} />
      </mesh>
      {/* halo */}
      <mesh scale={1.7}>
        <sphereGeometry args={[0.17, 12, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {Icon && (
        <Html center distanceFactor={8} zIndexRange={[5, 0]} className="pointer-events-none">
          <Icon size={15} color="#fff" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.7))', opacity: 0.95 }} />
        </Html>
      )}
    </group>
  )
}

/** Thin glowing guide circles the satellites ride on. */
function OrbitRings() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {RING_RADII.map((r) => (
        <mesh key={r}>
          <ringGeometry args={[r - 0.008, r + 0.008, 96]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

/** Gentle whole-scene sway toward the pointer. */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ pointer }) => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.07, 0.04)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.04, 0.04)
  })
  return <group ref={ref}>{children}</group>
}

function Scene() {
  const quality = useAppStore((s) => s.quality)
  const high = quality === 'high'
  const ringCounts = [2, 2, 2] // satellites per ring

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[-6, 4, 5]} intensity={22} color="#8b5cf6" />
      <pointLight position={[6, -3, 4]} intensity={16} color="#22d3ee" />

      <Stars radius={55} depth={40} count={high ? 1600 : 500} factor={2.8} saturation={0.5} fade speed={0.5} />

      <ParallaxRig>
        {/* spiral galaxy backdrop, behind and slightly above the headline */}
        <group position={[0, 1.6, -7]} rotation={[0.55, 0, -0.12]} scale={1.5}>
          <SpiralGalaxy count={high ? 5200 : 2200} />
        </group>

        {/* developer solar system around the content */}
        <group position={[0, -0.2, -1.5]} rotation={[0.45, 0, -0.07]}>
          <OrbitRings />
          {SATELLITES.map((s) => {
            const indexOnRing = SATELLITES.filter((x) => x.ring === s.ring).indexOf(s)
            return (
              <TechSatellite
                key={s.name}
                name={s.name}
                color={s.color}
                ring={s.ring}
                index={indexOnRing}
                countOnRing={ringCounts[s.ring]}
              />
            )
          })}
        </group>

        {/* floating code glyphs */}
        {GLYPHS.map((g) => (
          <Float key={g.text} speed={1.4} rotationIntensity={0.15} floatIntensity={1}>
            <Html center distanceFactor={9} zIndexRange={[4, 0]} position={g.position} className="pointer-events-none">
              <span className="font-mono text-sm whitespace-nowrap text-primary-300/40">{g.text}</span>
            </Html>
          </Float>
        ))}
      </ParallaxRig>

      {high && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      )}
    </>
  )
}

/** Public component: the hero galaxy-orbit canvas. */
export function HeroGalaxy() {
  const quality = useAppStore((s) => s.quality)
  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.7] : [1, 1.1]}
      camera={{ position: [0, 0.6, 9], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
      className="!pointer-events-none"
    >
      <Scene />
    </Canvas>
  )
}
