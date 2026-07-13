import { useEffect } from 'react'
import { SECTION_IDS, type SectionId } from '@/constants'
import { useAppStore } from '@/store/useAppStore'

/** Track which section is in view to highlight navigation. */
export function useActiveSection(enabled: boolean) {
  const setActiveSection = useAppStore((s) => s.setActiveSection)

  useEffect(() => {
    if (!enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [enabled, setActiveSection])
}
