export { cn } from './cn'

/** Scroll smoothly to a section by id (works with Lenis via native fallback). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = window.__lenis
  if (lenis) lenis.scrollTo(el, { offset: -72 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Clamp a number between min and max. */
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Format large numbers: 1234 -> "1.2k". */
export function formatCompact(n: number): string {
  return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

declare global {
  interface Window {
    __lenis?: import('lenis').default
  }
}
