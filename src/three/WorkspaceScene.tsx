import { Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, Html, RoundedBox, Sparkles, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'
import { scrollToSection } from '@/utils'

/* ------------------------------ shared bits ------------------------------ */

type HoverTarget = 'laptop' | 'monitor' | 'keyboard' | 'mug' | null

const INDIGO = '#6366f1'
const PURPLE = '#a855f7'
const CYAN = '#22d3ee'

function useHoverCursor() {
  const set = (hovering: boolean) => {
    document.body.style.cursor = hovering ? 'pointer' : ''
  }
  return set
}

/** Small glass tooltip rendered in 3D space. */
function Tooltip({ children, position }: { children: ReactNode; position: [number, number, number] }) {
  return (
    <Html position={position} center distanceFactor={7} zIndexRange={[50, 0]}>
      <div className="glass-strong pointer-events-none w-max max-w-56 rounded-xl border-primary-500/30 px-4 py-3 text-left shadow-xl shadow-black/40">
        {children}
      </div>
    </Html>
  )
}

/* -------------------------------- objects -------------------------------- */

function Desk() {
  return (
    <group>
      <RoundedBox args={[7.6, 0.22, 3.4]} radius={0.06} position={[0, -0.11, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#2a2138" roughness={0.35} metalness={0.25} />
      </RoundedBox>
      {(
        [
          [-3.5, -1.35, 1.4],
          [3.5, -1.35, 1.4],
          [-3.5, -1.35, -1.4],
          [3.5, -1.35, -1.4],
        ] as const
      ).map((p, i) => (
        <mesh key={i} position={p as unknown as THREE.Vector3Tuple} castShadow>
          <cylinderGeometry args={[0.09, 0.07, 2.3, 12]} />
          <meshStandardMaterial color="#171225" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Laptop({
  hovered,
  onHover,
  onClick,
}: {
  hovered: boolean
  onHover: (h: boolean) => void
  onClick: () => void
}) {
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (screenMat.current) {
      screenMat.current.emissiveIntensity = hovered ? 1.6 : 0.9 + Math.sin(clock.elapsedTime * 2) * 0.12
    }
  })
  return (
    <group
      position={[-2.1, 0, 0.55]}
      rotation={[0, 0.5, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* base */}
      <RoundedBox args={[1.7, 0.08, 1.15]} radius={0.03} position={[0, 0.04, 0]} castShadow>
        <meshStandardMaterial color="#1c1830" roughness={0.4} metalness={0.7} />
      </RoundedBox>
      {/* screen */}
      <group position={[0, 0.06, -0.55]} rotation={[-1.75, 0, 0]}>
        <RoundedBox args={[1.7, 0.06, 1.1]} radius={0.03} position={[0, 0, -0.55]} castShadow>
          <meshStandardMaterial color="#1c1830" roughness={0.4} metalness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.035, -0.55]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.55, 0.95]} />
          <meshStandardMaterial
            ref={screenMat}
            color="#0b0920"
            emissive={INDIGO}
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
      {hovered && (
        <Tooltip position={[0, 1.7, 0]}>
          <p className="font-display text-xs font-bold text-accent-cyan">Featured Projects</p>
          <p className="mt-1 text-[11px] leading-snug text-white/80">
            Neural Notes AI · Orbit Commerce · DevFlow AI
          </p>
          <p className="mt-1.5 text-[10px] font-semibold text-primary-300">Click to explore ↓</p>
        </Tooltip>
      )}
    </group>
  )
}

function Monitor({
  position,
  rotationY,
  accent,
  hovered,
  onHover,
  onClick,
  label,
  lines,
}: {
  position: [number, number, number]
  rotationY: number
  accent: string
  hovered: boolean
  onHover: (h: boolean) => void
  onClick: () => void
  label: string
  lines: string[]
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.emissiveIntensity = hovered ? 1.7 : 1 + Math.sin(clock.elapsedTime * 1.6 + position[0]) * 0.15
    }
  })
  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* stand */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.7, 10]} />
        <meshStandardMaterial color="#171225" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.05, 20]} />
        <meshStandardMaterial color="#171225" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* bezel + screen */}
      <RoundedBox args={[2.3, 1.4, 0.1]} radius={0.04} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color="#14102a" roughness={0.35} metalness={0.6} />
      </RoundedBox>
      <mesh position={[0, 1.4, 0.056]}>
        <planeGeometry args={[2.14, 1.24]} />
        <meshStandardMaterial ref={mat} color="#080618" emissive={accent} emissiveIntensity={1} roughness={0.25} />
      </mesh>
      {/* fake code lines */}
      {lines.map((w, i) => (
        <mesh key={i} position={[-1 + Number(w) / 2, 1.85 - i * 0.16, 0.06]}>
          <planeGeometry args={[Number(w), 0.05]} />
          <meshBasicMaterial color={i % 3 === 0 ? CYAN : i % 3 === 1 ? '#e2e8f0' : PURPLE} transparent opacity={0.85} />
        </mesh>
      ))}
      {hovered && (
        <Tooltip position={[0, 2.6, 0]}>
          <p className="font-display text-xs font-bold text-accent-cyan">{label}</p>
          <p className="mt-1 text-[11px] leading-snug text-white/80">
            React · TypeScript · Three.js · Node · AI
          </p>
          <p className="mt-1.5 text-[10px] font-semibold text-primary-300">Click to view skills ↓</p>
        </Tooltip>
      )}
    </group>
  )
}

function Keyboard({ hovered, onHover, onClick }: { hovered: boolean; onHover: (h: boolean) => void; onClick: () => void }) {
  const keysRef = useRef<THREE.InstancedMesh>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const tmp = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const layout = useMemo(() => {
    const keys: { x: number; z: number }[] = []
    for (let row = 0; row < 5; row++) {
      const count = row === 4 ? 7 : 14
      for (let col = 0; col < count; col++) {
        keys.push({ x: -0.91 + col * (row === 4 ? 0.28 : 0.14), z: -0.26 + row * 0.14 })
      }
    }
    return keys
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // RGB underglow hue cycle
    if (glowRef.current) {
      glowRef.current.emissive.setHSL((t * 0.08) % 1, 0.9, 0.55)
      glowRef.current.emissiveIntensity = hovered ? 2.4 : 1.4
    }
    // typing wave animation when hovered
    if (keysRef.current) {
      layout.forEach((k, i) => {
        const press = hovered ? Math.max(0, Math.sin(t * 9 + i * 1.7)) * 0.035 : 0
        tmp.position.set(k.x, 0.075 - press, k.z)
        tmp.updateMatrix()
        keysRef.current!.setMatrixAt(i, tmp.matrix)
        if (hovered) {
          color.setHSL(((t * 0.25 + i * 0.02) % 1), 0.8, press > 0.02 ? 0.75 : 0.32)
          keysRef.current!.setColorAt(i, color)
        }
      })
      keysRef.current.instanceMatrix.needsUpdate = true
      if (hovered && keysRef.current.instanceColor) keysRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group
      position={[0.4, 0, 0.85]}
      rotation={[0, -0.06, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* underglow */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.25, 0.95]} />
        <meshStandardMaterial ref={glowRef} color="#000" emissive={INDIGO} emissiveIntensity={1.4} transparent opacity={0.55} />
      </mesh>
      <RoundedBox args={[2.05, 0.09, 0.78]} radius={0.03} position={[0, 0.045, 0.02]} castShadow>
        <meshStandardMaterial color="#1c1830" roughness={0.45} metalness={0.5} />
      </RoundedBox>
      <instancedMesh ref={keysRef} args={[undefined, undefined, layout.length]}>
        <boxGeometry args={[0.11, 0.045, 0.11]} />
        <meshStandardMaterial color="#2e2650" roughness={0.6} />
      </instancedMesh>
      {hovered && (
        <Tooltip position={[0, 1.15, 0]}>
          <p className="font-mono text-[11px] leading-relaxed text-emerald-300">
            <span className="text-accent-cyan">const</span> craft = <span className="text-accent-purple">'shipping…'</span>
            <span className="animate-pulse">▍</span>
          </p>
        </Tooltip>
      )}
    </group>
  )
}

function Mouse() {
  return (
    <group position={[1.95, 0, 0.9]} rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.06, 0]} scale={[1, 0.55, 1.5]} castShadow>
        <sphereGeometry args={[0.14, 20, 16]} />
        <meshStandardMaterial color="#231c3d" roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.115, -0.07]}>
        <boxGeometry args={[0.015, 0.01, 0.08]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function Steam({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const seeds = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ off: i * 0.9, x: (i % 3) * 0.03 - 0.03 })), [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      const s = seeds[i]
      const p = ((t * 0.5 + s.off) % 2) / 2 // 0..1 lifecycle
      child.position.y = 0.3 + p * 0.85
      child.position.x = s.x + Math.sin(t * 2 + s.off) * 0.05 * p
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      m.opacity = (active ? 0.5 : 0.22) * Math.sin(p * Math.PI)
      child.scale.setScalar(0.4 + p * 0.9)
    })
  })
  return (
    <group ref={ref}>
      {seeds.map((_, i) => (
        <mesh key={i} position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#cbd5f5" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Mug({ hovered, onHover }: { hovered: boolean; onHover: (h: boolean) => void }) {
  return (
    <group
      position={[2.9, 0, 0.35]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
    >
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.32, 20]} />
        <meshStandardMaterial color={INDIGO} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.125, 20]} />
        <meshStandardMaterial color="#3b2b20" roughness={0.9} />
      </mesh>
      <mesh position={[0.17, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 10, 20, Math.PI]} />
        <meshStandardMaterial color={INDIGO} roughness={0.3} />
      </mesh>
      <Steam active={hovered} />
      {hovered && (
        <Tooltip position={[0, 1.35, 0]}>
          <p className="text-[11px] font-semibold text-white/85">☕ Fuel level: optimal</p>
        </Tooltip>
      )}
    </group>
  )
}

function Plant() {
  return (
    <group position={[-3.2, 0, -1.05]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.36, 12]} />
        <meshStandardMaterial color="#3f3358" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 1.7) * 0.08, 0.5 + (i % 2) * 0.12, Math.cos(i * 1.9) * 0.08]}
          rotation={[Math.sin(i) * 0.5, i * 1.3, Math.cos(i) * 0.4]}
          castShadow
        >
          <coneGeometry args={[0.07, 0.42, 8]} />
          <meshStandardMaterial color="#34d399" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Night-city window behind the desk. */
function CityWindow() {
  const lights = useMemo(() => {
    const arr: { x: number; y: number; c: string; s: number }[] = []
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 110; i++) {
      arr.push({
        x: rand() * 4.4 - 2.2,
        y: rand() * 2.2 - 1.1,
        c: rand() > 0.75 ? CYAN : rand() > 0.5 ? '#fbbf24' : '#e2e8f0',
        s: 0.02 + rand() * 0.03,
      })
    }
    return arr
  }, [])
  return (
    <group position={[0, 2.2, -2.9]}>
      {/* frame */}
      <RoundedBox args={[5.2, 3, 0.12]} radius={0.05}>
        <meshStandardMaterial color="#171225" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      {/* night sky */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[4.9, 2.7]} />
        <meshBasicMaterial color="#05041a" />
      </mesh>
      {/* skyline lights */}
      {lights.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, 0.07]}>
          <planeGeometry args={[l.s, l.s]} />
          <meshBasicMaterial color={l.c} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* moon */}
      <mesh position={[1.7, 0.9, 0.07]}>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color="#e0e7ff" />
      </mesh>
    </group>
  )
}

/** Floating holographic elements above the desk. */
function Holograms({ quality }: { quality: 'high' | 'low' }) {
  const icoRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.4
      icoRef.current.rotation.y = t * 0.55
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2
      torusRef.current.rotation.z = t * 0.3
    }
  })
  return (
    <group>
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={icoRef} position={[3.1, 2.6, -0.8]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.6} wireframe />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={1}>
        <mesh ref={torusRef} position={[-3.3, 2.9, -0.6]}>
          <torusGeometry args={[0.34, 0.1, 12, 40]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} wireframe />
        </mesh>
      </Float>
      <Float speed={1.9} rotationIntensity={0.5} floatIntensity={1.4}>
        <mesh position={[0.2, 3.4, -1.4]}>
          <octahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial color={INDIGO} emissive={INDIGO} emissiveIntensity={1.8} wireframe />
        </mesh>
      </Float>
      {quality === 'high' && (
        <Sparkles count={60} scale={[9, 5, 5]} position={[0, 2.2, -0.5]} size={2.2} speed={0.35} color={CYAN} opacity={0.55} />
      )}
    </group>
  )
}

/** RGB light strip mounted behind the desk edge. */
function RgbStrip() {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    mat.current?.emissive.setHSL((clock.elapsedTime * 0.06) % 1, 0.85, 0.55)
  })
  return (
    <mesh position={[0, 0.02, -1.62]}>
      <boxGeometry args={[7.4, 0.05, 0.05]} />
      <meshStandardMaterial ref={mat} color="#000" emissive={INDIGO} emissiveIntensity={3} />
    </mesh>
  )
}

/* --------------------------------- scene --------------------------------- */

function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state
    const targetX = pointer.x * 1.1
    const targetY = 2.2 + pointer.y * 0.55
    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.lookAt(0, 1.2, 0)
  })
  return null
}

function Scene() {
  const quality = useAppStore((s) => s.quality)
  const [hover, setHover] = useState<HoverTarget>(null)
  const setCursor = useHoverCursor()

  const mkHover = (target: Exclude<HoverTarget, null>) => (h: boolean) => {
    setHover(h ? target : null)
    setCursor(h)
  }

  return (
    <>
      <CameraRig />
      {/* lighting */}
      <ambientLight intensity={0.35} />
      <spotLight position={[4, 7, 4]} angle={0.5} penumbra={0.8} intensity={90} color="#c7d2fe" castShadow={quality === 'high'} />
      <pointLight position={[-4, 3, 2]} intensity={22} color={PURPLE} />
      <pointLight position={[4, 2, -2]} intensity={18} color={CYAN} />
      <pointLight position={[0, 1.5, 1.5]} intensity={10} color={INDIGO} />

      <Stars radius={60} depth={40} count={quality === 'high' ? 1200 : 300} factor={3} saturation={0.6} fade speed={0.6} />

      <group position={[0, -1.1, 0]}>
        <Desk />
        <CityWindow />
        <RgbStrip />
        <Laptop hovered={hover === 'laptop'} onHover={mkHover('laptop')} onClick={() => scrollToSection('projects')} />
        <Monitor
          position={[0.55, 0.02, -0.55]}
          rotationY={-0.12}
          accent={INDIGO}
          hovered={hover === 'monitor'}
          onHover={mkHover('monitor')}
          onClick={() => scrollToSection('skills')}
          label="Skill Stack"
          lines={['1.4', '0.9', '1.7', '0.7', '1.2', '1.5']}
        />
        <Monitor
          position={[2.75, 0.02, -0.9]}
          rotationY={-0.45}
          accent={PURPLE}
          hovered={hover === 'monitor'}
          onHover={mkHover('monitor')}
          onClick={() => scrollToSection('skills')}
          label="Skill Stack"
          lines={['1.1', '1.6', '0.8', '1.3', '0.6', '1.5']}
        />
        <Keyboard hovered={hover === 'keyboard'} onHover={mkHover('keyboard')} onClick={() => scrollToSection('experience')} />
        <Mouse />
        <Mug hovered={hover === 'mug'} onHover={mkHover('mug')} />
        <Plant />
        <Holograms quality={quality} />
        {quality === 'high' && (
          <ContactShadows position={[0, -1.32, 0]} opacity={0.55} scale={14} blur={2.4} far={3} color="#0a0618" />
        )}
      </group>

      {quality === 'high' && (
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      )}
    </>
  )
}

/** Public component: the hero 3D workspace canvas. */
export function WorkspaceScene() {
  const quality = useAppStore((s) => s.quality)
  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.1]}
      camera={{ position: [0, 2.2, 7.4], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="Interactive 3D developer workspace"
      role="img"
      className="!touch-pan-y"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
