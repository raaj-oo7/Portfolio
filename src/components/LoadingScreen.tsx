import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { personal } from '@/data/portfolio'

/**
 * Cinematic intro: animated logo mark, counting progress,
 * floating particles, then a smooth particle-burst reveal.
 */
export function LoadingScreen() {
  const { loadingProgress, setLoadingProgress, introDone, finishIntro } = useAppStore()
  const [exiting, setExiting] = useState(false)

  // Simulated asset-load progress that eases toward 100
  useEffect(() => {
    if (introDone) return
    let value = 0
    const interval = setInterval(() => {
      const remaining = 100 - value
      value = Math.min(100, value + Math.max(1, remaining * 0.16) * (0.6 + Math.random() * 0.8))
      setLoadingProgress(Math.floor(value))
      if (value >= 100) {
        clearInterval(interval)
        setTimeout(() => setExiting(true), 450)
        setTimeout(() => finishIntro(), 1350)
      }
    }, 110)
    return () => clearInterval(interval)
  }, [introDone, setLoadingProgress, finishIntro])

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-night-950"
          aria-label="Loading portfolio"
          role="status"
        >
          {/* Drifting intro particles */}
          {Array.from({ length: 26 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute h-1 w-1 rounded-full bg-primary-400/70"
              initial={{
                x: `${(i * 37) % 100}vw`,
                y: '105vh',
                opacity: 0,
              }}
              animate={
                exiting
                  ? { y: '-10vh', opacity: 0, transition: { duration: 0.8, delay: i * 0.015 } }
                  : {
                      y: '-10vh',
                      opacity: [0, 0.9, 0],
                      transition: { duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.35, ease: 'linear' },
                    }
              }
            />
          ))}

          {/* Glow behind logo */}
          <motion.div
            aria-hidden
            className="absolute h-72 w-72 rounded-full bg-primary-600/30 blur-[90px]"
            animate={exiting ? { scale: 8, opacity: 0 } : { scale: [1, 1.25, 1] }}
            transition={exiting ? { duration: 0.9, ease: 'easeIn' } : { duration: 3, repeat: Infinity }}
          />

          {/* Logo mark — rotating 3D-feel cube + monogram */}
          <motion.div
            className="relative mb-10"
            animate={exiting ? { scale: 1.6, opacity: 0, filter: 'blur(8px)' } : {}}
            transition={{ duration: 0.7, ease: 'easeIn' }}
          >
            <motion.div
              aria-hidden
              className="absolute -inset-5 rounded-3xl border border-primary-500/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              aria-hidden
              className="absolute -inset-5 rounded-3xl border border-accent-cyan/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="glass-strong glow-primary flex h-24 w-24 items-center justify-center rounded-3xl"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="font-display text-gradient text-4xl font-bold">RM</span>
            </motion.div>
          </motion.div>

          {/* Name reveal */}
          <motion.p
            className="font-display mb-8 text-sm tracking-[0.5em] text-white/60 uppercase"
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={exiting ? { opacity: 0 } : { opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.2 }}
          >
            {personal.name}
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="relative h-[3px] w-56 overflow-hidden rounded-full bg-white/10"
            animate={exiting ? { opacity: 0, scaleX: 0.6 } : {}}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 via-accent-purple to-accent-cyan"
              style={{ width: `${loadingProgress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </motion.div>
          <motion.span
            className="mt-4 font-mono text-xs text-white/50 tabular-nums"
            animate={exiting ? { opacity: 0 } : {}}
          >
            {loadingProgress < 100 ? `Loading experience — ${loadingProgress}%` : 'Welcome'}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
