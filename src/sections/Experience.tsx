import { useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, viewportOnce } from '@/animations/variants'
import { experience } from '@/data/portfolio'
import { cn } from '@/utils'

/** Vertical timeline that draws itself on scroll; cards expand for details. */
export function Experience() {
  const lineRef = useRef<HTMLDivElement>(null)
  // all cards collapsed by default; click a card header to expand
  const [expanded, setExpanded] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 40%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="experience" className="section-pad relative mx-auto max-w-4xl" aria-label="Work experience">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've shipped"
        subtitle="Four years of turning ambitious ideas into production software."
      />

      <div ref={lineRef} className="relative">
        {/* rail */}
        <div aria-hidden className="absolute top-0 bottom-0 left-4 w-px bg-(--line) md:left-1/2" />
        <motion.div
          aria-hidden
          style={{ scaleY }}
          className="timeline-line absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-primary-500 via-accent-purple to-accent-cyan md:left-1/2"
        />

        <ol className="space-y-10">
          {experience.map((job, i) => {
            const isOpen = expanded === i
            const side = i % 2 === 0
            return (
              <motion.li
                key={job.company}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeUp}
                custom={i}
                className={cn('relative pl-12 md:w-1/2 md:pl-0', side ? 'md:pr-10' : 'md:ml-auto md:pl-10')}
              >
                {/* node */}
                <span
                  aria-hidden
                  className={cn(
                    'glow-primary absolute top-7 left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-400 to-accent-purple',
                    side ? 'md:left-full md:translate-x-[calc(2.5rem-50%)]' : 'md:left-0 md:-translate-x-[calc(2.5rem+50%)]',
                  )}
                />
                <GlassCard className="p-6">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <div>
                      <p className="font-mono text-xs text-accent-cyan">{job.period}</p>
                      <h3 className="font-display mt-1 text-lg font-bold">{job.role}</h3>
                      <p className="text-sm font-medium text-primary-300">{job.company}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-(--fg-muted)">
                        <MapPin size={11} /> {job.location}
                      </p>
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="glass mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>

                  <p className="mt-3 text-sm leading-relaxed text-(--fg-muted)">{job.summary}</p>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-3 space-y-2 border-t border-(--line) pt-3">
                      {job.responsibilities.map((r) => (
                        <li key={r} className="flex gap-2 text-sm text-(--fg-muted)">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-emerald" aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                    {job.tech.map((t) => (
                      <li key={t} className="rounded-full border border-primary-500/25 bg-primary-500/10 px-2.5 py-0.5 font-mono text-[10px] text-primary-300">
                        {t}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
