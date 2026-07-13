import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Award, BadgeCheck, Medal, Rocket, X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { scaleIn, viewportOnce } from '@/animations/variants'
import { achievements, type Achievement } from '@/data/portfolio'

const typeMeta: Record<Achievement['type'], { icon: typeof Award; color: string; label: string }> = {
  certificate: { icon: BadgeCheck, color: '#22d3ee', label: 'Certificate' },
  award: { icon: Award, color: '#fbbf24', label: 'Award' },
  badge: { icon: Medal, color: '#a855f7', label: 'Badge' },
  milestone: { icon: Rocket, color: '#34d399', label: 'Milestone' },
}

/** Certificates, awards, badges and milestones with 3D-hover cards. */
export function Achievements() {
  const [active, setActive] = useState<Achievement | null>(null)

  return (
    <section id="achievements" className="section-pad relative mx-auto max-w-6xl" aria-label="Achievements">
      <SectionHeading
        eyebrow="Achievements"
        title="Proof of work"
        subtitle="Certifications earned, awards won and milestones crossed along the way."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((a, i) => {
          const meta = typeMeta[a.type]
          return (
            <motion.div key={a.title} variants={scaleIn} custom={i}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={12} scale={1.03} transitionSpeed={1600} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(a)}
                  className="glass noise group relative h-full w-full overflow-hidden rounded-2xl p-6 text-left transition-colors hover:border-primary-500/40"
                  aria-label={`Open details for ${a.title}`}
                >
                  {/* glow orb */}
                  <span
                    aria-hidden
                    className="animate-glow-pulse absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-80"
                    style={{ background: meta.color }}
                  />
                  <span
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${meta.color}1c`, color: meta.color, boxShadow: `0 0 20px ${meta.color}33` }}
                  >
                    <meta.icon size={20} aria-hidden />
                  </span>
                  <p className="mt-4 font-mono text-[10px] tracking-widest uppercase" style={{ color: meta.color }}>
                    {meta.label} · {a.year}
                  </p>
                  <h3 className="font-display mt-1 text-base leading-snug font-bold">{a.title}</h3>
                  <p className="mt-1 text-xs text-(--fg-muted)">{a.issuer}</p>
                </button>
              </Tilt>
            </motion.div>
          )
        })}
      </motion.div>

      {/* expanded modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="glass-strong noise relative w-full max-w-md rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="glass absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
                aria-label="Close"
              >
                <X size={14} />
              </button>
              {(() => {
                const meta = typeMeta[active.type]
                return (
                  <>
                    <span
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: `${meta.color}1c`, color: meta.color, boxShadow: `0 0 32px ${meta.color}44` }}
                    >
                      <meta.icon size={26} aria-hidden />
                    </span>
                    <p className="mt-5 font-mono text-[10px] tracking-widest uppercase" style={{ color: meta.color }}>
                      {meta.label} · {active.year}
                    </p>
                    <h3 className="font-display mt-1 text-2xl font-bold">{active.title}</h3>
                    <p className="mt-1 text-sm text-primary-300">{active.issuer}</p>
                    <p className="mt-4 text-sm leading-relaxed text-(--fg-muted)">{active.description}</p>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
