import { memo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { useAppStore } from '@/store/useAppStore'

const initEngine = async (engine: Engine) => {
  await loadSlim(engine)
}

/**
 * Site-wide interactive particle field: connected nodes, mouse
 * grab/repulsion, floating drift. Density adapts to quality tier.
 */
export const ParticlesBackground = memo(function ParticlesBackground() {
  const quality = useAppStore((s) => s.quality)

  const options: ISourceOptions = {
    fpsLimit: quality === 'high' ? 60 : 30,
    detectRetina: false,
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    particles: {
      number: {
        value: quality === 'high' ? 120 : 40,
        density: { enable: true, width: 1920, height: 1080 },
      },
      color: { value: ['#6366f1', '#a855f7', '#22d3ee', '#818cf8'] },
      links: {
        enable: true,
        distance: 130,
        color: '#6366f1',
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        random: true,
        outModes: { default: 'out' },
      },
      opacity: {
        value: { min: 0.15, max: 0.55 },
        animation: { enable: true, speed: 0.8, sync: false },
      },
      size: { value: { min: 1, max: 2.6 } },
      shape: { type: 'circle' },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: ['grab', 'repulse'] },
        onClick: { enable: true, mode: 'push' },
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.5 } },
        repulse: { distance: 90, duration: 0.3 },
        push: { quantity: 3 },
      },
    },
  }

  return (
    <div aria-hidden className="pointer-events-auto fixed inset-0 -z-10">
      <ParticlesProvider init={initEngine}>
        <Particles id="global-particles" options={options} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  )
})
