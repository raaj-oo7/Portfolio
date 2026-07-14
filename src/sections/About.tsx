import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Tilt from 'react-parallax-tilt'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from '@/animations/variants'
import { about, personal, socials } from '@/data/portfolio'
import { scrollToSection } from '@/utils'

/* ----------------------------- terminal card ----------------------------- */

const STACK_COLORS: Record<string, string> = {
  React: '#61dafb',
  TypeScript: '#3178c6',
  Tailwind: '#22d3ee',
  GSAP: '#8cc84b',
  'Three.js': '#a855f7',
  AI: '#34d399',
}

function StackList() {
  return (
    <div className="mt-1 mb-3 flex flex-wrap gap-x-4 gap-y-1">
      {Object.entries(STACK_COLORS).map(([tech, color]) => (
        <span key={tech} style={{ color }}>
          {tech}
        </span>
      ))}
    </div>
  )
}

function WhoAmI() {
  return (
    <div className="mt-1 mb-3">
      <p className="font-semibold text-white">Raj Makadia</p>
      <p className="text-(--fg-muted)">React Developer</p>
      <p className="text-(--fg-muted)">Frontend Engineer</p>
      <p className="text-(--fg-muted)">AI Enthusiast</p>
    </div>
  )
}

function StatusLine() {
  return (
    <p className="mt-1 mb-3 text-accent-emerald">
      <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-emerald align-middle" />
      Available for new opportunities
    </p>
  )
}

/** Boot script the terminal types out on first scroll-into-view. */
const SCRIPT = [
  { cmd: 'whoami', out: <WhoAmI /> },
  { cmd: 'current-stack', out: <StackList /> },
  { cmd: 'status', out: <StatusLine /> },
]

const HELP_LINES: [string, string][] = [
  ['whoami', 'who you are talking to'],
  ['current-stack', 'technologies in daily rotation'],
  ['status', 'availability for work'],
  ['projects', 'jump to the projects section'],
  ['contact', 'jump to the contact form'],
  ['blog', 'open the blog'],
  ['github', 'open GitHub in a new tab'],
  ['linkedin', 'open LinkedIn in a new tab'],
  ['resume', 'download the résumé'],
  ['date', 'print the current date'],
  ['clear', 'clear the terminal'],
  ['help', 'show this list'],
]

const Prompt = () => (
  <>
    <span className="text-accent-emerald">raj@portfolio</span>
    <span className="text-(--fg-muted)">:~$</span>{' '}
  </>
)

const Caret = () => <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-accent-cyan align-middle" />

interface HistoryEntry {
  id: number
  cmd: string
  out: ReactNode
}

let historyId = 0

/**
 * Glass terminal: types the boot script when scrolled into view, then hands
 * control to a real, typeable prompt with a small command set wired into
 * actual site navigation (projects/contact/blog/github/linkedin/resume).
 */
function TerminalCard() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 })
  const navigate = useNavigate()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // scripted boot sequence
  const [step, setStep] = useState(reduced ? SCRIPT.length : 0)
  const [typed, setTyped] = useState(0)

  // interactive shell state
  const [cleared, setCleared] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [draft, setDraft] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [logIndex, setLogIndex] = useState<number | null>(null)

  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const interactive = step >= SCRIPT.length

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

  // keep the newest line in view as the transcript grows
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, step, typed, cleared])

  const openLink = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')

  function run(raw: string): ReactNode {
    const cmd = raw.trim()
    const lower = cmd.toLowerCase()

    if (lower === 'help') {
      return (
        <ul className="mt-1 mb-3 space-y-0.5">
          {HELP_LINES.map(([name, desc]) => (
            <li key={name}>
              <span className="inline-block w-28 text-accent-cyan">{name}</span>
              <span className="text-(--fg-muted)">{desc}</span>
            </li>
          ))}
        </ul>
      )
    }
    if (lower === 'whoami') return <WhoAmI />
    if (lower === 'current-stack' || lower === 'skills') return <StackList />
    if (lower === 'status') return <StatusLine />
    if (lower === 'clear' || lower === 'cls') {
      setCleared(true)
      setHistory([])
      return null
    }
    if (lower === 'projects') {
      setTimeout(() => scrollToSection('projects'), 300)
      return <p className="mt-1 mb-3 text-(--fg-muted)">Opening projects…</p>
    }
    if (lower === 'contact') {
      setTimeout(() => scrollToSection('contact'), 300)
      return <p className="mt-1 mb-3 text-(--fg-muted)">Opening contact…</p>
    }
    if (lower === 'blog') {
      setTimeout(() => navigate('/blog'), 300)
      return <p className="mt-1 mb-3 text-(--fg-muted)">Opening the blog…</p>
    }
    if (lower === 'github') {
      const href = socials.find((s) => s.label === 'GitHub')?.href
      if (href) openLink(href)
      return <p className="mt-1 mb-3 text-(--fg-muted)">Opening GitHub in a new tab…</p>
    }
    if (lower === 'linkedin') {
      const href = socials.find((s) => s.label === 'LinkedIn')?.href
      if (href) openLink(href)
      return <p className="mt-1 mb-3 text-(--fg-muted)">Opening LinkedIn in a new tab…</p>
    }
    if (lower === 'resume' || lower === 'cv') {
      const a = document.createElement('a')
      a.href = personal.resumeUrl
      a.download = ''
      a.click()
      return <p className="mt-1 mb-3 text-(--fg-muted)">Downloading résumé…</p>
    }
    if (lower.startsWith('sudo')) {
      return <p className="mt-1 mb-3 text-red-400">Nice try. Permission denied: you are not root here 😄</p>
    }
    if (lower === 'date') {
      return <p className="mt-1 mb-3 text-(--fg-muted)">{new Date().toString()}</p>
    }
    if (lower.startsWith('echo ')) {
      return <p className="mt-1 mb-3 text-white">{cmd.slice(5)}</p>
    }
    return (
      <p className="mt-1 mb-3 text-red-400">
        command not found: {cmd} — type <span className="text-accent-cyan">help</span> for a list
      </p>
    )
  }

  function submit() {
    const cmd = draft
    setDraft('')
    setLogIndex(null)
    const trimmed = cmd.trim()
    if (trimmed === '') return
    setLog((l) => [...l, cmd])
    const out = run(cmd)
    const lower = trimmed.toLowerCase()
    if (lower !== 'clear' && lower !== 'cls') {
      setHistory((h) => [...h, { id: historyId++, cmd, out }])
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (log.length === 0) return
      const next = logIndex === null ? log.length - 1 : Math.max(0, logIndex - 1)
      setLogIndex(next)
      setDraft(log[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (logIndex === null) return
      const next = logIndex + 1
      if (next >= log.length) {
        setLogIndex(null)
        setDraft('')
      } else {
        setLogIndex(next)
        setDraft(log[next])
      }
    }
  }

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
            {interactive && <span className="ml-auto font-mono text-[10px] text-(--fg-muted)/70">try &apos;help&apos;</span>}
          </div>

          {/* terminal body — a real, typeable shell once the boot script finishes */}
          <div
            ref={bodyRef}
            onClick={() => inputRef.current?.focus()}
            className="noise relative h-[340px] overflow-y-auto p-5 font-mono text-[13px] leading-6 md:h-[380px] md:p-6 md:text-sm"
          >
            {!cleared &&
              SCRIPT.map((entry, i) => {
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

            {interactive &&
              history.map((h) => (
                <div key={h.id}>
                  <p className="text-white">
                    <Prompt />
                    {h.cmd}
                  </p>
                  {h.out}
                </div>
              ))}

            {/* live prompt */}
            {interactive && (
              <div className="flex items-center text-white">
                <Prompt />
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal command input — type help for a list of commands"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-white caret-accent-cyan outline-none md:text-sm"
                />
              </div>
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
