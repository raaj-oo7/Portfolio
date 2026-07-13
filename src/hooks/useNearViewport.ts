import { useEffect, useRef, useState } from 'react'

/**
 * Track whether a container is near the viewport so expensive children
 * (WebGL canvases) mount only while they can actually be seen.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin = '250px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])

  return { ref, visible }
}
