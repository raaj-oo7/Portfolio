import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Download, Mail, ChevronDown } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useNearViewport } from '@/hooks/useNearViewport'
import { personal, socials } from '@/data/portfolio'
import { scrollToSection } from '@/utils'

const WorkspaceScene = lazy(() =>
  import('@/three/WorkspaceScene').then((m) => ({ default: m.WorkspaceScene })),
)

const socialIcons = { github: FaGithub, linkedin: FaLinkedinIn, twitter: FaXTwitter, mail: Mail } as const

/** Fullscreen cinematic hero with the interactive 3D workspace. */
export function Hero() {
  // Only run the WebGL scene while the hero is actually on screen
  const { ref: stageRef, visible } = useNearViewport<HTMLDivElement>('150px')

  return (
    <section id="home" className="relative flex min-h-svh flex-col overflow-hidden" aria-label="Introduction">
      {/* 3D workspace fills the hero */}
      <div ref={stageRef} className="absolute inset-0">
        <ErrorBoundary fallback={<div className="h-full w-full bg-gradient-to-b from-transparent to-primary-900/20" />}>
          <Suspense fallback={null}>{visible && <WorkspaceScene />}</Suspense>
        </ErrorBoundary>
        {/* readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--bg)/60 via-transparent to-(--bg)" />
      </div>

      {/* content */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass pointer-events-auto mb-6 rounded-full px-5 py-2 font-mono text-xs tracking-wider text-accent-cyan"
        >
          ✦ Available for new opportunities
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance md:text-7xl"
        >
          Hello, I'm <span className="text-gradient">{personal.name}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="font-display mt-5 h-10 text-2xl font-semibold text-(--fg-muted) md:text-3xl"
          aria-live="polite"
        >
          <TypeAnimation
            sequence={personal.roles.flatMap((r) => [r, 2200])}
            speed={45}
            deletionSpeed={65}
            repeat={Infinity}
            cursor
            className="text-primary-300"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 max-w-xl text-base text-pretty text-(--fg-muted) md:text-lg"
        >
          {personal.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href={personal.resumeUrl} download ariaLabel="Download resume">
            <Download size={16} /> Download Resume
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => scrollToSection('contact')} ariaLabel="Go to contact section">
            <Mail size={16} /> Get in Touch
          </MagneticButton>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="pointer-events-auto mt-8 flex items-center gap-3"
          aria-label="Social links"
        >
          {socials.map((s) => {
            const Icon = socialIcons[s.icon as keyof typeof socialIcons]
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="glass flex h-11 w-11 items-center justify-center rounded-full text-(--fg-muted) transition-all hover:scale-110 hover:border-primary-500/50 hover:text-primary-300"
                >
                  <Icon size={18} />
                </a>
              </li>
            )
          })}
        </motion.ul>
      </div>

      {/* scroll indicator */}
      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-(--fg-muted) transition-colors hover:text-primary-300"
        aria-label="Scroll to about section"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown size={18} />
        </motion.span>
      </motion.button>
    </section>
  )
}
