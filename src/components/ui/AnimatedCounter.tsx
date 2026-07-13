import { useEffect, useRef, useState } from 'react'

interface Props {
  /** Target value to count to */
  end: number
  /** Animation duration in seconds */
  duration?: number
  /** Start counting (e.g. when scrolled into view) */
  start?: boolean
  /** Thousands separator */
  separator?: string
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** rAF-driven count-up number, replacing react-countup. */
export function AnimatedCounter({ end, duration = 2, start = true, separator = ',' }: Props) {
  const [value, setValue] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    if (!start) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / (duration * 1000))
      setValue(Math.round(easeOutExpo(p) * end))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [end, duration, start])

  const text = separator
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : value.toString()

  return <>{text}</>
}
