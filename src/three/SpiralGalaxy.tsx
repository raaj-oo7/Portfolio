import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const INDIGO = '#6366f1'
const VIOLET = '#8b5cf6'
const CYAN = '#06b6d4'

/**
 * Procedural spiral galaxy — one buffer, one draw call.
 * Deterministic seed so the arm pattern is unique but stable.
 * Position/rotate via a parent <group>.
 */
export function SpiralGalaxy({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const inside = new THREE.Color(VIOLET)
    const mid = new THREE.Color(INDIGO)
    const outside = new THREE.Color(CYAN)
    const ARMS = 4
    const RADIUS = 6.5
    const SPIN = 1.15
    let seed = 1337
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

    for (let i = 0; i < count; i++) {
      const r = Math.pow(rand(), 0.65) * RADIUS
      const armAngle = ((i % ARMS) / ARMS) * Math.PI * 2
      const spinAngle = r * SPIN
      const spread = 0.28 + (r / RADIUS) * 0.42
      const rx = (rand() - 0.5) * spread * r * 0.35
      const ry = (rand() - 0.5) * spread * r * 0.16
      const rz = (rand() - 0.5) * spread * r * 0.35

      positions[i * 3] = Math.cos(armAngle + spinAngle) * r + rx
      positions[i * 3 + 1] = ry
      positions[i * 3 + 2] = Math.sin(armAngle + spinAngle) * r + rz

      const t = r / RADIUS
      const c = t < 0.45 ? inside.clone().lerp(mid, t / 0.45) : mid.clone().lerp(outside, (t - 0.45) / 0.55)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02
  })

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* galactic core glow */}
      <mesh>
        <sphereGeometry args={[0.5, 20, 16]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 20, 16]} />
        <meshBasicMaterial color={INDIGO} transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}
