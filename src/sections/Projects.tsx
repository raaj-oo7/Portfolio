import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects as fallbackProjects, type Project } from '@/data/portfolio'
import { fetchProjects } from '@/services/projects'
import { cn } from '@/utils'

/* --------------------------- device mockup shells -------------------------- */

/** Animated fake app UI rendered inside every mockup screen. */
function ScreenContent({ project }: { project: Project }) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden p-[7%]"
      style={{ background: `linear-gradient(135deg, ${project.accent}26 0%, #0a0b1e 55%, ${project.accent}14 100%)` }}
    >
      <div className="mb-[5%] flex items-center gap-[3%]">
        <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
        <span className="h-1.5 w-1/3 rounded-full bg-white/25" />
      </div>
      {[0.85, 0.6, 0.72, 0.45].map((w, i) => (
        <motion.span
          key={i}
          className="mb-[4%] block h-[4%] min-h-1 rounded-full"
          style={{ width: `${w * 100}%`, background: i === 0 ? project.accent : 'rgba(255,255,255,0.18)' }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
          viewport={{ once: true }}
        />
      ))}
      <div className="mt-auto grid grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-square rounded-md bg-white/8" style={i === 1 ? { background: `${project.accent}33` } : undefined} />
        ))}
      </div>
      <p className="font-display absolute right-[7%] bottom-[6%] text-[9px] font-bold tracking-widest text-white/40 uppercase">
        {project.title}
      </p>
    </div>
  )
}

function DeviceMockup({ project }: { project: Project }) {
  if (project.device === 'mobile') {
    return (
      <div className="mx-auto aspect-[9/16] w-36 rounded-[1.6rem] border-4 border-night-700 bg-night-900 p-1 shadow-2xl md:w-40">
        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem]">
          <ScreenContent project={project} />
          <span className="absolute top-1 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/70" aria-hidden />
        </div>
      </div>
    )
  }
  if (project.device === 'laptop') {
    return (
      <div className="mx-auto w-full max-w-72">
        <div className="aspect-[16/10] rounded-t-xl border-4 border-b-0 border-night-700 bg-night-900 p-0.5">
          <div className="h-full w-full overflow-hidden rounded-t-lg">
            <ScreenContent project={project} />
          </div>
        </div>
        <div className="h-2.5 rounded-b-xl bg-gradient-to-b from-night-700 to-night-800 shadow-xl" />
      </div>
    )
  }
  // browser
  return (
    <div className="mx-auto w-full max-w-80 overflow-hidden rounded-xl border border-night-700 bg-night-900 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-night-800 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
        <span className="h-2 w-2 rounded-full bg-green-400/80" />
        <span className="ml-2 h-3.5 flex-1 rounded-full bg-white/8 px-2 font-mono text-[8px] leading-[0.9rem] text-white/35">
          {project.demo.replace('https://', '')}
        </span>
      </div>
      <div className="aspect-[16/10]">
        <ScreenContent project={project} />
      </div>
    </div>
  )
}

/* --------------------------------- section -------------------------------- */

/** Filterable project gallery with device mockups, synced live from GitHub. */
export function Projects() {
  const [filter, setFilter] = useState<string>('All')
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProjects().then((result) => {
      if (cancelled) return
      setProjects(result.projects)
      setLive(result.live)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filters = useMemo(
    () => ['All', ...new Set(projects.flatMap((p) => p.tags))],
    [projects],
  )
  // keep the active filter valid if the live repo list changes the tag set
  useEffect(() => {
    if (!filters.includes(filter)) setFilter('All')
  }, [filters, filter])

  const visible =
    filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter as Project['tags'][number]))

  return (
    <section id="projects" className="section-pad relative mx-auto max-w-6xl" aria-label="Projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        subtitle={
          live
            ? 'Synced live from my GitHub — every card links to the real repository.'
            : 'Hands-on projects — every card links to the real repository on GitHub.'
        }
      />

      {/* filters */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'relative rounded-full px-5 py-2 text-sm font-medium transition-colors',
              filter === f ? 'text-white' : 'glass text-(--fg-muted) hover:text-(--fg)',
            )}
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-accent-purple glow-ring"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{f}</span>
          </button>
        ))}
      </div>

      {/* grid */}
      <motion.div layout className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Tilt tiltMaxAngleX={7} tiltMaxAngleY={10} scale={1.02} transitionSpeed={1800} className="h-full">
                <div className="glass noise relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-300 hover:border-primary-500/40">
                  {/* mockup stage */}
                  <div
                    className="relative flex items-center justify-center px-6 pt-10 pb-6"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${project.accent}1f, transparent 70%)` }}
                  >
                    <div className="transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.03]">
                      <DeviceMockup project={project} />
                    </div>
                    {/* hover action buttons */}
                    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <FaGithub size={13} /> Code
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-purple px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105"
                        aria-label={`${project.title} live demo`}
                      >
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    </div>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-6 pt-2">
                    <h3 className="font-display text-lg font-bold">{project.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-(--fg-muted)">{project.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
                      {project.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full px-2.5 py-0.5 font-mono text-[10px]"
                          style={{ background: `${project.accent}1a`, color: project.accent, border: `1px solid ${project.accent}40` }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tilt>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
