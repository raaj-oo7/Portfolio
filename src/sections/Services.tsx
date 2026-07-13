import { motion } from 'framer-motion'
import { Atom, Bot, Gauge, Layers, Server, Sparkles, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, viewportOnce } from '@/animations/variants'
import { services } from '@/data/portfolio'
import { scrollToSection } from '@/utils'

const icons = { atom: Atom, sparkles: Sparkles, layers: Layers, bot: Bot, gauge: Gauge, server: Server } as const

/** What I can do for you — animated service cards. */
export function Services() {
  return (
    <section id="services" className="section-pad relative mx-auto max-w-6xl" aria-label="Services">
      <SectionHeading
        eyebrow="Services"
        title="How I can help"
        subtitle="From a single landing page to a full AI-powered platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = icons[service.icon as keyof typeof icons]
          return (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={i}
            >
              <GlassCard className="group h-full p-7">
                <div className="flex items-start justify-between">
                  <span className="glass glow-primary inline-flex h-12 w-12 items-center justify-center rounded-2xl text-primary-300 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={22} aria-hidden />
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="glass flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-accent-cyan/50"
                    aria-label={`Enquire about ${service.title}`}
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--fg-muted)">{service.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
