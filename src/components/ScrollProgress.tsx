import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin gradient bar at the very top showing page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[101] h-[3px] origin-left bg-gradient-to-r from-primary-500 via-accent-purple to-accent-cyan"
      style={{ scaleX }}
    />
  )
}
