import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SECTION_IDS, type SectionId } from '@/constants'
import { useAppStore } from '@/store/useAppStore'
import { syncSectionUrl } from '@/utils'

/**
 * Track which section is in view to highlight navigation and keep the URL
 * in sync. Re-arms on every visit to '/' — without this, navigating away
 * (e.g. to /blog) and back leaves the observer watching DOM nodes Home
 * already unmounted, so the nav pill freezes on whatever section was last
 * active before you left.
 */
export function useActiveSection(enabled: boolean) {
  const setActiveSection = useAppStore((s) => s.setActiveSection)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled || pathname !== '/') return

    let observer: IntersectionObserver | null = null
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false
    let attempts = 0

    const arm = () => {
      if (cancelled) return
      const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null,
      )
      // Lazy-loaded sections may not all exist on the first pass yet —
      // retry briefly instead of silently observing only a partial set.
      if (sections.length < SECTION_IDS.length && attempts < 30) {
        attempts += 1
        retryTimer = setTimeout(arm, 100)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id as SectionId)
              syncSectionUrl(entry.target.id)
            }
          }
        },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      sections.forEach((el) => observer!.observe(el))

      // Resolve the current section immediately rather than waiting for the
      // next scroll event — this is what actually fixes the stale-pill bug.
      const probeY = window.innerHeight * 0.45
      const current = sections.find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probeY && r.bottom >= probeY
      })
      if (current) {
        setActiveSection(current.id as SectionId)
        syncSectionUrl(current.id)
      }
    }

    arm()
    return () => {
      cancelled = true
      clearTimeout(retryTimer)
      observer?.disconnect()
    }
  }, [enabled, pathname, setActiveSection])
}
