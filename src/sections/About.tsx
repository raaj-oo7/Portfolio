import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import Tilt from 'react-parallax-tilt'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from '@/animations/variants'
import { about, personal } from '@/data/portfolio'

/** About: portrait, animated bio, mini journey timeline and counters. */
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
        {/* Portrait card */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={slideInLeft}>
          <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.15} glareBorderRadius="24px" scale={1.02}>
            <div className="glass noise glow-ring relative overflow-hidden rounded-3xl p-2">
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/60 via-night-800 to-accent-purple/20">
                {/* stylised monogram portrait placeholder — swap with /avatar.jpg */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.35),transparent_60%)]" />
                <span className="font-display text-gradient text-8xl font-bold select-none">RM</span>
                <div className="absolute right-4 bottom-4 left-4 rounded-2xl px-4 py-3 glass-strong">
                  <p className="font-display text-sm font-semibold">{personal.name}</p>
                  <p className="text-xs text-(--fg-muted)">{personal.location} · {personal.roles[0]}</p>
                </div>
              </div>
            </div>
          </Tilt>
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
