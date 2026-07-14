import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Tilt from 'react-parallax-tilt'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from '@/animations/variants'
import { about } from '@/data/portfolio'

/* ----------------------------- terminal card ----------------------------- */

const STACK_COLORS: Record<string, string> = {
  React: '#61dafb',
  TypeScript: '#3178c6',
  Tailwind: '#22d3ee',
  GSAP: '#8cc84b',
  'Three.js': '#a855f7',
  AI: '#34d399',
}

const SCRIPT = [
  {
    cmd: 'whoami',
    out: (
      <div className="mt-1 mb-3">
        <p className="font-semibold text-white">Raj Makadia</p>
        <p className="text-(--fg-muted)">React Developer</p>
        <p className="text-(--fg-muted)">Frontend Engineer</p>
        <p className="text-(--fg-muted)">AI Enthusiast</p>
      </div>
    ),
  },
  {
    cmd: 'current-stack',
    out: (
      <div className="mt-1 mb-3 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(STACK_COLORS).map(([tech, color]) => (
          <span key={tech} style={{ color }}>
            {tech}
          </span>
        ))}
      </div>
    ),
  },
  {
    cmd: 'status',
    out: (
      <p className="mt-1 mb-3 text-accent-emerald">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-emerald align-middle" />
        Available for new opportunities
      </p>
    ),
  },
]

const Prompt = () => (
  <>
    <span className="text-accent-emerald">raj@portfolio</span>
    <span className="text-(--fg-muted)">:~$</span>{' '}
  </>
)

const Caret = () => <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-accent-cyan align-middle" />

/** Glass terminal that "types" the whoami script when scrolled into view. */
function TerminalCard() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 })
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [step, setStep] = useState(reduced ? SCRIPT.length : 0) // current command index
  const [typed, setTyped] = useState(0) // chars typed of the current command

  useEffect(() => {
    if (!inView || step >= SCRIPT.length) return
    const cmd = SCRIPT[step].cmd
    if (typed < cmd.length) {
      const t = setTimeout(() => setTyped((c) => c + 1), 55)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setStep((s) => s + 1)
      setTyped(0)
    }, 420)
    return () => clearTimeout(t)
  }, [inView, step, typed])

  return (
    <div ref={ref}>
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.01}>
        <div className="glass glow-ring overflow-hidden rounded-3xl">
          {/* terminal chrome */}
          <div className="flex items-center gap-2 border-b border-(--line) bg-night-900/70 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="ml-2 font-mono text-xs text-(--fg-muted)">raj@portfolio: ~</span>
          </div>

          {/* terminal body */}
          <div className="noise relative min-h-72 p-5 font-mono text-[13px] leading-6 md:p-6 md:text-sm">
            {SCRIPT.map((entry, i) => {
              if (i > step) return null
              const isTyping = i === step
              return (
                <div key={entry.cmd}>
                  <p className="text-white">
                    <Prompt />
                    {isTyping ? entry.cmd.slice(0, typed) : entry.cmd}
                    {isTyping && <Caret />}
                  </p>
                  {!isTyping && entry.out}
                </div>
              )
            })}
            {/* idle prompt once the script finishes */}
            {step >= SCRIPT.length && (
              <p>
                <Prompt />
                <Caret />
              </p>
            )}
          </div>
        </div>
      </Tilt>
    </div>
  )
}

/* --------------------------------- section -------------------------------- */

/** About: terminal card, animated bio, mini journey timeline and counters. */
export function About() {
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.4 })

  return (
    <section id="about" className="section-pad relative mx-auto max-w-6xl" aria-label="About me">
      <SectionHeading
        eyebrow="About"
        title="The human behind the pixels"
        subtitle="Engineer by trade, designer at heart, always chasing that feeling when an interface just works."
      />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Terminal card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={slideInLeft}
          className="lg:sticky lg:top-28"
        >
          <TerminalCard />
        </motion.div>

        {/* Bio + journey */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={slideInRight}>
          <div className="space-y-4">
            {about.bio.map((para, i) => (
              <motion.p key={i} variants={fadeUp} custom={i} className="leading-relaxed text-(--fg-muted)">
                {para}
              </motion.p>
            ))}
          </div>

          {/* Mini journey */}
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-8 space-y-3"
            aria-label="Career journey"
          >
            {about.journey.map((step) => (
              <motion.li key={step.year} variants={fadeUp} className="flex items-start gap-4">
                <span className="glass mt-0.5 shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-bold text-accent-cyan">
                  {step.year}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-(--fg-muted)">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {about.stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={i}
          >
            <GlassCard className="p-6 text-center">
              <p className="font-display text-gradient text-4xl font-bold tabular-nums">
                <AnimatedCounter end={stat.value} duration={2.2} start={statsInView} />
                {stat.suffix}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-(--fg-muted) uppercase">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
