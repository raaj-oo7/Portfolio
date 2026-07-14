import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SKILL_ICONS } from '@/components/skillIcons'
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/animations/variants'
import { skills, type Skill } from '@/data/portfolio'

/* ------------------------------ tech tree data ---------------------------- */

const CATEGORY_COLORS: Record<Skill['category'], string> = {
  Frontend: '#22d3ee',
  Language: '#818cf8',
  Backend: '#34d399',
  Database: '#34d399',
  DevOps: '#f59e0b',
  AI: '#a855f7',
}

/** Honeycomb row layout (skill names). Unlisted skills flow into extra rows. */
const ROW_LAYOUT: string[][] = [
  ['HTML', 'JavaScript', 'TypeScript'],
  ['React', 'Next.js', 'Tailwind CSS', 'Three.js'],
  ['Node.js', 'AWS', 'AI / LLMs'],
]

function buildRows(): Skill[][] {
  const byName = new Map(skills.map((s) => [s.name, s]))
  const rows: Skill[][] = ROW_LAYOUT.map((row) =>
    row.map((name) => byName.get(name)).filter((s): s is Skill => Boolean(s)),
  ).filter((row) => row.length > 0)
  // any skill added later in portfolio.ts but missing from the layout still shows up
  const placed = new Set(ROW_LAYOUT.flat())
  const leftovers = skills.filter((s) => !placed.has(s.name))
  for (let i = 0; i < leftovers.length; i += 4) rows.push(leftovers.slice(i, i + 4))
  return rows
}

/* --------------------------------- hex tile -------------------------------- */

function HexTile({ skill, selected, onSelect }: { skill: Skill; selected: boolean; onSelect: (s: Skill) => void }) {
  const Icon = SKILL_ICONS[skill.name]
  const cat = CATEGORY_COLORS[skill.category]
  return (
    <motion.button
      type="button"
      variants={scaleIn}
      onClick={() => onSelect(skill)}
      aria-pressed={selected}
      aria-label={`${skill.name} — level ${skill.level} of 100`}
      className="group relative transition-transform duration-200 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110 focus-visible:outline-none"
      style={{ filter: selected ? `drop-shadow(0 0 16px ${skill.color}88)` : undefined }}
    >
      {/* outer hex = border tinted by category; inner hex = tile face.
          Sized off the --hex-w/--hex-h vars set on the honeycomb wrapper
          so tiles shrink to fit any viewport instead of overflowing it. */}
      <div
        className="hex-shape relative w-(--hex-w) h-(--hex-h)"
        style={{ background: selected ? `linear-gradient(150deg, ${cat}, ${skill.color})` : `${cat}44` }}
      >
        <div className="hex-shape absolute inset-[2px] flex flex-col items-center justify-center gap-1 bg-night-900/95">
          {Icon && (
            <Icon
              color={skill.color}
              className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-7 sm:w-7"
            />
          )}
          <span className="max-w-[86%] truncate font-mono text-[8px] font-semibold text-white/85 sm:text-[10px]">
            {skill.name}
          </span>
          <span className="font-mono text-[7px] text-(--fg-muted) sm:text-[9px]">{skill.level}%</span>
        </div>
      </div>
    </motion.button>
  )
}

/* --------------------------------- section -------------------------------- */

/** Skills as a hexagonal tech-tree with an always-open detail panel. */
export function Skills() {
  const [selected, setSelected] = useState<Skill>(skills[0])
  const rows = buildRows()
  const categories = [...new Set(skills.map((s) => s.category))]
  const SelectedIcon = SKILL_ICONS[selected.name]

  return (
    <section id="skills" className="section-pad relative mx-auto max-w-6xl" aria-label="Skills">
      <SectionHeading
        eyebrow="Tech Tree"
        title="Skills, unlocked"
        subtitle="Every hexagon is a technology I ship with. Click one to inspect it."
      />

      {/* category legend */}
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-10 flex flex-wrap items-center justify-center gap-2"
        aria-label="Skill categories"
      >
        {categories.map((c) => (
          <motion.li
            key={c}
            variants={fadeUp}
            className="glass flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-wider text-(--fg-muted) uppercase"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[c] }} aria-hidden />
            {c}
          </motion.li>
        ))}
      </motion.ul>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* honeycomb — --hex-w/--hex-h scale fluidly with viewport width so
            the widest row (4 tiles) always fits; overflow-x-auto is a safety
            net for extreme narrow widths so a tile can never go unreachable */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="hex-honeycomb flex w-full flex-col items-center overflow-x-auto py-2"
        >
          {rows.map((row, ri) => (
            <div key={ri} className="hex-row flex justify-center gap-1.5 sm:gap-2.5">
              {row.map((skill) => (
                <HexTile key={skill.name} skill={skill} selected={selected.name === skill.name} onSelect={setSelected} />
              ))}
            </div>
          ))}
          <p className="mt-8 font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
            click a hexagon for details
          </p>
        </motion.div>

        {/* detail panel */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            <motion.aside
              key={selected.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass noise relative overflow-hidden rounded-3xl p-7"
              aria-label={`${selected.name} details`}
            >
              {/* glow accent */}
              <span
                aria-hidden
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 blur-3xl"
                style={{ background: selected.color }}
              />

              <div className="flex items-center gap-4">
                <span
                  className="hex-shape flex h-14 w-16 items-center justify-center"
                  style={{ background: `linear-gradient(150deg, ${CATEGORY_COLORS[selected.category]}66, ${selected.color}33)` }}
                >
                  {SelectedIcon && <SelectedIcon size={26} color={selected.color} />}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold">{selected.name}</h3>
                  <p className="font-mono text-xs text-(--fg-muted)">
                    {selected.category} · {selected.years} years experience
                  </p>
                </div>
              </div>

              {/* proficiency bar */}
              <div className="mt-5">
                <div className="flex justify-between font-mono text-[10px] text-(--fg-muted) uppercase">
                  <span>Proficiency</span>
                  <span>{selected.level}/100</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selected.level}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
