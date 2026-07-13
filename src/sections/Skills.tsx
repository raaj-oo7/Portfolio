import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useNearViewport } from '@/hooks/useNearViewport'
import { skills, type Skill } from '@/data/portfolio'

const SkillsGalaxy = lazy(() =>
  import('@/three/SkillsGalaxy').then((m) => ({ default: m.SkillsGalaxy })),
)

/** Skills as an interactive 3D galaxy; clicking a planet opens a detail panel. */
export function Skills() {
  const [selected, setSelected] = useState<Skill | null>(null)
  // Mount the galaxy canvas only while this section is near the viewport
  const { ref: stageRef, visible } = useNearViewport<HTMLDivElement>('200px')

  return (
    <section id="skills" className="section-pad relative" aria-label="Skills">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills Galaxy"
          title="Technologies in orbit"
          subtitle="Every planet is a technology I ship with. Hover to inspect, click for the full story."
        />
      </div>

      <div ref={stageRef} className="relative mx-auto h-[560px] max-w-6xl overflow-hidden rounded-3xl border border-(--line) md:h-[640px]">
        <ErrorBoundary
          fallback={
            <div className="grid h-full place-content-center gap-3 p-8 sm:grid-cols-3">
              {skills.map((s) => (
                <button key={s.name} type="button" onClick={() => setSelected(s)} className="glass rounded-2xl p-4 text-left">
                  <p className="font-semibold" style={{ color: s.color }}>{s.name}</p>
                  <p className="text-xs text-(--fg-muted)">{s.category}</p>
                </button>
              ))}
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-xs text-(--fg-muted) animate-pulse">Igniting galaxy…</span>
              </div>
            }
          >
            {visible && <SkillsGalaxy onSelect={setSelected} selected={selected} />}
          </Suspense>
        </ErrorBoundary>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.aside
              key={selected.name}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="glass-strong absolute top-4 right-4 bottom-4 z-20 w-[min(21rem,calc(100%-2rem))] overflow-y-auto rounded-2xl p-6"
              aria-label={`${selected.name} details`}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="glass absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:border-primary-500/50"
                aria-label="Close skill details"
              >
                <X size={14} />
              </button>

              <span
                className="inline-block h-12 w-12 rounded-full"
                style={{ background: `radial-gradient(circle at 35% 30%, ${selected.color}, transparent 90%)`, boxShadow: `0 0 32px ${selected.color}66` }}
                aria-hidden
              />
              <h3 className="font-display mt-4 text-2xl font-bold">{selected.name}</h3>
              <p className="mt-0.5 font-mono text-xs text-(--fg-muted)">
                {selected.category} · {selected.years} years experience
              </p>

              {/* proficiency bar */}
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[10px] text-(--fg-muted) uppercase">
                  <span>Proficiency</span>
                  <span>{selected.level}/100</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selected.level}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${selected.color}, #a855f7)` }}
                  />
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-(--fg-muted)">{selected.description}</p>

              <ul className="mt-4 space-y-2">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: selected.color }} aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>

        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
          drag-free galaxy · hover a planet · click for details
        </p>
      </div>
    </section>
  )
}
