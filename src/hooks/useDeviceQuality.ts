import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

/** Weak / integrated / software GPUs that can't afford bloom + shadows. */
const WEAK_GPU = /swiftshader|software|llvmpipe|intel|uhd graphics|iris|mali|adreno|videocore|apple gpu/i

function gpuRenderer(): string {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return 'none'
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    return dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER))
  } catch {
    return 'unknown'
  }
}

/**
 * Detect device capability once and downgrade 3D quality on
 * mobile / low-core / weak-GPU / reduced-motion environments.
 */
export function useDeviceQuality() {
  const setQuality = useAppStore((s) => s.setQuality)

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const smallScreen = window.innerWidth < 768
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4
    const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory
    const lowMemory = deviceMemory !== undefined && deviceMemory <= 4
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const weakGpu = WEAK_GPU.test(gpuRenderer())

    const low = isCoarse || smallScreen || lowCores || lowMemory || reducedMotion || weakGpu
    setQuality(low ? 'low' : 'high')
    document.documentElement.classList.toggle('low-perf', low)
  }, [setQuality])
}

export function useIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
}
