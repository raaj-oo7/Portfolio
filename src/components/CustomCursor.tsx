import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 8

/**
 * Custom cursor: glowing dot + lagging ring + particle trail.
 * Grows over interactive elements (`a`, `button`, `[data-cursor]`).
 * Renders nothing on touch devices or with reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const enabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor-active')

    const mouse = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
    let hovering = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const target = e.target as HTMLElement
      hovering = Boolean(target.closest('a, button, [data-cursor], input, textarea, [role="button"]'))
    }

    const tick = () => {
      ring.x += (mouse.x - ring.x) * 0.16
      ring.y += (mouse.y - ring.y) * 0.16

      let px = mouse.x
      let py = mouse.y
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const t = trail[i]
        t.x += (px - t.x) * 0.35
        t.y += (py - t.y) * 0.35
        px = t.x
        py = t.y
        const el = trailRefs.current[i]
        if (el) {
          const s = 1 - i / TRAIL_COUNT
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) scale(${s})`
          el.style.opacity = String(0.35 * s)
        }
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) scale(${hovering ? 0.5 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${hovering ? 1.8 : 1})`
        ringRef.current.style.borderColor = hovering ? 'rgba(34,211,238,0.9)' : 'rgba(129,140,248,0.7)'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full bg-accent-cyan"
        />
      ))}
      <div
        ref={ringRef}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border-2 transition-[border-color] duration-200"
      />
      <div
        ref={dotRef}
        className="absolute -top-[5px] -left-[5px] h-2.5 w-2.5 rounded-full bg-primary-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]"
      />
    </div>
  )
}
