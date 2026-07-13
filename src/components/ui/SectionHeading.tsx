import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/animations/variants'
import { cn } from '@/utils'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}

/** Consistent animated heading used at the top of every section. */
export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn('mb-14 max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}
    >
      <motion.span
        variants={fadeUp}
        custom={0}
        className="mb-3 inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1 font-mono text-xs tracking-widest text-primary-400 uppercase"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        custom={1}
        className="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-base text-(--fg-muted) md:text-lg">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
